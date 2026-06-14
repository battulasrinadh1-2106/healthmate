import { type Request, type Response } from "express";
import UserDefault from "../models/User.ts";
import BMIRecordDefault from "../models/BMIRecord.ts";
import StepHistoryDefault from "../models/StepHistory.ts";
import FutureSelfDefault from "../models/FutureSelf.ts";
import { getDbMode, getLastError } from "../config/db.ts";
import { GoogleGenAI, Type } from "@google/genai";
import { FOODS_DATABASE } from "../../src/data/foods.ts";
import { findLocalFood, CUSTOM_ROASTS, type LocalFoodItem } from "./foodDatabase.ts";
import crypto from "crypto";
import nodemailer from "nodemailer";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    const isProduction = process.env.NODE_ENV === "production";
    
    if (!key) {
      if (isProduction) {
        throw new Error("GEMINI_API_KEY environment variable is required in production.");
      }
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. Food roasting will use local database fallback.");
    }
    
    aiClient = new GoogleGenAI({
      apiKey: key || "PLACEHOLDER_FOR_DEVELOPMENT_ONLY",
      httpOptions: {
        headers: {
          'User-Agent': 'healthmate-app',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Executes generateContent calls with robust automated exponential backoff
 * in order to handle typical transient cloud bottlenecks (such as 503 / 429 status codes).
 */
async function callGeminiWithRetry(ai: any, params: any, maxRetries = 4, initialDelayMs = 800): Promise<any> {
  let attempt = 0;
  let delay = initialDelayMs;
  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      const errMsg = String(err.message || err);
      const isTransient = errMsg.includes("503") || 
                          errMsg.includes("500") ||
                          errMsg.includes("UNAVAILABLE") || 
                          errMsg.includes("429") || 
                          errMsg.includes("high demand") || 
                          errMsg.includes("Service Unavailable") ||
                          errMsg.includes("busy") ||
                          errMsg.includes("RESOURCE_EXHAUSTED") ||
                          errMsg.includes("overloaded");

      if (isTransient && attempt < maxRetries) {
        const jitter = 0.85 + Math.random() * 0.3;
        const currentDelay = Math.round(delay * jitter);
        
        console.log(`⚠️ Gemini API transient condition detected. Engaging automated route resilience. Retry attempt ${attempt}/${maxRetries} in ${currentDelay}ms.`);
        
        if (params && params.model === "gemini-3.5-flash") {
          console.log(`🔄 [LOAD-ROUTING] Adjusting active model selection to "gemini-3.1-flash-lite" to process the request on backup channel.`);
          params.model = "gemini-3.1-flash-lite";
        }
        
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}

// In-Memory databases fallback simulation for multiple users
const cacheUsers: any[] = [];
const cacheFutureSelves: any[] = [];

const cacheBmiRecords: any[] = [];
const cacheStepRecords: any[] = [];

// Helper to calculate BMI
function calculateBmiValue(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

// Helper to classify BMI
function classifyBmiValue(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25.0) return "Healthy";
  if (bmi < 30.0) return "Overweight";
  return "Obesity";
}

const activeOtps = new Map<string, { otp: string; expires: Date }>();

/**
 * POST /auth/send-otp
 * Generates and sends a secure 6-digit OTP code to the requested email
 */
export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Please enter your email address.",
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email format contains @
    if (!emailLower.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address.",
      });
    }

    // Attempt to locate user name for pleasant personalization, default to 'HealthMate User'
    let userName = "HealthMate User";
    let isFallback = getDbMode() === "fallback-memory";

    let mdbUser = null;
    if (!isFallback) {
      try {
        mdbUser = await UserDefault.findOne({
          $or: [
            { email: emailLower },
            { email: { $regex: new RegExp("^" + emailLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") } }
          ]
        } as any);
      } catch (err) {
        console.warn("⚠️ Live MongoDB unique check deferred on send-otp:", err);
      }
    }

    const memUser = cacheUsers.find((u) => u.email.toLowerCase().trim() === emailLower);

    const existingUser = mdbUser || memUser;
    if (existingUser && existingUser.name) {
      userName = existingUser.name;
    } else {
      const partBeforeAt = emailLower.split("@")[0];
      userName = partBeforeAt.charAt(0).toUpperCase() + partBeforeAt.slice(1);
    }

    // Generate secure 6-digit verification code
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiry

    activeOtps.set(emailLower, { otp, expires });

    const mailResult = await sendOtpEmail(emailLower, otp, userName);

    if (!mailResult.sent) {
      return res.status(500).json({
        success: false,
        error: "Unable to send verification email. Please try again shortly."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Check your inbox 📩 We've sent a verification code to your email address."
    });

  } catch (err: any) {
    console.error("sendOtp error:", err);
    return res.status(500).json({
      success: false,
      error: "We couldn't send your verification code right now. Please try again shortly.",
    });
  }
}

/**
 * POST /auth/verify-otp
 * Verifies the 6-digit OTP passcode and logs in or creates user immediately
 */
export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Verification email and passcode are required.",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const otpStr = otp.toString().trim();

    // Verify OTP against Map
    const record = activeOtps.get(emailLower);
    if (!record) {
      return res.status(400).json({
        success: false,
        error: "Invalid verification code. Please check your email and try again.",
      });
    }

    if (new Date() > record.expires) {
      activeOtps.delete(emailLower);
      return res.status(400).json({
        success: false,
        error: "Your verification code has expired. Please request a new code.",
      });
    }

    if (record.otp !== otpStr) {
      return res.status(400).json({
        success: false,
        error: "Invalid verification code. Please check your email and try again.",
      });
    }

    // Consume OTP code on successful lookup
    activeOtps.delete(emailLower);

    const isFallback = getDbMode() === "fallback-memory";
    let user: any = null;

    // Search for existing user
    if (!isFallback) {
      try {
        user = await UserDefault.findOne({
          $or: [
            { email: emailLower },
            { email: { $regex: new RegExp("^" + emailLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") } }
          ]
        } as any);
      } catch (err) {
        console.warn("⚠️ MDB lookup error during OTP verify:", err);
      }
    }

    if (!user) {
      user = cacheUsers.find((u) => u.email.toLowerCase().trim() === emailLower);
    }

    let isNewSignup = false;

    // If user does not exist, automatically perform signup
    if (!user) {
      isNewSignup = true;
      const partBeforeAt = emailLower.split("@")[0];
      const defaultName = partBeforeAt.charAt(0).toUpperCase() + partBeforeAt.slice(1);

      if (isFallback) {
        user = {
          _id: `mem_user_${Date.now()}`,
          name: defaultName,
          email: emailLower,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        cacheUsers.push(user);
      } else {
        // Create user in live MongoDB
        const mdbUser = new UserDefault({
          name: defaultName,
          email: emailLower,
        });

        await mdbUser.save();
        user = mdbUser;

        // Sync to cacheUsers memory index for robust tracking
        try {
          cacheUsers.push({
            _id: String(mdbUser._id),
            name: mdbUser.name,
            email: emailLower,
            createdAt: mdbUser.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: mdbUser.updatedAt?.toISOString() || new Date().toISOString(),
          });
        } catch (_) {}
      }
    }

    // Map user attributes for frontend session
    const userToSend = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      bmiCategory: user.bmiCategory,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: isNewSignup ? "Profile registered and verified!" : "Session successfully authenticated!",
      isNewSignup,
      data: userToSend,
      databaseMode: isFallback ? "fallback-memory" : "mongodb",
    });

  } catch (err: any) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({
      success: false,
      error: "We couldn't verify your verification code right now. Please try again shortly.",
    });
  }
}

/**
 * POST /create-profile
 * Overwrites individual profile measurements
 */
export async function createProfile(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Missing active session credential header: x-user-id",
      });
    }

    const { name, fullName, age, gender, height, weight, activityLevel } = req.body;

    if (!age || !gender || !height || !weight || !activityLevel) {
      return res.status(400).json({
        success: false,
        error: "Missing parameters. Required fields: age, gender, height, weight, activityLevel",
      });
    }

    const parsedAge = parseInt(age);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    const bmiValue = calculateBmiValue(parsedWeight, parsedHeight);
    const bmiCategory = classifyBmiValue(bmiValue);

    const profileData = {
      age: parsedAge,
      gender,
      height: parsedHeight,
      weight: parsedWeight,
      activityLevel,
      bmiCategory,
    };

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const idx = cacheUsers.findIndex((u) => u._id === userId);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          error: "No active user account found in memory matches this session ID.",
        });
      }

      // Update user document
      cacheUsers[idx] = {
        ...cacheUsers[idx],
        ...profileData,
        name: name || fullName || cacheUsers[idx].name,
        updatedAt: new Date().toISOString(),
      };

      // Also append a BMI history log automatically for trackability
      const newHistoryLog = {
        _id: `mem_log_${Date.now()}`,
        userId,
        weight: parsedWeight,
        height: parsedHeight,
        bmiValue,
        bmiCategory,
        recordedAt: new Date().toISOString(),
      };
      cacheBmiRecords.push(newHistoryLog);

      const { password: _, ...userToSend } = cacheUsers[idx];
      return res.status(200).json({
        success: true,
        message: "Profile configured successfully in Memory.",
        data: userToSend,
        databaseMode: "fallback-memory",
      });
    }

    // Live MongoDB mode path
    const mdbUser = await (UserDefault as any).findById(userId);
    if (!mdbUser) {
      return res.status(404).json({
        success: false,
        error: "User not found in live database.",
      });
    }

    if (name || fullName) {
      mdbUser.name = name || fullName;
    }
    mdbUser.age = parsedAge;
    mdbUser.gender = gender;
    mdbUser.height = parsedHeight;
    mdbUser.weight = parsedWeight;
    mdbUser.activityLevel = activityLevel;
    mdbUser.bmiCategory = bmiCategory;
    await mdbUser.save();

    // Cache record inside the separate historical ledger
    const log = new BMIRecordDefault({
      userId,
      weight: parsedWeight,
      height: parsedHeight,
      bmiValue,
      bmiCategory,
    });
    await log.save();

    return res.status(200).json({
      success: true,
      message: "Health profile synchronized inside MongoDB Atlas Cluster",
      data: mdbUser,
      databaseMode: "mongodb",
    });
  } catch (err: any) {
    console.error("createProfile endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Exception creating health companion profile information",
      details: err.message,
    });
  }
}

