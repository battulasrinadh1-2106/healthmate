import express from "express";
import { 
  sendOtp,
  verifyOtp,
  createProfile, 
  getProfile, 
  saveBmi, 
  getBmiHistory,
  searchFood,
  roastFood,
  saveSteps,
  getStepHistory,
  getFutureSelfStatus,
  onboardFutureSelf,
  generateFutureSelfLetter,
  revealFutureSelfLetter
} from "../controllers/userController.ts";

const router = express.Router();

// Authentication APIs
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

// Profile and health data APIs (per user)
router.post("/create-profile", createProfile);
router.get("/get-profile", getProfile);
router.post("/save-bmi", saveBmi);
router.get("/bmi-history", getBmiHistory);

// Real-Time Pedometer / Step Tracking APIs
router.post("/save-steps", saveSteps);
router.get("/step-history", getStepHistory);

// Universal Real Food Nutrition Lookup API
router.post("/food-search", searchFood);
router.post("/food-roast", roastFood);

// Meet Future You APIs
router.get("/future-self/status", getFutureSelfStatus);
router.post("/future-self/onboard", onboardFutureSelf);
router.post("/future-self/generate-letter", generateFutureSelfLetter);
router.post("/future-self/reveal", revealFutureSelfLetter);

export default router;