/**
 * GET /get-profile
 * Fetches user profile data specific to their login instance
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthenticated request. Missing x-user-id session parameter.",
      });
    }

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const user = cacheUsers.find((u) => u._id === userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User session profile not found in memory.",
        });
      }

      const { password: _, ...userToSend } = user;
      return res.status(200).json({
        success: true,
        data: userToSend,
        databaseMode: "fallback-memory",
      });
    }

    // MongoDB Mode Path
    const user = await (UserDefault as any).findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Standard user record not located in MongoDB profile collection.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      databaseMode: "mongodb",
    });
  } catch (err: any) {
    console.error("getProfile endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Exception locating health profile attributes.",
      details: err.message,
    });
  }
}

/**
 * POST /save-bmi
 * Places a standalone historical measurement event linked to the active account
 */
export async function saveBmi(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Active credentials mapping x-user-id missing from request headers.",
      });
    }

    const { weight, height } = req.body;

    if (!weight || !height) {
      return res.status(400).json({
        success: false,
        error: "Please supply weight (kg) and height (cm) values to complete recording.",
      });
    }

    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    const bmiValue = calculateBmiValue(parsedWeight, parsedHeight);
    const bmiCategory = classifyBmiValue(bmiValue) as any;

    const isFallback = getDbMode() === "fallback-memory";

    const newRecord = {
      userId: String(userId),
      weight: parsedWeight,
      height: parsedHeight,
      bmiValue,
      bmiCategory,
    };

    if (isFallback) {
      const memoryRecord = {
        _id: `mem_log_${Date.now()}`,
        ...newRecord,
        recordedAt: new Date().toISOString(),
      };
      cacheBmiRecords.push(memoryRecord);

      // Sync user profile master metrics in memory
      const userIdx = cacheUsers.findIndex((u) => u._id === userId);
      if (userIdx !== -1) {
        cacheUsers[userIdx].weight = parsedWeight;
        cacheUsers[userIdx].height = parsedHeight;
        cacheUsers[userIdx].bmiCategory = bmiCategory;
        cacheUsers[userIdx].updatedAt = new Date().toISOString();
      }

      return res.status(200).json({
        success: true,
        message: "Dynamic wellness measurement registered (In-Memory mode)",
        data: memoryRecord,
        databaseMode: "fallback-memory",
      });
    }

    // Live MongoDB path
    const mdbLog = new BMIRecordDefault(newRecord);
    await mdbLog.save();

    // Synchronously update the master table profile variables
    const activeUser = await (UserDefault as any).findById(userId);
    if (activeUser) {
      activeUser.weight = parsedWeight;
      activeUser.height = parsedHeight;
      activeUser.bmiCategory = bmiCategory;
      await activeUser.save();
    }

    return res.status(200).json({
      success: true,
      message: "Dynamic wellness entry registered in MongoDB",
      data: mdbLog,
      databaseMode: "mongodb",
    });
  } catch (err: any) {
    console.error("saveBmi endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Database exception logging individual BMI record.",
      details: err.message,
    });
  }
}

/**
 * GET /bmi-history
 * Returns the history list of BMI records filtered strictly to the logged-in user
 */
export async function getBmiHistory(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthenticated request. Active credentials mapping x-user-id missing.",
      });
    }

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      // Filter strictly by registered user ID
      const records = cacheBmiRecords
        .filter((r) => r.userId === String(userId))
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

      return res.status(200).json({
        success: true,
        data: records,
        databaseMode: "fallback-memory",
        connectionError: getLastError(),
      });
    }

    // Live MongoDB path
    const history = await BMIRecordDefault.find({ userId: String(userId) } as any).sort({
      recordedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: history,
      databaseMode: "mongodb",
    });
  } catch (err: any) {
    console.error("getBmiHistory endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Exception locating database history logs.",
      details: err.message,
    });
  }
}

/**
 * POST /save-steps
 * Registers or updates a daily step count for a given user and date
 */
export async function saveSteps(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthenticated request. x-user-id missing.",
      });
    }

    const { date, steps, calories, caloriesBurned, distance, duration } = req.body;

    if (!date || steps === undefined) {
      return res.status(400).json({
        success: false,
        error: "Parameters date and steps are required.",
      });
    }

    const parsedSteps = parseInt(steps);
    // Backward compatibility support for calories vs caloriesBurned
    const parsedCalories = calories !== undefined 
      ? parseFloat(calories) 
      : (caloriesBurned !== undefined ? parseFloat(caloriesBurned) : parseFloat((parsedSteps * 0.04).toFixed(2)));
    
    // Fallback or automatic distance calculation
    const parsedDistance = distance !== undefined 
      ? parseFloat(distance) 
      : parseFloat(((parsedSteps * 0.76) / 1000).toFixed(3));

    const parsedDuration = duration !== undefined ? parseInt(duration) : 0;
    const targetDate = String(date).trim(); // "YYYY-MM-DD"

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const existingIdx = cacheStepRecords.findIndex(r => r.userId === String(userId) && r.date === targetDate);
      const record = {
        userId: String(userId),
        date: targetDate,
        steps: parsedSteps,
        calories: parsedCalories,
        caloriesBurned: parsedCalories,
        distance: parsedDistance,
        duration: parsedDuration,
        recordedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        cacheStepRecords[existingIdx] = {
          ...cacheStepRecords[existingIdx],
          ...record
        };
      } else {
        cacheStepRecords.push({
          _id: `mem_step_${Date.now()}`,
          ...record
        });
      }

      return res.status(200).json({
        success: true,
        message: "Step entry saved (In-Memory Fallback)",
        data: record,
        databaseMode: "fallback-memory",
      });
    }

    // Live MongoDB mode using findOneAndUpdate with upsert
    const updatedRecord = await (StepHistoryDefault as any).findOneAndUpdate(
      { userId: String(userId), date: targetDate },
      { 
        $set: { 
          steps: parsedSteps, 
          calories: parsedCalories,
          caloriesBurned: parsedCalories,
          distance: parsedDistance,
          duration: parsedDuration,
          recordedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Step entry registered in MongoDB",
      data: updatedRecord,
      databaseMode: "mongodb"
    });
  } catch (err: any) {
    console.error("saveSteps endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Database exception logging step record.",
      details: err.message,
    });
  }
}

/**
 * GET /step-history
 * Returns the history list of step count records filtered strictly to the logged-in user
 */
export async function getStepHistory(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthenticated request. x-user-id missing.",
      });
    }

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const records = cacheStepRecords
        .filter((r) => r.userId === String(userId))
        .sort((a, b) => b.date.localeCompare(a.date));

      return res.status(200).json({
        success: true,
        data: records,
        databaseMode: "fallback-memory",
        connectionError: getLastError(),
      });
    }

    // Live MongoDB path
    const history = await StepHistoryDefault.find({ userId: String(userId) } as any).sort({
      date: -1
    });

    return res.status(200).json({
      success: true,
      data: history,
      databaseMode: "mongodb"
    });
  } catch (err: any) {
    console.error("getStepHistory endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: "Exception locating step history logs.",
      details: err.message,
    });
  }
}

/**
 * POST /food-search
 * Searches for a food item using Gemini API (real food nutrition lookup)
 * Falls back to local database matching in case of API failure or missing keys
 */
export async function searchFood(req: Request, res: Response) {
  try {
    const { query } = req.body;
    const cleanQuery = String(query || "").toLowerCase().trim();

    if (!cleanQuery) {
      return res.status(200).json({
        success: true,
        source: "local-empty",
        data: FOODS_DATABASE.slice(0, 12)
      });
    }

    // Levenshtein Distance for Typo Tolerance
    const getEditDistance = (a: string, b: string): number => {
      const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1, // insertion
            dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
          );
        }
      }
      return dp[a.length][b.length];
    };

    // Scored matching, synonym mapping, word-prefix boosting, and edit-distance ranking
    const scoredLocalMatches = FOODS_DATABASE.map(food => {
      let score = 0;
      const fName = food.name.toLowerCase();
      const fId = food.id.toLowerCase();
      const fDesc = food.description.toLowerCase();
      const queryWords = cleanQuery.split(/[\s_+,-]+/);

      // Intelligent Synonym Mapping Boost mappings for native and colloquial lookups
      const synonyms: Record<string, string[]> = {
        idl: ["idli", "idly", "steamed"],
        idli: ["idli", "idly", "steamed"],
        idly: ["idli", "idly", "steamed"],
        dose: ["dosa", "plain", "masala"],
        dosa: ["dosa", "plain", "masala"],
        biryan: ["biryani", "rice", "veg_biryani", "mutton_biryani"],
        biryani: ["biryani", "rice", "veg_biryani", "mutton_biryani"],
        apl: ["apple"],
        apple: ["apple"],
        roti: ["roti", "chapati", "naan", "phulka", "paratha"],
        chapati: ["roti", "chapati", "naan", "phulka", "paratha"],
        chapathi: ["roti", "chapati", "naan", "phulka", "paratha"],
        paratha: ["paratha", "roti", "paneer_paratha", "aloo_paratha"],
        paneer: ["paneer", "paneer_paratha", "paneer_butter_masala"],
        dal: ["dal", "dal_tadka", "khichdi"],
        rice: ["rice", "white_rice", "brown_rice", "lemon_rice", "curd_rice", "pulihora", "jeera_rice", "fried_rice"],
        sambar: ["sambar", "rasam", "rasam_soup"],
        rasam: ["rasam", "rasam_soup"],
        sweet: ["gulab_jamun", "rasgulla", "besan_laddu", "jalebi", "kaju_katli", "mysore_pak", "payasam"],
        sweets: ["gulab_jamun", "rasgulla", "besan_laddu", "jalebi", "kaju_katli", "mysore_pak", "payasam"],
        lassi: ["lassi", "lassi_sweet", "buttermilk"],
        buttermilk: ["buttermilk", "buttermilk_spiced"],
        badam: ["badam", "badam_milk_drink"],
        sugarcane: ["sugarcane", "sugarcane_juice_fresh"],
        chai: ["tea"],
        eggs: ["egg", "boiled_eggs"],
        burg: ["burger", "sandwich"],
        snack: ["chips", "samosa", "pakoda", "puff", "murukku", "mixture"]
      };

      // Check Synonym Boosts
      for (const [key, list] of Object.entries(synonyms)) {
        if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
          for (const mapped of list) {
            if (fId.includes(mapped) || fName.includes(mapped)) {
              score += 150; // High priority synonym matching
            }
          }
        }
      }

      // Check Substring matching
      if (fName.includes(cleanQuery)) {
        score += 80;
        if (fName.startsWith(cleanQuery)) score += 40;
      }
      if (fId.includes(cleanQuery)) {
        score += 60;
        if (fId.startsWith(cleanQuery)) score += 30;
      }

      // Direct exact equality match is given a major boost
      if (fName === cleanQuery || fId === cleanQuery) {
        score += 300;
      }

      // Advanced phrase and word matching
      const foodWords = fName.split(/[\s_+,-]+/);
      for (const qw of queryWords) {
        if (!qw || qw.length < 2) continue;
        for (const fw of foodWords) {
          if (!fw || fw.length < 2) continue;
          if (fw.startsWith(qw)) {
            score += 50; // prefix match e.g. "biryan" matches "biryani"
          } else if (qw.startsWith(fw)) {
            score += 35;
          } else if (fw.includes(qw)) {
            score += 25;
          }

          // Edit distance matching for Typo Tolerance
          if (qw.length >= 3) {
            const dist = getEditDistance(qw, fw);
            if (dist <= 1) {
              score += 45; // 1 char difference
            } else if (dist <= 2 && fw.length >= 5 && qw.length >= 4) {
              score += 25; // 2 chars difference on longer query/word pairs
            }
          }
        }
      }

      // Check descriptions match
      if (fDesc.includes(cleanQuery)) {
        score += 15;
      }

      return { food, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

    if (scoredLocalMatches.length > 0) {
      return res.status(200).json({
        success: true,
        source: "local-fuzzy-ranked",
        data: scoredLocalMatches.slice(0, 6).map(item => item.food)
      });
    }

    const hasApiKey = !!process.env.GEMINI_API_KEY;

    if (hasApiKey) {
      try {
        const ai = getGeminiClient();
        const prompt = `Act as an expert food nutrition biochemist. The user is searching for: "${cleanQuery}".
Generate a list of exactly 1 to 4 highly realistic matching real-world food items, ingredients, local foods, or dishes (e.g. if query is "burg" or similar, map to "Burger"; if it is a local dish name like "biryani", provide "Chicken Biryani" etc.).
Return a structured JSON list complying strictly with standard food intelligence schemas.

Each item in the list must be fully customized with realistic calories, macronutrients (carbs, protein, fat in grams), serving sizes, helpful descriptions, and realistic fitness burn times based on calories:
- Walking: around (calories / 3.5) minutes
- Running: around (calories / 7.7) minutes
- Cardio: around (calories / 9.0) minutes

Also, decide a Base Recommendation category:
- Use "Can Eat" for nutrient-dense healthy organic whole foods.
- Use "Occasional" for balanced meals containing moderate carbs/fats/oils.
- Use "Avoid" for highly processed, fried junk food, high-sodium snacks, or heavy sugarcane syrups.

Use realistic, high-resolution, food-focused Unsplash image photography URLs for the "image" field.
Choose from existing high-quality general food photo patterns or similar valid, premium public domain images like:
- Salad/Healthy/Veggies/Salmon/Eggs: https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80
- Fast Food/Pizza/Burger/Chips: https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80
- Rice/Biryani/Curry: https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80
- Drinks/Soda/Juice/Tea: https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80`;

        const response = await callGeminiWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Kebab-case lowercase unique ID" },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be 'Indian Foods', 'Fast Food', 'Healthy', or 'Snacks & Drinks'" },
                  calories: { type: Type.INTEGER },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      carbs: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER }
                    },
                    required: ["carbs", "protein", "fat"]
                  },
                  image: { type: Type.STRING },
                  description: { type: Type.STRING },
                  baseRecommendation: { type: Type.STRING, description: "Must be 'Can Eat', 'Occasional', or 'Avoid'" },
                  servingSize: { type: Type.STRING },
                  burnMetrics: {
                    type: Type.OBJECT,
                    properties: {
                      walking: { type: Type.INTEGER },
                      running: { type: Type.INTEGER },
                      cardio: { type: Type.INTEGER }
                    },
                    required: ["walking", "running", "cardio"]
                  }
                },
                required: [
                  "id", "name", "category", "calories", "macros", "image",
                  "description", "baseRecommendation", "servingSize", "burnMetrics"
                ]
              }
            }
          }
        });

        const textOutput = response.text?.trim() || "";
        if (textOutput) {
          const parsedFoods = JSON.parse(textOutput);
          if (Array.isArray(parsedFoods) && parsedFoods.length > 0) {
            return res.status(200).json({
              success: true,
              source: "cloud-index",
              data: parsedFoods
            });
          }
        }
      } catch (geminiErr: any) {
        console.error("Gemini API call or response parsing failed, falling back to local database:", geminiErr);
      }
    }

    // Local Fallback Filter matching search
    // Handles flexible spelling approx such as matching "pizz" to Pizza, "nood" to noodles
    const filteredLocal = FOODS_DATABASE.filter(f => 
      f.name.toLowerCase().includes(cleanQuery) ||
      f.category.toLowerCase().includes(cleanQuery) ||
      f.description.toLowerCase().includes(cleanQuery)
    );

    if (filteredLocal.length > 0) {
      return res.status(200).json({
        success: true,
        source: "local-fallback",
        data: filteredLocal
      });
    }

    // Levenshtein approximation suggestions or simple heuristics if query yields nothing
    const queryLetters = new Set(cleanQuery.split(''));
    const matchesByLeniency = FOODS_DATABASE.map(food => {
      let score = 0;
      const foodName = food.name.toLowerCase();
      if (foodName.includes(cleanQuery) || cleanQuery.includes(foodName)) {
        score += 15;
      }
      let letterMatches = 0;
      for (const char of foodName) {
        if (queryLetters.has(char)) letterMatches++;
      }
      score += (letterMatches / Math.max(1, cleanQuery.length)) * 5;
      return { food, score };
    })
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .map(item => item.food)
    .slice(0, 5);

    return res.status(200).json({
      success: true,
      source: matchesByLeniency.length > 0 ? "local-fuzzy" : "local-all",
      data: matchesByLeniency.length > 0 ? matchesByLeniency : FOODS_DATABASE.slice(0, 10)
    });

  } catch (err: any) {
    console.error("searchFood generic controller error:", err);
    return res.status(500).json({
      success: false,
      error: "Nutrition search query failed.",
      data: FOODS_DATABASE.slice(0, 10),
      details: err.message
    });
  }
}

/**
 * Sends email using configured production SMTP credentials.
 */
async function sendEmailWithFallback(
  toEmail: string,
  subject: string,
  text: string,
  html: string,
  auditLabel: string
): Promise<{ sent: boolean; provider: string; messageId: string; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "", 10);
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;

  if (!host || !port || !user || !rawPass) {
    console.error(`[EMAIL-AUDIT] [${auditLabel}] Missing SMTP configuration.`);
    return {
      sent: false,
      provider: "Gmail SMTP",
      messageId: "",
      reason: "Missing SMTP configuration"
    };
  }
  
  let pass = rawPass.trim();
  // Strip surrounding quotes if present
  if ((pass.startsWith('"') && pass.endsWith('"')) || (pass.startsWith("'") && pass.endsWith("'"))) {
    pass = pass.slice(1, -1);
  }
  pass = pass.trim();

  // For Gmail SMTP servers, normalize by stripping all spaces if any
  if (host.includes("gmail") || host.includes("google")) {
    pass = pass.replace(/\s+/g, "");
  }

  console.log(`[EMAIL-AUDIT] [${auditLabel}] Attempting SMTP delivery to ${toEmail} via Gmail SMTP...`);
  
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      family: 4,
      tls: { rejectUnauthorized: false }
    } as any);

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME || 'HealthMate Support'}" <${user}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL-AUDIT] [${auditLabel}] Gmail SMTP delivery successful:`, info.messageId);
    return { 
      sent: true, 
      provider: "Gmail SMTP", 
      messageId: info.messageId
    };
  } catch (err: any) {
    console.error(`[EMAIL-AUDIT] [${auditLabel}] Gmail SMTP delivery failed:`, err.message);
    return {
      sent: false,
      provider: "Gmail SMTP",
      messageId: "",
      reason: err.message
    };
  }
}

/**
 * Sends a secure password reset email using the Gmail SMTP server.
 */
async function sendResetEmail(email: string, resetUrl: string, userName: string) {
  const mailSubject = "HealthMate - Reset Your Password";
  const mailText = `Hello ${userName},\n\nYou requested a password reset for your HealthMate account. Please click the link below to complete the process:\n\n${resetUrl}\n\nThis link is valid for 30 minutes.\n\nKeep walking, stay healthy!\n- The HealthMate Team`;
  const mailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #10b981; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">HealthMate Support</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Your Smart Digital Health Companion 🌿</p>
      </div>
      <div style="line-height: 1.6; font-size: 15px;">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Hello ${userName},</h3>
        <p>We received a secure request to reset your password for your <strong>HealthMate</strong> account.</p>
        <p>Please click the green button below to securely configure a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #10b981; color: #ffffff; padding: 13px 32px; text-decoration: none; font-weight: bold; border-radius: 10px; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16,185,129, 0.2); text-align: center;">Reset Your Password</a>
        </div>
        <p style="color: #ef4444; font-size: 13px; font-weight: 600; text-align: center;">This token expires in 30 minutes for security reasons.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;">
        <p style="font-size: 12px; color: #64748b;">If you are unable to click the button, paste the following link directly into your browser:</p>
        <p style="font-size: 12px; word-break: break-all; color: #10b981; background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px dashed #cbd5e1; font-family: monospace;">${resetUrl}</p>
        <p style="margin-top: 25px; font-size: 13px; color: #475569;">If you did not request this, please ignore this email. Your current password remains perfectly secure.</p>
      </div>
      <div style="margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p>© 2026 HealthMate Inc. Aligned with clinical-pacing guidelines.</p>
      </div>
    </div>
  `;

  return sendEmailWithFallback(email, mailSubject, mailText, mailHtml, "ResetLink");
}

/**
 * Sends a secure verification email using the Gmail SMTP server.
 */
async function sendOtpEmail(email: string, otp: string, userName: string) {
  const mailSubject = "Your HealthMate Verification Code";
  const mailText = `Your verification code is:\n\n${otp}\n\nThis code expires in 3 minutes.`;
  const mailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #10b981; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">HealthMate</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Your Smart Digital Health Companion 🌿</p>
      </div>
      <div style="line-height: 1.6; font-size: 15px;">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Hello,</h3>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-family: monospace; font-size: 40px; font-weight: 900; letter-spacing: 6px; color: #10b981; background-color: #f8fafc; padding: 12px 30px; border-radius: 12px; border: 1px solid #cbd5e1; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #ef4444; font-size: 13px; font-weight: 600; text-align: center;">This code expires in 3 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;">
        <p style="margin-top: 25px; font-size: 13px; color: #475569;">If you did not request this code, please disregard this message.</p>
      </div>
      <div style="margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p>© 2026 HealthMate Inc.</p>
      </div>
    </div>
  `;

  return sendEmailWithFallback(email, mailSubject, mailText, mailHtml, "OTP");
}

/**
 * POST /food-roast
 * Generates a cute, sassy, personalized food roast using a high-fidelity hybrid local database structure with Gemini API fallback.
 */
export async function roastFood(req: Request, res: Response) {
  try {
    const { 
      food, 
      weight, 
      height, 
      age = 26, 
      gender = "male",
      activityLevel = "moderate",
      fullName = "Friend",
      bmi, 
      lang = 'en' 
    } = req.body;

    const cleanFood = String(food || "").trim().toLowerCase();

    if (!cleanFood) {
      return res.status(400).json({
        success: false,
        error: "Food query is empty."
      });
    }

    const calculatedBmi = bmi || (weight && height ? parseFloat((weight / ((height / 100) ** 2)).toFixed(1)) : 22.5);
    
    // Determine BMI tier for personalization
    let bmiTier = "Normal";
    if (calculatedBmi < 18.5) bmiTier = "Underweight";
    else if (calculatedBmi >= 25 && calculatedBmi < 30) bmiTier = "Overweight";
    else if (calculatedBmi >= 30) bmiTier = "Obese";

    // 1. Image mappings definition
    const IMAGE_MAPPINGS: Record<string, string> = {
      fruit: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400",
      salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
      breakfast: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400",
      curry: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
      heavy: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
      junk: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
      sweet: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
      drink: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
    };

    const SPECIFIC_IMAGES: Record<string, string> = {
      pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
      biryani: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400",
      "pani puri": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
      burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
      apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400",
      salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
      dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=400",
      idli: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400",
      samosa: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
      sweet: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400"
    };

    // LEVEL 1: Local database lookup across pre-registered 2000 foods
    const localFood = findLocalFood(cleanFood);
    let matchedPoemKey = Object.keys(CUSTOM_ROASTS).find(key => cleanFood.includes(key));
    
    let isInstant = false;
    let finalRoast = "";
    let finalType: "roast" | "boost" = "boost";
    let finalImageUrl = "";

    if (localFood || matchedPoemKey) {
      isInstant = true;
      const categoryLabel = localFood ? localFood.category : (matchedPoemKey === "salad" || matchedPoemKey === "apple" || matchedPoemKey === "idli" || matchedPoemKey === "dosa" ? "excellent" : "roast_zone");
      finalType = (categoryLabel === "poor" || categoryLabel === "roast_zone") ? "roast" : "boost";
      finalImageUrl = ""; // Do not show images (text-first)

      // Generate funny friendly 4-5 short line roast
      if (lang === 'te') {
        if (matchedPoemKey && CUSTOM_ROASTS[matchedPoemKey]) {
          const rawPoem = CUSTOM_ROASTS[matchedPoemKey].te.poem;
          const poemLines = rawPoem.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
          const greeting = finalType === 'boost' ? `Oho, ${food} aa? 😎` : `Arey arey ${food} aa? 😏`;
          finalRoast = [greeting, ...poemLines].slice(0, 5).join('\n');
        } else {
          if (finalType === 'boost') {
            finalRoast = `Oho ${food} aa? 😎\nOil control lo unte super roll ra mama,\nStomach happy, energy happy,\nI roju body ki holiday ichav 😄`;
          } else if (categoryLabel === 'moderate') {
            finalRoast = `${food} aa? ☕😏\nCup okati okay ra mama,\nCup meeda cup vesthe scene maaripothadi,\nMind fresh, sleep fresh ga undali 🤣`;
          } else if (categoryLabel === 'poor') {
            finalRoast = `${food} aa? 🌶️😏\nMouth happy, stomach confused,\nCalories silent ga entry ichayi,\nWalking shoes matram waiting lo unnayi 🤣🔥`;
          } else {
            finalRoast = `${food} aa? 🍔😏\nCheese ni king laga pilichav,\nCalories ni gang tho teeskochav,\nScale repu meeting ki ready ga undi 🤣🔥`;
          }
        }
      } else {
        if (matchedPoemKey && CUSTOM_ROASTS[matchedPoemKey]) {
          const rawPoem = CUSTOM_ROASTS[matchedPoemKey].en.poem;
          const poemLines = rawPoem.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
          const greeting = finalType === 'boost' ? `Oho, ${food} aa? 😎` : `Hmm... ${food} aa? 😏`;
          finalRoast = [greeting, ...poemLines].slice(0, 5).join('\n');
        } else {
          if (finalType === 'boost') {
            finalRoast = `Oho ${food} aa? 😎\nSuper clean choice and absolutely great,\nStomach is happy, energy is high,\nEnjoy the beautiful guilt-free vibes today! 😄`;
          } else if (categoryLabel === 'moderate') {
            finalRoast = `${food} aa? 😏\nA decent choice, but play it smart,\nToo much of this is a sneaky start,\nLet's keep the balance right! 😉`;
          } else if (categoryLabel === 'poor') {
            finalRoast = `${food} aa? 😏\nTastes like absolute heaven, I agree,\nBut calories are coming in three by three,\nScale tomorrow is ready to disagree! 🤣🔥`;
          } else {
            finalRoast = `${food} aa? 😏💣\nCalories are charging with a massive power,\nYour fitness plans are crying at this hour,\nTime to walk those extra miles, friend! 🤣🔥`;
          }
        }
      }
    }

    // LEVEL 2: Live Gemini fallback for exotic / rare foods (Only triggered if not found locally)
    if (!isInstant && !!process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        let prompt = "";

        // Dynamically classify categories to supply the prompt
        const categoryLabel = classifyFood(cleanFood);
        finalType = (categoryLabel === 'unhealthy' || categoryLabel === 'highly_unhealthy') ? "roast" : "boost";
        finalImageUrl = ""; // Do not show images (text-first)

        if (lang === 'te') {
          prompt = `Act as HealthMate, a funny local friend reacting to the food choices made by the user.
The food they just ate: "${food}".
User's Name: ${fullName}
ROAST LEVEL: ${finalType === "roast" ? "Savage/Unhealthy/Teasing" : "Healthy/Light humor/Playful"}.

Prompt Directives:
1. WRITING STYLE: Romanized TELUGU written in English alphabets only (WhatsApp chat style among friends, e.g. "mama", "ra", "babu", "thinte", "enti", "lagesthav", "proper ga").
2. CONSTRAINTS:
- MAXIMUM length: 4-5 short lines. Must be fast and easy to read.
- Absolutely NO BMI, NO food scores, NO health scores, NO nutrition breakdowns, NO calorie counts, NO health tips, and NO medical/scientific terms.
- MUST feel like a funny, witty friend teasing the food, never insulting the person.
- Try to use a rhyming or catchy flow where possible.

Follow these example styles exactly in format and length:
Healthy Example:
Oho dosa aa? 😎
Oil control lo unte super roll ra mama,
Stomach happy, energy happy,
I roju body ki holiday ichav 😄

Heavy Roast Example:
Pani puri aa? 🌶️😏
Mouth happy, stomach confused,
Calories silent ga entry ichayi,
Walking shoes matram waiting lo unnayi 🤣🔥`;
        } else {
          prompt = `Act as HealthMate, a funny friend reacting to the food choices made by the user.
The food they just ate: "${food}".
User's Name: ${fullName}
ROAST LEVEL: ${finalType === "roast" ? "Savage/Unhealthy/Teasing" : "Healthy/Light humor/Playful"}.

Prompt Directives:
1. WRITING STYLE: Simple conversational English. Witty, sassy, snappy, and memorable.
2. CONSTRAINTS:
- MAXIMUM length: 4-5 short lines.
- Absolutely NO BMI, NO food scores, NO health scores, NO nutrition breakdowns, NO calorie counts, NO health tips, and NO medical/scientific terms.
- MUST feel like a funny, witty friend teasing the food choice, never insulting the person.
- Try to use a rhyming or catchy flow where possible.

Follow these example styles exactly in format and length:
Healthy Example:
Oho salad aa? 😎
Pristine choice, dynamic green power,
Stomach is happy, energy is high,
We are absolutely winning today! 😄

Heavy Roast Example:
Burger aa? 🍔😏
Cheese invited like a king,
Calories entering in a full swing,
Scale is ready for a morning meeting 🤣🔥`;
        }

        const response = await callGeminiWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            maxOutputTokens: 100,
            temperature: 0.85
          }
        });

        const reply = response.text?.trim() || "";
        if (reply && reply.length > 5 && !reply.toLowerCase().startsWith("act as")) {
          // Clean cleanReply of any raw markdown wrapper codes
          const cleanReply = reply.replace(/[\*\#\`]/g, '');
          finalRoast = cleanReply;
        }
      } catch (geminiErr: any) {
        const errMsg = geminiErr?.message || String(geminiErr);
        if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
          console.log(`ℹ️ [Food Roaster] Rate Limit / Quota Exceeded. Engaging dynamic local fallback...`);
        } else {
          console.error(`⚠️ [Food Roaster] Gemini API fallback deferred or faulted: ${errMsg}`);
        }
      }
    }

    // LEVEL 2.5: Resolute recovery logic in case Gemini failed or was offline
    if (!finalRoast) {
      const categoryLabel = classifyFood(cleanFood);
      finalType = (categoryLabel === 'unhealthy' || categoryLabel === 'highly_unhealthy') ? "roast" : "boost";
      finalImageUrl = ""; // Do not show images (text-first)

      if (lang === 'te') {
        if (finalType === 'boost') {
          finalRoast = `Oho ${food} aa? 😎\nOil control lo unte super roll ra mama,\nStomach happy, energy happy,\nI roju body ki holiday isthundhi 😄`;
        } else {
          finalRoast = `${food} aa? 🌶️😏\nMouth happy, stomach confused,\nCalories silent ga entry ichayi,\nWalking shoes matram waiting lo unnayi 🤣🔥`;
        }
      } else {
        if (finalType === 'boost') {
          finalRoast = `Oho ${food} aa? 😎\nSuper clean choice and absolutely great,\nStomach is happy, energy is high,\nEnjoy the beautiful guilt-free vibes today! 😄`;
        } else {
          finalRoast = `${food} aa? 😏\nTastes like absolute heaven, I agree,\nBut calories are coming in three by three,\nScale tomorrow is ready to disagree! 🤣🔥`;
        }
      }
    }

    return res.status(200).json({
      success: true,
      roast: finalRoast,
      type: finalType,
      imageUrl: finalImageUrl
    });

  } catch (err) {
    console.error("roastFood controller error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

export function classifyFood(food: string): 'excellent' | 'good' | 'moderate' | 'poor' | 'roast_zone' | 'healthy' | 'unhealthy' | 'highly_unhealthy' {
  const norm = food.toLowerCase().trim();

  // Highly Unhealthy Keywords
  const highlyUnhealthyKeywords = [
    "ice cream", "icecream", "cake", "chocolate", "sweet", "candy", "donut", "doughnut", "pastry", "pastries",
    "gulab jamun", "laddu", "jalebi", "mysore pak", "payasam", "kaju katli", "halwa", "rasgulla",
    "sugar syrup", "dessert", "milkshake", "brownie", "muffin", "waffle", "syrup", "double cheese", "extra cheese"
  ];

  if (highlyUnhealthyKeywords.some(k => norm.includes(k))) {
    return 'roast_zone';
  }

  // Unhealthy Keywords
  const unhealthyKeywords = [
    "pizza", "burger", "samosa", "chips", "fries", "french fries", "biryani", "birany", "briyani", "ghee",
    "soda", "coke", "pepsi", "cola", "fanta", "sprite", "milkshake", "syrup", "fried chicken", "kfc",
    "noodle", "ramen", "maggi", "pasta", "puris", "poori", "vada", "samosas", "puff", "mixture", "murukku", "pakoda", "pakodi",
    "pani puri", "panipuri", "street food", "fast food", "sheek kabab", "kebab", "naan", "paratha", "butter chicken"
  ];

  if (unhealthyKeywords.some(k => norm.includes(k))) {
    return 'poor';
  }

  // Moderate Keywords
  const moderateKeywords = [
    "dosa", "masala dosa", "rava dosa", "chapati", "chapathi", "roti", "phulka", "brown rice", "white rice", "steamed rice",
    "dal", "sambar", "rasam", "rajma", "chole", "paneer", "upma", "pongal", "buttermilk", "coffee", "tea", "milk"
  ];

  if (moderateKeywords.some(k => norm.includes(k))) {
    return 'moderate';
  }

  // Healthy Keywords
  const healthyKeywords = [
    "salad", "fruit", "apple", "banana", "orange", "grapes", "melon", "papaya", "guava", "spinach", "broccoli",
    "sprouts", "oats", "oatmeal", "idli", "idly", "egg white", "boiled egg", "water", "green tea", "cucumber"
  ];

  if (healthyKeywords.some(k => norm.includes(k))) {
    return 'excellent';
  }

  if (norm.includes("fried") || norm.includes("crispy") || norm.includes("creamy") || norm.includes("sugary") || norm.includes("syrup")) {
    return 'poor';
  }

  return 'moderate'; // Default fallback for unknown items
}

async function generateFutureSelfLetterInternal(
  userId: string,
  dayIndex: number,
  answers: any,
  userProfile: any
): Promise<{ message: string; category: string; notificationText: string }> {
  const isFallback = getDbMode() === "fallback-memory";
  
  // Choose category deterministically to match distribution request:
  // Stories (40%) -> idx % 10 in [0, 4, 7, 9] (4 out of 10)
  // Confessions (25%) -> idx % 10 in [2, 5] (2.5 out of 10)
  // Secrets (20%) -> idx % 10 in [3, 8] (2 out of 10)
  // Health Reflection (15%) -> idx % 10 in [1, 6] (1.5 out of 10)
  let chosenCategory = "Future Stories";
  const mod = dayIndex % 10;
  if (mod === 1 || mod === 6) {
    chosenCategory = "Health Reflection";
  } else if (mod === 3 || mod === 8) {
    chosenCategory = "Future Secrets";
  } else if (mod === 2 || mod === 5) {
    chosenCategory = "Future Confessions";
  } else {
    chosenCategory = "Future Stories";
  }

  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + 10;

  // Pre-configured curiosity-boosting notification options as explicitly requested
  const notificationOptions = [
    "Your future self left something for you.",
    "A new transmission has arrived.",
    `${futureYear} remembered something today.`
  ];
  const chosenNotification = notificationOptions[Math.floor(Math.random() * notificationOptions.length)];

  // Fallback Templates in case Gemini fails or is missing key using the 10-year gap rule (mysterious and curious)
  const name = answers?.firstName || userProfile?.name || userProfile?.fullName || "friend";
  
  // Custom required onboarding fields mapped dynamically
  const firstName = answers?.firstName || name;
  const biggestGoal = answers?.biggestGoal || answers?.biggestGoalThisYear || "personal transformation";
  const biggestFear = answers?.biggestFear || "not reaching your full potential";
  const dreamLife = answers?.dreamLife || answers?.personWantToBecome || "a life of absolute freedom, peace, and meaningful impact";
  const dreamJob = answers?.dreamJob || "finding your deepest passion and ultimate purpose";
  const thingToChange = answers?.thingToChange || answers?.thingToImprove || "making better daily decisions";
  const thingProudOf = answers?.thingProudOf || answers?.thankFutureSelf || "never giving up when times got tough";
  const favoriteHobby = answers?.favoriteHobby || answers?.favoriteSport || "spending time on what makes you happy";

  // Other optional choices
  const favoriteColor = answers?.favoriteColor || "emerald green";
  const favoriteMovieGenre = answers?.favoriteMovieGenre || "sci-fi";
  const favoriteMovie = answers?.favoriteMovie || "your favorite movies";
  const favoriteBook = answers?.favoriteBook || "great books";
  const favoriteSport = answers?.favoriteSport || "staying active";
  const favoriteMusicGenre = answers?.favoriteMusicGenre || "melodies";
  const favoriteSong = answers?.favoriteSong || "good songs";
  const favoriteFood = answers?.favoriteFood || "home-cooked meals";
  const dreamCompany = answers?.dreamCompany || "your dream company";
  const biggestDream = answers?.biggestDream || "making an impact";
  const bestFriendName = answers?.bestFriendName || "your close childhood friend";
  const roleModelHero = answers?.roleModelHero || "your heroes";
  const favoritePlace = answers?.favoritePlace || "cozy spots";
  const countryToVisit = answers?.countryToVisit || "some beautiful places";
  const thingToImprove = answers?.thingToImprove || "daily focus";
  const habitToBuild = answers?.habitToBuild || "healthy habits";
  const habitToBreak = answers?.habitToBreak || "unhealthy habits";
  const skillToLearn = answers?.skillToLearn || "new skills";
  const whatMakesHappy = answers?.whatMakesHappy || "small joys";
  const whatMakesStressed = answers?.whatMakesStressed || "overthinking";
  const biggestGoalThisYear = answers?.biggestGoalThisYear || "personal growth";
  const thankFutureSelf = answers?.thankFutureSelf || "not giving up";
  const secretNobodyKnows = answers?.secretNobodyKnows || "your hidden thoughts";
  const personWantToBecome = answers?.personWantToBecome || "the best version of us";
  const optionalNote = answers?.optionalNote || "";

  const fallbackLetters: Record<number, { message: string; category: string; notificationText: string }> = {
    1: {
      category: "Future Stories",
      notificationText: "Your future self left something for you.",
      message: `${firstName},

You're looking for an answer.

I remember.

The funny part?

It wasn't hiding.

— ${firstName} from ${futureYear}`
    },
    2: {
      category: "Health Reflection",
      notificationText: `${futureYear} remembered something today.`,
      message: `${firstName},

Something small matters this week.

You won't notice it.

I didn't either.

— ${firstName} from ${futureYear}`
    },
    3: {
      category: "Future Secrets",
      notificationText: "A new transmission has arrived.",
      message: `${firstName},

You're thinking too far ahead.

I know why.

Trust me.

You won't always feel this way.

— ${firstName} from ${futureYear}`
    },
    4: {
      category: "Future Confessions",
      notificationText: "Your future self left something for you.",
      message: `${firstName},

Don't rush today.

I remember this version of us.

That's all I'll say.

— ${firstName} from ${futureYear}`
    },
    5: {
      category: "Future Stories",
      notificationText: `${futureYear} remembered something today.`,
      message: `${firstName},

You almost ignore a small choice this week.

Don't.

Ten years later,

I'm so glad we paid attention.

— ${firstName} from ${futureYear}`
    }
  };

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log(`ℹ️ [FutureSelf Engine] Returning high-quality personalized template for Day ${dayIndex}.`);
      return fallbackLetters[dayIndex] || {
        category: chosenCategory,
        notificationText: chosenNotification,
        message: `${firstName},

You think achieving "${biggestGoal}" will be a straight line.

But a beautiful detour is about to find you.

Let down your guard just a little.

I am waiting.

— ${firstName} from ${futureYear}`
      };
    }

    const ai = getGeminiClient();

    // Gather history of previously generated letters (to use in story context)
    let historyContext = "No prior letters have been sent. This is Day 1 (the first connection).";
    
    // Look up existing session
    let existingSession: any = null;
    if (isFallback) {
      existingSession = cacheFutureSelves.find((f) => f.userId === userId);
    } else {
      existingSession = await (FutureSelfDefault as any).findOne({ userId });
    }

    if (existingSession && existingSession.letters && existingSession.letters.length > 0) {
      const sortedHistory = [...existingSession.letters].sort((a: any, b: any) => a.dayIndex - b.dayIndex);
      const priorSummaries = sortedHistory.map((l: any) => `Day ${l.dayIndex} [Category: ${l.category}]: "${l.message.substring(0, 120)}..."`).join("\n");
      historyContext = `Here is the chronological archive of letters you've sent so far to maintain tight narrative continuity:\n${priorSummaries}\nEnsure today's letter builds upon these secrets, mysteries, or details seamlessly if applicable. DO NOT REPEAT YOURSELF.`;
    }

    const userAge = userProfile?.age || 26;
    const futureAge = userAge + 10;

    const promptText = `
We are writing a private, extremely short diary message from the user's future self (who is exactly 10 years older, living in the year ${futureYear} and is ${futureAge} years old) to their younger self (who is currently ${userAge} years old and living in the year ${currentYear}).

CRITICAL TONE & LANGUAGE OVERRIDE (MANDATORY):
1. Write EXACTLY how a normal person would text themselves on WhatsApp or iMessage. Use simple everyday English.
2. Target reading age: 12-16 years old. Use short words, short sentences, and simple vocabulary.
3. Absolutely NO poetic, dramatic, literary, philosophical, or cinematic language.
4. STRICTLY FORBIDDEN PHRASES & TOPICS (NEVER use these or similar ideas):
   - "knee pain"
   - "foggy morning"
   - "summer of 2029"
   - "quiet tremor"
   - "rhythm"
   - "beautiful hills"
   - "morning tea tastes different"
   - "that decision shifts"
   - "the weight of that decision"
   - "shift in our rhythm"
   - "your hands steady by Tuesday"
   or any other creative writing, poetic description, novel-like or cinematic elements.
5. LENGTH MANDATES (STRICT):
   - MAXIMUM 4 content lines + 1 signature line.
   - MAXIMUM 6 words per line.
   - Do not write a story, a novel, or a movie script. Keep it simple and natural.

ROLE & EMOTION MANDATE:
The purpose of this feature is to create a mysterious but fully natural emotional experience.
The user must feel:
"How does my future self know this?"
"What is he talking about?"
"What happens next?"
"I need tomorrow's message."
It must create delicious anticipation, deep curiosity, emotional attachment, and raw mystery.

DO NOT write a self-help coach, a productivity guide, a motivation feature, a chatbot, or a generic health tip application. NO quoting other people. 

Every single message MUST contain:
1. One future hint (events, decisions, meetups, etc. that haven't happened yet)
2. One mystery or unfinished thought
3. One small natural emotional connection
4. signature: "— ${firstName} from ${futureYear}" (Do NOT use 2036 or any hardcoded year unless it is exactly ${futureYear})

USER METADATA:
- Name: ${firstName}
- Age: ${userAge}
- Gender: ${userProfile?.gender || "not specified"}

USER'S UNIQUE ONBOARDING ANSWERS (THESE ARE SUBTLE INGREDIENTS ONLY — DO NOT LITERALLY COPY-PASTE THEM LIKE A mechanical template. WEAVE THEM IN EXTREMELY NATURALLY AND AtmosphericALLy SO THEY FEEL PERSONAL BUT MYSTERIOUS):
- First Name: ${firstName} (Address them intimately by this name)
- Biggest Goal: ${biggestGoal} (Subtly reference their progress, achievement, or detour with this goal)
- Biggest Fear: ${biggestFear} (A silent reassurance, context, or curious observation about this fear)
- Dream Life: ${dreamLife} (Paint a tiny, mysterious fragment of our current quiet reality)
- Dream Job / Purpose: ${dreamJob} (Reference a quiet memory or sudden pivot related to this path)
- One Thing You Want To Change: ${thingToChange} (A warm reflection on how this slowly shifted)
- One Thing You Are Proud Of: ${thingProudOf} (Affirm that this choice was the quiet beginning of everything)
- Favorite Hobby: ${favoriteHobby} (A future snapshot of doing this hobby or a feeling it birthed)
- Favorite Color: ${favoriteColor}
- Favorite Movie Genre: ${favoriteMovieGenre}
- Favorite Movie: ${favoriteMovie}
- Favorite Book: ${favoriteBook}
- Favorite Sport: ${favoriteSport}
- Favorite Music Genre: ${favoriteMusicGenre}
- Favorite Song: ${favoriteSong}
- Favorite Food: ${favoriteFood}
- Dream Company: ${dreamCompany}
- Biggest Dream: ${biggestDream}
- Best Friend Name: ${bestFriendName}
- Role Model / Hero: ${roleModelHero}
- Favorite Place / Spot: ${favoritePlace}
- Country to Visit: ${countryToVisit}
- One Thing to Improve: ${thingToImprove}
- One Habit to Build: ${habitToBuild}
- One Habit to Break: ${habitToBreak}
- Skill to Learn: ${skillToLearn}
- What Makes Happy: ${whatMakesHappy}
- What Makes Stressed: ${whatMakesStressed}
- Biggest Goal This Year: ${biggestGoalThisYear}
- Note to thank future self for: ${thankFutureSelf}
- Secret: ${secretNobodyKnows}
- Person to become: ${personWantToBecome}
- Private Note written from younger self: "${optionalNote}"

STORY NARRATIVE ENGINE HISTORY (PREVIOUS LETTERS):
${historyContext}

CHOSEN CATEGORY FOR TODAY:
- Category: "${chosenCategory}"

SUBTLETY & MYSTERY MANDATES:
1. Ingredients, Not Templates: The onboarding answers are only raw ingredients. Do not make the experience predictable. The user should never guess "This message came from question number 7." The connection must feel fully natural and spiritual.
2. Introduce Mystery: You are allowed and encouraged to introduce small future hints, unfinished memories, strange observations, future reflections, tiny mysteries, and unexpected thoughts that do not directly map to any database answers.
3. Raw Cohesion: Make them think "How does my future self know that?" or "What does he mean?" so they return tomorrow to discover the next fragment of a future that has already happened.

WRITING RULES:
1. Short & Evocative ONLY: MAXIMUM 4-5 short, simple lines of text. There must be zero paragraphs, zero essays, zero long sentences, and zero heavy descriptions. Keep every line extremely short (typically under 4-6 words). The user must be able to read the entire message in less than 5 seconds.
2. Structure & Visual Spacing:
Line 1: User name (e.g., "${firstName},")
Line 2: A very short future hint (e.g., "You're still thinking about it.")
Line 3: A curiosity point (e.g., "I remember.")
Line 4: An unfinished thought or emotional hook (e.g., "It stops mattering much sooner than you think.")
Line 5: Dynamic Signature (e.g., "— ${firstName} from ${futureYear}")

Example formats to match exactly:
Example A:
${firstName},
You're still thinking about it.
I remember.
The funny part?
It stops mattering much sooner than you think.
— ${firstName} from ${futureYear}

Example B:
${firstName},
Something small happens today.
You won't notice it.
I did.
— ${firstName} from ${futureYear}

Example C:
${firstName},
You almost ignore a small choice this week.
Don't.
Ten years later,
I'm so glad we paid attention.
— ${firstName} from ${futureYear}

Do NOT combine these into any paragraphs or long blocks. Keep them as isolated, short, punchy lines.
3. LANGUAGE RULE: Calm, confident, personal, and nostalgic. Do NOT sound dramatic, poetic, motivational, or like a coach. You are simply "${firstName}" speaking to younger "${firstName}" from ten years in the future.
STRICTLY FORBIDDEN:
- Do NOT use technical, futuristic system, time travel, or developer terms like "Timeline", "Simulation", "Quantum", "Temporal", "Warp", "DeclassifiedCoordinates", "Synchronization", "Chronology", "Researchers", "Interface", "Decrypting", etc.
- Do NOT use cliché self-help/motivational advice such as "Take a walk today.", "Believe in yourself.", "Eat healthy.", "Work hard.", "Stay positive." Keep the text entirely quiet and personal.

Output the results exactly in the requested JSON structure. Do not include markdown wraps around the JSON block.
`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "A highly personal, atmospheric, and quiet note from 10 years ahead. Must be strictly 4 to 5 short lines maximum. Must start directly with '" + firstName + ",' and end with: — " + firstName + " from " + futureYear
            },
            category: {
              type: Type.STRING,
              description: "Must match the assigned category: " + chosenCategory
            },
            notificationText: {
              type: Type.STRING,
              description: `A mysterious sentence notification of exactly one sentence that builds immense curiosity without revealing the text. Must be one of: 'Your future self left something for you.', 'A new transmission has arrived.', or '${futureYear} remembered something today.'`
            }
          },
          required: ["message", "category", "notificationText"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.message) {
      return {
        message: parsed.message,
        category: parsed.category || chosenCategory,
        notificationText: parsed.notificationText || chosenNotification
      };
    }

    throw new Error("Invalid structure returned from model.");
    
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      console.log(`ℹ️ [FutureSelf Generator] Rate Limit / Quota Exceeded. Engaging beautiful fallback template for Day ${dayIndex}.`);
    } else {
      console.warn(`⚠️ [FutureSelf Generator] Gemini API call deferred or faulted: ${errMsg}. Engaging fallback template for Day ${dayIndex}.`);
    }
    return fallbackLetters[dayIndex] || {
      category: chosenCategory,
      notificationText: chosenNotification,
      message: `${firstName},

Don't rush today.

I remember this exact week.

That's all I'll say.

— ${firstName} from ${futureYear}`
    };
  }
}

/**
 * GET /future-self/status
 * Fetches onboarding status, answers, and the letters archive
 */
export async function getFutureSelfStatus(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthenticated request." });
    }

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const record = cacheFutureSelves.find((r) => r.userId === userId);
      return res.status(200).json({
        success: true,
        data: record || { isOnboarded: false, onboardingAnswers: {}, letters: [] }
      });
    }

    // MongoDB path
    let record = await (FutureSelfDefault as any).findOne({ userId });
    return res.status(200).json({
      success: true,
      data: record || { isOnboarded: false, onboardingAnswers: {}, letters: [] }
    });

  } catch (err: any) {
    console.error("getFutureSelfStatus error:", err);
    return res.status(500).json({ success: false, error: "Error reading future-self status." });
  }
}

/**
 * POST /future-self/onboard
 * Enables the feature, saves unique onboarding personality questions, and generates Day 1 letter
 */
export async function onboardFutureSelf(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;
    const { onboardingAnswers } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthenticated request." });
    }
    if (!onboardingAnswers) {
      return res.status(400).json({ success: false, error: "Missing onboardingAnswers parameters." });
    }

    const isFallback = getDbMode() === "fallback-memory";

    // Retrieve user model attributes for customization (name, age, etc.)
    let userProfile: any = null;
    if (isFallback) {
      userProfile = cacheUsers.find((u) => u._id === userId);
    } else {
      userProfile = await (UserDefault as any).findById(userId);
    }

    // Generate Day 1 letter immediately
    const day1LetterData = await generateFutureSelfLetterInternal(userId as string, 1, onboardingAnswers, userProfile);
    const day1Letter = {
      dayIndex: 1,
      message: day1LetterData.message,
      category: day1LetterData.category,
      isRevealed: false,
      notifiedAt: new Date(),
      notificationText: day1LetterData.notificationText,
      createdAt: new Date()
    };

    if (isFallback) {
      let idx = cacheFutureSelves.findIndex((r) => r.userId === userId);
      const updatedRecord = {
        userId,
        isOnboarded: true,
        onboardingAnswers,
        letters: [day1Letter],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (idx !== -1) {
        cacheFutureSelves[idx] = updatedRecord;
      } else {
        cacheFutureSelves.push(updatedRecord);
      }

      return res.status(200).json({ success: true, data: updatedRecord });
    }

    // MongoDB branch
    let doc = await (FutureSelfDefault as any).findOne({ userId });
    if (!doc) {
      doc = new (FutureSelfDefault as any)({
        userId,
        isOnboarded: true,
        onboardingAnswers,
        letters: [day1Letter]
      });
    } else {
      doc.isOnboarded = true;
      doc.onboardingAnswers = onboardingAnswers;
      doc.letters = [day1Letter];
    }
    await doc.save();

    return res.status(200).json({ success: true, data: doc });

  } catch (err: any) {
    console.error("onboardFutureSelf error:", err);
    return res.status(500).json({ success: false, error: "Error onboarding future self." });
  }
}

/**
 * POST /future-self/generate-letter
 * Generates the letter for a specific day index (for daily automatic delivery or simulation testing)
 */
export async function generateFutureSelfLetter(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;
    const { dayIndex } = req.body;

    const parsedDayIndex = parseInt(dayIndex);
    if (!userId || isNaN(parsedDayIndex) || parsedDayIndex < 1) {
      return res.status(400).json({ success: false, error: "Missing or invalid parameters." });
    }

    const isFallback = getDbMode() === "fallback-memory";

    // 1. Fetch current session
    let session: any = null;
    if (isFallback) {
      session = cacheFutureSelves.find((r) => r.userId === userId);
    } else {
      session = await (FutureSelfDefault as any).findOne({ userId });
    }

    if (!session || !session.isOnboarded) {
      return res.status(400).json({ success: false, error: "User is not onboarded with Future Self feature." });
    }

    // Sort letters by dayIndex to see if day exists
    const existingLetter = session.letters.find((l: any) => l.dayIndex === parsedDayIndex);
    if (existingLetter) {
      return res.status(200).json({ success: true, data: existingLetter, isNew: false });
    }

    // Retrieve user model attributes for customization
    let userProfile: any = null;
    if (isFallback) {
      userProfile = cacheUsers.find((u) => u._id === userId);
    } else {
      userProfile = await (UserDefault as any).findById(userId);
    }

    // 2. Generate brand new letter
    const newLetterData = await generateFutureSelfLetterInternal(userId as string, parsedDayIndex, session.onboardingAnswers, userProfile);
    const newLetter = {
      dayIndex: parsedDayIndex,
      message: newLetterData.message,
      category: newLetterData.category,
      isRevealed: false,
      notifiedAt: new Date(),
      notificationText: newLetterData.notificationText,
      createdAt: new Date()
    };

    if (isFallback) {
      session.letters.push(newLetter);
      session.updatedAt = new Date();
      return res.status(200).json({ success: true, data: newLetter, isNew: true });
    }

    // MongoDB push
    session.letters.push(newLetter);
    await session.save();

    return res.status(200).json({ success: true, data: newLetter, isNew: true });

  } catch (err: any) {
    console.error("generateFutureSelfLetter error:", err);
    return res.status(500).json({ success: false, error: "Failed generating physical letter from future." });
  }
}

/**
 * POST /future-self/reveal
 * Sets 'isRevealed = true' when user physically scratches card to save it permanently in archives
 */
export async function revealFutureSelfLetter(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;
    const { dayIndex } = req.body;

    const parsedDayIndex = parseInt(dayIndex);
    if (!userId || isNaN(parsedDayIndex)) {
      return res.status(400).json({ success: false, error: "Missing parameters." });
    }

    const isFallback = getDbMode() === "fallback-memory";

    if (isFallback) {
      const session = cacheFutureSelves.find((r) => r.userId === userId);
      if (!session) {
        return res.status(404).json({ success: false, error: "Future self connection session not located." });
      }
      
      const letterIdx = session.letters.findIndex((l: any) => l.dayIndex === parsedDayIndex);
      if (letterIdx !== -1) {
        session.letters[letterIdx].isRevealed = true;
        session.updatedAt = new Date();
        return res.status(200).json({ success: true, message: "Letter archived & permanently unlocked." });
      } else {
        return res.status(404).json({ success: false, error: "Daily letter record not located." });
      }
    }

    // MongoDB branch
    const session = await (FutureSelfDefault as any).findOne({ userId });
    if (!session) {
      return res.status(404).json({ success: false, error: "Future self connection profile not found." });
    }

    const letter = session.letters.find((l: any) => l.dayIndex === parsedDayIndex);
    if (letter) {
      letter.isRevealed = true;
      await session.save();
      return res.status(200).json({ success: true, message: "Letter archived & permanently unlocked." });
    } else {
      return res.status(404).json({ success: false, error: "Letter index not located in profile database." });
    }

  } catch (err: any) {
    console.error("revealFutureSelfLetter error:", err);
    return res.status(500).json({ success: false, error: "Error revealing daily future-self letter." });
  }
}

