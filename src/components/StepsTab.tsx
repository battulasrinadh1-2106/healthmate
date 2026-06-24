import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../lib/api';
import { 
  Footprints, 
  Flame, 
  MapPin, 
  Map,
  Check,
  Info,
  Calendar,
  Sparkles,
  CheckCircle,
  Bell,
  Trophy,
  Activity,
  Compass,
  ArrowRight,
  Zap,
  Users,
  AlertCircle,
  Clock,
  Heart,
  ChevronRight,
  Sparkle,
  Send,
  HelpCircle,
  Smile,
  Mail,
  ShieldAlert,
  Award,
  Lock,
  Unlock,
  Archive,
  Hourglass,
  RefreshCw,
  FileText
} from 'lucide-react';

import { UserProfile } from '../types';
import ScratchCard from './ScratchCard';
import { triggerCompanion, triggerCompanionQuote } from '../utils/companion';

// Component interfaces
interface StepsTabProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  caloriesBurned: number;
  stepGoal: number;
  setStepGoal: React.Dispatch<React.SetStateAction<number>>;
  sensorActive: boolean;
  sessionDuration: number;
  handleStartWalk: () => void;
  handleStopWalk: () => void;
  stepHistory: any[];
  stepHistoryLoading: boolean;
  statsAverages: {
    weeklySum: number;
    weeklyAvg: number;
    avgSteps?: number;
    totalKm?: number;
    totalCal?: number;
    weeklyDays?: any[];
  };
  getFoodEquivalent?: (cal: number) => {
    name: string;
    equivalentText: string;
    calories: number;
    image: string;
    motivation: string;
  };
  profile: UserProfile;
  bmiClassification: string;
  userId?: string;
  setActiveTab?: (tab: any) => void;
}

interface IFutureLetter {
  dayIndex: number;
  message: string;
  category: "Future Stories" | "Future Confessions" | "Future Secrets" | "Health Reflection";
  isRevealed: boolean;
  notifiedAt: string;
  notificationText: string;
  createdAt: string;
}

interface IFutureSelf {
  isOnboarded: boolean;
  onboardingAnswers?: {
    favoriteColor?: string;
    favoriteMovieGenre?: string;
    favoriteMovie?: string;
    favoriteSport?: string;
    favoriteBook?: string;
    favoriteMusicGenre?: string;
    favoriteSong?: string;
    dreamJob?: string;
    dreamCompany?: string;
    biggestDream?: string;
    biggestFear?: string;
    bestFriendName?: string;
    countryToVisit?: string;
    habitToBuild?: string;
    personWantToBecome?: string;
    [key: string]: string | undefined;
  };
  letters: IFutureLetter[];
}

// 15 personality questions requested in PART 1
// 15+ personality questions organized in REQUIRED and OPTIONAL groups
const questionsList = [
  // REQUIRED QUESTIONS GROUP
  { key: 'firstName', label: 'What is your First Name?', placeholder: 'E.g., Srinadh', hint: 'This lets your future self address you properly and intimately.', isRequired: true },
  { key: 'biggestGoal', label: 'What is your Biggest Goal right now?', placeholder: 'E.g., Getting physically fit, landing my dream job, coding robust systems', hint: 'The core metric we will achieve together.', isRequired: true },
  { key: 'biggestFear', label: 'What is your Biggest Fear?', placeholder: 'E.g., Regretting chances not taken, stagnation, wasting time', hint: 'We will look back and laugh at this fear together ten years later.', isRequired: true },
  { key: 'dreamLife', label: 'Describe your Dream Life in ten years.', placeholder: 'E.g., Living by the beach, working remotely, healthy and stress-free', hint: 'The canvas of your ultimate reality.', isRequired: true },
  { key: 'dreamJob', label: 'What is your Dream Job / Ultimate Purpose?', placeholder: 'E.g., Lead AI Researcher, Wellness Architect, Creative Director', hint: 'The professional calling you are working toward.', isRequired: true },
  { key: 'thingToChange', label: 'What is one thing you want to change about yourself?', placeholder: 'E.g., Stop procrastinating, go to bed early, be more patient', hint: 'Your future self is keeping a close eye on this shift.', isRequired: true },
  { key: 'thingProudOf', label: 'What is one thing you are proud of?', placeholder: 'E.g., Resiliency, picking myself up, my creative projects', hint: 'The beautiful foundation of your self-esteem.', isRequired: true },
  { key: 'favoriteHobby', label: 'What is your Favorite Hobby?', placeholder: 'E.g., Playing badminton, reading books, exploring mountain trails', hint: 'The pure, quiet joy of your current year.', isRequired: true },
  
  // OPTIONAL QUESTIONS GROUP
  { key: 'favoriteColor', label: 'Favorite Color', placeholder: 'E.g., Emerald green, cosmic slate, amber glow', hint: 'Defines the subtle color accents in incoming transmissions.' },
  { key: 'favoriteMovie', label: 'Favorite Movie', placeholder: 'E.g., Interstellar, Inception, About Time', hint: 'Injects nostalgic pop-culture references into notifications.' },
  { key: 'favoriteMovieGenre', label: 'Favorite Movie Genre', placeholder: 'E.g., Sci-Fi, Psychological Thriller, Drama', hint: 'Aligns the dramatic prose of your older memoirs.' },
  { key: 'favoriteSport', label: 'Favorite Sport', placeholder: 'E.g., Badminton, Cycling, Running, Swimming', hint: 'Highlights health and physical reflections.' },
  { key: 'favoriteBook', label: 'Favorite Book', placeholder: 'E.g., Meditations, Atomic Habits, Dune', hint: 'Influences wisdom quotes and ideas sent back.' },
  { key: 'favoriteSong', label: 'Favorite Song', placeholder: 'E.g., Time, Starboy, Space Oddity', hint: 'Saves a high-fidelity musical snapshot of your current year.' },
  { key: 'favoriteMusicGenre', label: 'Favorite Music Genre', placeholder: 'E.g., Synthwave, Ambient Indie, Classical Lofi', hint: 'Sets the background ambiance of future stories.' },
  { key: 'dreamCompany', label: 'Dream Company', placeholder: 'E.g., Google DeepMind, NASA, Apple', hint: 'The creative hubs of your upcoming milestones.' },
  { key: 'bestFriendName', label: 'Best Friend Name', placeholder: 'E.g., Arjun, Clara, Sameer', hint: 'Saves sweet recollections of shared laughter.' },
  { key: 'countryToVisit', label: 'Country You Want To Visit', placeholder: 'E.g., Japan, Iceland, Switzerland, Peru', hint: 'Logs geographic goals of future travel.' },
  { key: 'habitToBuild', label: 'Habit You Want To Build', placeholder: 'E.g., Morning walks, reading journal', hint: 'The cornerstone target of your health tracking.' },
  { key: 'habitToBreak', label: 'Habit You Want To Break', placeholder: 'E.g., Late night scrolling, procrastination', hint: 'Points to focus areas for future reflection.' },
  { key: 'thingToRemember', label: 'One thing you want Future You to remember', placeholder: 'E.g., How much you loved the quiet summer rain', hint: 'Saves a tiny memory capsule exclusively for older you.' }
];

// Local high-quality backup letters to ensure we NEVER show empty or blank letters
const getLocalFallbackLetter = (day: number, answers: any, name: string): { message: string; category: string; notificationText: string } => {
  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + 10;
  
  const firstName = answers?.firstName || name || "friend";
  const biggestGoal = answers?.biggestGoal || answers?.biggestGoalThisYear || "personal transformation";
  const biggestFear = answers?.biggestFear || "not reaching your full potential";
  const dreamLife = answers?.dreamLife || answers?.personWantToBecome || "a life of absolute freedom, peace, and meaningful impact";
  const dreamJob = answers?.dreamJob || "finding your deepest passion and ultimate purpose";
  const thingToChange = answers?.thingToChange || answers?.thingToImprove || "making better daily decisions";
  const thingProudOf = answers?.thingProudOf || answers?.thankFutureSelf || "not giving up when times got tough";
  const favoriteHobby = answers?.favoriteHobby || answers?.favoriteSport || "spending time on what makes you happy";

  const letters: Record<number, { message: string; category: string; notificationText: string }> = {
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
    }
  };

  return letters[day] || {
    category: "Future Stories",
    notificationText: `A new message from the future is ready.`,
    message: `${firstName},

Don't rush today.

I remember this exact week.

That's all I'll say.

— ${firstName} from ${futureYear}`
  };
};

export default function StepsTab({
  steps: currentLiveSteps,
  profile,
  bmiClassification,
  userId,
  setActiveTab
}: StepsTabProps) {

  // --- CORE STATE ENGINE ---
  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + 10;

  const [futureSelfState, setFutureSelfState] = useState<IFutureSelf | null>(null);
  const [loadingFutureSelf, setLoadingFutureSelf] = useState<boolean>(true);
  
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({
    favoriteColor: 'Emerald Green',
    favoriteMovieGenre: '',
    favoriteMovie: '',
    favoriteSport: '',
    favoriteBook: '',
    favoriteMusicGenre: '',
    favoriteSong: '',
    dreamJob: '',
    dreamCompany: '',
    biggestDream: '',
    biggestFear: '',
    bestFriendName: '',
    countryToVisit: '',
    habitToBuild: '',
    personWantToBecome: ''
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [startedOnboarding, setStartedOnboarding] = useState<boolean>(false);
  const handleStartOnboarding = () => {
    setStartedOnboarding(true);
    setOnboardingStep(1);
  };
  
  // Simulated day warp for testing
  const [customSimulateDay, setCustomSimulateDay] = useState<number>(2);

  const [submittingOnboard, setSubmittingOnboard] = useState<boolean>(false);
  const [generatingLetter, setGeneratingLetter] = useState<boolean>(false);
  const [revealingLetter, setRevealingLetter] = useState<boolean>(false);
  
  // Modal toggle states
  const [showFuturePreviewModal, setShowFuturePreviewModal] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'monthly' | 'daily'>('monthly');
  const [activePreviewDay, setActivePreviewDay] = useState<number>(11);
  const [viewingLetterDetails, setViewingLetterDetails] = useState<IFutureLetter | null>(null);
  
  // Scratch card modal overlay (Tapping "Today's Message From You" opens this)
  const [scratchModalOpen, setScratchModalOpen] = useState<boolean>(false);
  const [scratchDone, setScratchDone] = useState<boolean>(false);

  // Floating notification toast
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Future Tracker Waiting List state
  const [waitingListJoined, setWaitingListJoined] = useState<boolean>(() => localStorage.getItem('healthmate_tracker_waiting_list') === 'true');
  const [waitingCount, setWaitingCount] = useState<number>(() => {
    const base = 2184;
    const joined = localStorage.getItem('healthmate_tracker_waiting_list') === 'true';
    return joined ? base + 1 : base;
  });

  const handleJoinWaitingList = () => {
    localStorage.setItem('healthmate_tracker_waiting_list', 'true');
    setWaitingListJoined(true);
    setWaitingCount(prev => prev + 1);
    triggerLocalNotification("✨ Success! You are officially on the HealthMate walking tracker waiting list.");
    triggerCompanionQuote('waitingList', 'excited');
  };

  // Master steps simulator for visual feature previews
  const [simSteps, setSimSteps] = useState<number>(5000);
  const [historyTab, setHistoryTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  const name = profile?.fullName || "Friend";

  // Synchronically triggers HealthMate mascot advice whenever onboarding question changes
  useEffect(() => {
    if (onboardingStep > 1) {
      triggerCompanionQuote('questionSetup', 'thoughtful');
    }
  }, [onboardingStep]);

  // Trigger companion updates debounced on simulated steps updates
  useEffect(() => {
    if (simSteps === 5000) return; // Ignore initial state
    const t = setTimeout(() => {
      triggerCompanionQuote('trackerPreview', 'excited');
    }, 1200);
    return () => clearTimeout(t);
  }, [simSteps]);

  // --- INIT DATA & SYNC SAVER ---
  useEffect(() => {
    fetchFutureSelfStatus();
  }, [userId]);

  // Sync / Load Initial Onboarding & Letters
  const fetchFutureSelfStatus = async () => {
    setLoadingFutureSelf(true);
    if (!userId || userId === 'guest') {
      const local = localStorage.getItem('hm_future_self_guest');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setFutureSelfState(parsed);
          if (parsed.onboardingAnswers) {
            setOnboardingAnswers(prev => ({ ...prev, ...parsed.onboardingAnswers }));
          }
        } catch {}
      } else {
        setFutureSelfState({ isOnboarded: false, letters: [] });
      }
      setLoadingFutureSelf(false);
      return;
    }

    const cacheKey = `hm_future_self_cache_${userId}`;
    
    // First, load from cache optimistically to avoid layout shifts or white frames while waiting
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setFutureSelfState(parsed);
        if (parsed.onboardingAnswers) {
          setOnboardingAnswers(prev => ({ ...prev, ...parsed.onboardingAnswers }));
        }
      } catch {}
    }

    try {
      const res = await apiFetch(`/api/future-self/status?userId=${userId}`, {
        headers: { "x-user-id": userId || "" }
      });
      const json = await res.json();

      if (json.success && json.data) {
        setFutureSelfState(json.data);
        // Persist newly fetched state to fast-load cache
        localStorage.setItem(cacheKey, JSON.stringify(json.data));
        if (json.data.onboardingAnswers) {
          setOnboardingAnswers(prev => ({
            ...prev,
            ...json.data.onboardingAnswers
          }));
        }
      } else if (!cached) {
        // Only set empty state if there is no offline cache available
        setFutureSelfState({ isOnboarded: false, letters: [] });
      }
    } catch (e) {
      console.warn("fetchFutureSelfStatus serving from cached fallback:", e);
      if (!cached) {
        setFutureSelfState({ isOnboarded: false, letters: [] });
      }
    } finally {
      setLoadingFutureSelf(false);
    }
  };

  // 12:00 AM Midnight Trigger simulation helper & auto-trigger on startup
  useEffect(() => {
    if (futureSelfState?.isOnboarded && futureSelfState.letters?.length > 0) {
      const letters = futureSelfState.letters;
      const latest = letters[letters.length - 1];
      if (latest && latest.createdAt) {
        const createdDate = new Date(latest.createdAt);
        const currentDate = new Date();
        
        // Match day change to auto trigger and alert user
        const calendarDayChanged = 
          createdDate.getDate() !== currentDate.getDate() || 
          createdDate.getMonth() !== currentDate.getMonth() || 
          createdDate.getFullYear() !== currentDate.getFullYear();
          
        if (calendarDayChanged) {
          console.log("Diurnal midnight transition detected. Loading next letter transmission!");
          triggerDailyLetterSync(letters.length + 1);
        }
      }
    }
  }, [futureSelfState]);

  // Helper to trigger tomorrow's letter automatically
  const triggerDailyLetterSync = async (nextIndex: number) => {
    if (!userId || userId === 'guest') {
      const mockLetter = getLocalFallbackLetter(nextIndex, onboardingAnswers, name);
      const newLetterObj: IFutureLetter = {
        dayIndex: nextIndex,
        message: mockLetter.message,
        category: mockLetter.category as any,
        isRevealed: false,
        notifiedAt: new Date().toISOString(),
        notificationText: mockLetter.notificationText,
        createdAt: new Date().toISOString()
      };
      const updatedLetters = [...(futureSelfState?.letters || []), newLetterObj];
      const newState = {
        isOnboarded: true,
        onboardingAnswers,
        letters: updatedLetters
      };
      setFutureSelfState(newState);
      localStorage.setItem('hm_future_self_guest', JSON.stringify(newState));
      setCustomSimulateDay(nextIndex + 1);
      
      triggerLocalNotification(`📩 Your ${futureYear} Self left a message. Scratch off today's transmission!`);
      return;
    }

    try {
      const r = await apiFetch(`/api/future-self/generate-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId || "" },
        body: JSON.stringify({ userId, dayIndex: nextIndex })
      });
      const resJson = await r.json();
      if (resJson.success && resJson.data) {
        setFutureSelfState(resJson.data);
        setCustomSimulateDay(nextIndex + 1);
        triggerLocalNotification(`📩 Your ${futureYear} Self left a message. Scratch off today's transmission!`);
      }
    } catch (err) {
      console.error("Auto trigger error:", err);
    }
  };

  const triggerLocalNotification = (alertMsg: string) => {
    setNotificationToast(alertMsg);
    // Beep sound effect
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
    
    // Auto dismissing after 8 seconds
    setTimeout(() => {
      setNotificationToast(null);
    }, 8000);
  };

  // Submit onboarding answers
  const handleOnboardSubmit = async () => {
    setSubmittingOnboard(true);

    if (!userId || userId === 'guest') {
      const firstLetterObj = getLocalFallbackLetter(1, onboardingAnswers, name);
      const initialLetter: IFutureLetter = {
        dayIndex: 1,
        message: firstLetterObj.message,
        category: firstLetterObj.category as any,
        isRevealed: false,
        notifiedAt: new Date().toISOString(),
        notificationText: firstLetterObj.notificationText,
        createdAt: new Date().toISOString()
      };
      
      const newState: IFutureSelf = {
        isOnboarded: true,
        onboardingAnswers,
        letters: [initialLetter]
      };
      setFutureSelfState(newState);
      localStorage.setItem('hm_future_self_guest', JSON.stringify(newState));
      setSubmittingOnboard(false);
      setCustomSimulateDay(2);
      triggerLocalNotification("🌌 Connected! Your future self sent a Day 1 transmission.");
      return;
    }

    try {
      // Corrected API parameter to meet server-side expectations
  
      const res = await apiFetch(`/api/future-self/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || ""
        },
        body: JSON.stringify({
          userId,
          onboardingAnswers: onboardingAnswers
        })
      });
      const json = await res.json();
      

      if (json.success && json.data) {
        setFutureSelfState(json.data);
        triggerLocalNotification("🌌 Connected! Your future self sent a Day 1 transmission.");
      }
    } catch (e) {
      console.error("handleOnboardSubmit error:", e);
    } finally {
      setSubmittingOnboard(false);
    }
  };

  // Warp day simulation trigger (Time Travel Engine)
  const handleGenerateNextLetter = async () => {
    setGeneratingLetter(true);
    const nextDay = (futureSelfState?.letters?.length || 0) + 1;
    const targetDay = Math.max(nextDay, customSimulateDay);

    if (!userId || userId === 'guest') {
      const mockLetter = getLocalFallbackLetter(targetDay, onboardingAnswers, name);
      const newLetterObj: IFutureLetter = {
        dayIndex: targetDay,
        message: mockLetter.message,
        category: mockLetter.category as any,
        isRevealed: false,
        notifiedAt: new Date().toISOString(),
        notificationText: mockLetter.notificationText,
        createdAt: new Date().toISOString()
      };
      const updatedLetters = [...(futureSelfState?.letters || []), newLetterObj];
      const newState = {
        isOnboarded: true,
        onboardingAnswers,
        letters: updatedLetters
      };
      setFutureSelfState(newState);
      localStorage.setItem('hm_future_self_guest', JSON.stringify(newState));
      setGeneratingLetter(false);
      setCustomSimulateDay(targetDay + 1);
      setScratchDone(false);
      triggerLocalNotification(`📬 Day ${targetDay} transmission successfully declassified and unlocked!`);
      return;
    }

    try {
      const res = await apiFetch(`/api/future-self/generate-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || ""
        },
        body: JSON.stringify({
          userId,
          dayIndex: targetDay
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setFutureSelfState(json.data);
        setCustomSimulateDay(targetDay + 1);
        setScratchDone(false);
        triggerLocalNotification(`📬 Day ${targetDay} transmission successfully declassified and unlocked!`);
      }
    } catch (e) {
      console.error("handleGenerateNextLetter error:", e);
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Reveal / Scratch completion saver
  const handleRevealScratchCard = async (dayIdx: number) => {
    setRevealingLetter(true);
    
    // Optimistic state updates for zero-lag instant reveals
    const current = futureSelfState?.letters || [];
    const updated = current.map(l => l.dayIndex === dayIdx ? { ...l, isRevealed: true } : l);
    const newState = {
      ...(futureSelfState as IFutureSelf),
      letters: updated
    };
    setFutureSelfState(newState);
    setScratchDone(true);
    triggerCompanionQuote('messageRevealAfter', 'excited');

    if (!userId || userId === 'guest') {
      localStorage.setItem('hm_future_self_guest', JSON.stringify(newState));
      setRevealingLetter(false);
      return;
    }

    try {
      const res = await apiFetch(`/api/future-self/reveal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || ""
        },
        body: JSON.stringify({
          userId,
          dayIndex: dayIdx
        })
      });
      const json = await res.json();
      if (!json.success) {
        console.warn("Timeline server reveal sync deferred. Fallback storage persistent.");
      }
    } catch (e) {
      console.error("handleRevealScratchCard background sync error:", e);
    } finally {
      setRevealingLetter(false);
    }
  };

  // --- DYNAMIC SLIDER METRICS PREVIEW ---
  const simMetrics = useMemo(() => {
    // 5000 steps ≈ 220 calories ≈ 2 rotis
    const calPerStep = 0.044;
    const calories = Math.round(simSteps * calPerStep);
    
    // 1 wheat roti ≈ 110 kcal
    const rotiCount = parseFloat((calories / 110).toFixed(1)); 
    const riceBowlCount = parseFloat((calories / 150).toFixed(1)); // ~150 kcal brown rice
    const samosaPercent = Math.round((calories / 260) * 100); // ~260 kcal samosa

    // Distance mapping (1 step ≈ 0.00075 Km)
    const distanceKm = parseFloat((simSteps * 0.00075).toFixed(2));
    const durationMinutes = Math.round(simSteps / 110); // Standard speed cadence is ~110 SPM

    // Professional stadium field loops (1 loop = ~400 meters / 0.4 Km)
    const footballFields = Math.round((distanceKm * 1000) / 100);
    const bigBenClimbs = parseFloat(((distanceKm * 1000) / 96).toFixed(1)); // Big Ben ≈ 96m height

    // Cadence speed classification metrics
    const slowPct = simSteps < 3500 ? 60 : simSteps < 8500 ? 30 : 15;
    const briskPct = simSteps < 4500 ? 10 : simSteps < 8500 ? 45 : 70;
    const normalPct = 100 - slowPct - briskPct;

    const slowSteps = Math.round((simSteps * slowPct) / 100);
    const normalSteps = Math.round((simSteps * normalPct) / 100);
    const briskSteps = Math.round((simSteps * briskPct) / 100);

    return {
      calories,
      distanceKm,
      rotiCount,
      riceBowlCount,
      samosaPercent,
      footballFields,
      bigBenClimbs,
      durationMinutes,
      slowPct,
      normalPct,
      briskPct,
      slowSteps,
      normalSteps,
      briskSteps
    };
  }, [simSteps]);

  // Handle click on Today's Message From You card (Open Decryption Scratch Overlay)
  const handleOpenTodayMessageCard = () => {
    if (!futureSelfState?.isOnboarded) {
      // Encourage start journey
      handleStartOnboarding();
      return;
    }
    const letters = futureSelfState.letters || [];
    const latestLetter = letters[letters.length - 1];
    if (!latestLetter) return;

    if (!latestLetter.isRevealed) {
      setScratchDone(false);
      setScratchModalOpen(true);
      triggerCompanionQuote('messageRevealBefore', 'thoughtful');
    } else {
      // Already decrypted, view clean letters dialog
      setViewingLetterDetails(latestLetter);
    }
  };

  return (
    <div className="space-y-10 text-slate-100 min-h-[600px] pb-16 tracking-wide" id="pacer-dashboard-wrapper">
      
      {/* 📬 FLOATING TEMPORAL TOAST BANNER */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-20 left-4 right-4 md:left-auto md:right-8 z-50 md:max-w-md bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 border border-emerald-500/30 p-4 rounded-2xl shadow-2xl flex items-start gap-3.5 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
              <Mail className="w-5.5 h-5.5 text-emerald-400 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block leading-none">TIMELINE NOTIFICATION</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">{notificationToast}</p>
            </div>
            <button 
              onClick={() => setNotificationToast(null)}
              className="text-xs text-slate-500 hover:text-slate-200 outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SECTION 1: WALKING TRACKER HERO --- */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-900/80 rounded-[32px] p-8 sm:p-10 text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden" id="section-1-tracker-status">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        
        <div className="relative space-y-4 max-w-2xl mx-auto font-sans">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center justify-center gap-2">
            🚶 Walking Tracker
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-medium tracking-wide">
            We are currently building a smarter and more beautiful walking experience for HealthMate.
            <span className="block mt-2 font-semibold text-emerald-400">Our goal is not just to count steps.</span>
            Our aim is to help you understand what your movement means in real life.
            <span className="block mt-2 font-light text-slate-400 text-xs sm:text-sm text-center">A new walking experience is coming soon. Explore the interactive preview below.</span>
          </p>

          <div className="my-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 max-w-md mx-auto text-center space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-emerald-400">
              ✨ Planned for HealthMate Version 2.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We're working hard to bring this experience to you as quickly as possible.
            </p>
          </div>
          
          <div className="pt-3">
            <button
              type="button"
              onClick={() => setShowFuturePreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider text-emerald-400 hover:text-emerald-350 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 transition-all cursor-pointer shadow-sm active:scale-98"
              id="btn-see-future-tracker-preview"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Preview Future Tracker
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 1.5: FUTURE TRACKER ACCESS (WAITING LIST) --- */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950 border border-slate-900 rounded-[32px] p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden text-left" id="section-waiting-list">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.015] via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
          <div className="space-y-2 max-w-xl">
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-500/10">
              Future Tracker Access
            </span>
            <h3 className="text-xl font-black font-sans text-white tracking-tight">
              We are building the most beautiful walking experience in HealthMate.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed font-semibold">
              Unlock elegant biospatial metrics, intuitive food equivalents, deep landmark analysis, and seamless visual rewards designed to elevate your daily strides.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10.5px] font-mono font-bold text-slate-500">
                <span className="text-emerald-400 font-black">{waitingCount.toLocaleString()}</span> users are waiting.
              </p>
            </div>
          </div>
          <div>
            {waitingListJoined ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/15 px-6 py-3 rounded-2xl text-center flex items-center justify-center gap-2 text-emerald-400 font-sans font-bold"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[10.5px] uppercase tracking-wider font-extrabold font-mono">You're on the list!</span>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={handleJoinWaitingList}
                className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider font-mono shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
              >
                Notify Me When Ready
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: MEET FUTURE YOU & TODAY'S TRANSMISSION --- */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-900/90 rounded-[40px] p-8 sm:p-10 max-w-4xl mx-auto space-y-6 relative overflow-hidden text-left shadow-2xl" id="section-2-meet-future-self">
        {/* Subtle physical biological theme pattern backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
          <Sparkles className="w-20 h-20 text-amber-400" />
        </div>

        {/* Header segment */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/15 text-amber-400 text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/10 inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" /> A Message Was Recovered For You
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
              Something From <span className="text-amber-400 font-serif italic font-medium">{futureYear}</span> Found Its Way Back
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Read what your older self wanted you to read. One private letter is delivered at midnight.
            </p>
          </div>

          {!loadingFutureSelf && futureSelfState?.isOnboarded && (
            <button 
              type="button"
              onClick={fetchFutureSelfStatus}
              className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              id="btn-sync-timeline"
            >
              <RefreshCw className="w-3 h-3 text-amber-500" /> Retrieve Mail
            </button>
          )}
        </div>

        {/* Content routing based on state */}
        {loadingFutureSelf ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Uncovering saved notes...</p>
          </div>
        ) : !futureSelfState?.isOnboarded ? (
          /* PART 1 - SETUP FLOW */
          <div className="space-y-6" id="onboarding-flow-container">
            {!startedOnboarding ? (
              /* CLEAN SETUP INTRODUCTION SUMMARY CARD */
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 p-6 sm:p-8 rounded-[28px] border border-slate-850 text-center space-y-6 max-w-xl mx-auto shadow-2xl font-sans"
                id="setup-intro-card"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">📩 Your Future Self Left Something Behind</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                    No AI, no coaches, and no guidelines—just quiet, personal letters written from your older self living ten years ahead in <span className="text-amber-400 font-bold">{futureYear}</span>, arriving quietly at every midnight.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleStartOnboarding}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-450 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider block font-mono"
                    id="btn-onboard-start-journey"
                  >
                    Open My Lockbox 🌌
                  </button>
                </div>
              </motion.div>
            ) : (
              /* LIGHT-WEIGHT INTERACTIVE QUIZ (ONE QUESTION PER SCREEN) */
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/60 p-6 sm:p-8 rounded-[32px] border border-slate-850 space-y-6 max-w-2xl mx-auto shadow-2xl relative text-left"
                id="personality-questions-wizard"
              >
                {/* Steps Header bar */}
                <div className="flex justify-between items-center text-xs font-mono select-none">
                  <span className="text-amber-400 font-black uppercase tracking-wider text-[10px]">
                    Connecting Your Future
                  </span>
                  <span className="text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/10 text-[10px]">
                    Step {onboardingStep} of {questionsList.length}
                  </span>
                </div>

                {/* Progress bar indicators (columns count based on questionsList) */}
                <div className="flex gap-1 h-1 bg-slate-950 rounded-full overflow-hidden">
                  {questionsList.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`flex-1 h-full transition-all duration-300 ${
                        idx < onboardingStep ? 'bg-emerald-400 shadow-sm' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Question form area */}
                {(() => {
                  const curQ = questionsList[onboardingStep - 1];
                  if (!curQ) return null;
                  const isCurrentAnswerEmpty = !onboardingAnswers[curQ.key]?.trim();
                  const isNextDisabled = curQ.isRequired && isCurrentAnswerEmpty;

                  return (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase tracking-wider">
                          Question {onboardingStep} {curQ.isRequired ? '· Required' : ''}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-100 tracking-tight font-sans">
                          {curQ.label}
                        </h3>
                        <p className="text-xs text-slate-450 leading-relaxed font-sans font-medium">
                          {curQ.hint}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <input 
                          type="text"
                          placeholder={curQ.placeholder}
                          value={onboardingAnswers[curQ.key] || ''}
                          onChange={(e) => setOnboardingAnswers(prev => ({ ...prev, [curQ.key]: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all font-sans"
                          autoFocus
                          id={`input-onboard-q-${curQ.key}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (!isNextDisabled) {
                                if (onboardingStep < questionsList.length) {
                                  setOnboardingStep(prev => prev + 1);
                                } else {
                                  handleOnboardSubmit();
                                }
                              }
                            }
                          }}
                        />
                        {curQ.isRequired && isCurrentAnswerEmpty ? (
                          <p className="text-[9px] text-rose-400 font-mono text-left">This question is required to connect to your future</p>
                        ) : (
                          <p className="text-[9px] text-slate-605 font-mono text-right">Press Enter to progress</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Controls toolbar */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-850 font-sans">
                  <div>
                    {onboardingStep > 1 && (
                      <button 
                         type="button"
                        onClick={() => setOnboardingStep(prev => prev - 1)}
                        className="text-xs text-slate-450 hover:text-slate-200 font-black transition-colors cursor-pointer font-mono"
                        id="btn-onboard-prev"
                      >
                        BACK
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const curQ = questionsList[onboardingStep - 1];
                      if (!curQ) return null;
                      const isCurrentAnswerEmpty = !onboardingAnswers[curQ.key]?.trim();
                      const isNextDisabled = curQ.isRequired && isCurrentAnswerEmpty;

                      return (
                        <>
                          {!curQ.isRequired && (
                            <button 
                              type="button"
                              onClick={() => {
                                setOnboardingAnswers(prev => ({ ...prev, [curQ.key]: '' }));
                                if (onboardingStep < questionsList.length) {
                                  setOnboardingStep(prev => prev + 1);
                                  triggerCompanionQuote('questionSetup', 'thoughtful');
                                } else {
                                  handleOnboardSubmit();
                                }
                              }}
                              className="text-xs text-slate-500 hover:text-slate-300 font-bold px-3.5 py-2 transition-colors cursor-pointer font-mono border border-transparent rounded-lg hover:bg-slate-950"
                              id="btn-onboard-skip"
                            >
                              [ SKIP ]
                            </button>
                          )}

                          {onboardingStep < questionsList.length ? (
                            <button 
                              type="button"
                              disabled={isNextDisabled}
                              onClick={() => setOnboardingStep(prev => prev + 1)}
                              className={`px-5 py-2 rounded-xl text-xs font-black transition-all font-mono flex items-center gap-1 cursor-pointer ${
                                isNextDisabled 
                                  ? 'bg-slate-950 border border-slate-900 text-slate-700 cursor-not-allowed'
                                  : 'bg-slate-950 border border-slate-800 text-amber-450 hover:text-amber-400'
                              }`}
                              id="btn-onboard-next"
                            >
                              NEXT <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button 
                              type="button"
                              disabled={false}
                              //onClick={handleOnboardSubmit}
                              onClick={() => {
                          
                                 handleOnboardSubmit();
                                }}

                              className="bg-amber-500 hover:bg-amber-450 text-slate-950 hover:scale-[1.01] active:scale-98 px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono inline-flex items-center gap-1.5"
                              id="btn-onboard-finish"
                            >
                              {submittingOnboard ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  SAVING ANSWERS...
                                </>
                              ) : (
                                <>
                                  CONNECT TO {futureYear} 🚀
                                </>
                              )}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* SYNCED ACTIVE METRICS & TIMELINE MESSAGER CARD */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: TODAY'S MESSAGE FROM YOU */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              onClick={handleOpenTodayMessageCard}
              className="bg-slate-950/90 border border-amber-500/15 hover:border-amber-500/45 p-6 rounded-[32px] relative shadow-2xl cursor-pointer text-left flex flex-col justify-between space-y-4 group overflow-hidden transition-all duration-300"
              id="todays-message-card"
            >
              {/* Subtle amber chronological pulse backglow */}
              <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none" />
              
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Mail className="w-16 h-16 text-amber-400" />
              </div>

              {(() => {
                const letters = futureSelfState.letters || [];
                const latestLetter = letters[letters.length - 1];

                if (!latestLetter) {
                  return (
                    <div className="space-y-2 py-4">
                      <Lock className="w-6 h-6 text-slate-500" />
                      <p className="text-xs text-slate-400">Future archive stream idle.</p>
                      <p className="text-[10px] text-slate-500 font-mono">Tap below to trigger connection.</p>
                    </div>
                  );
                }

                const isRevealed = latestLetter.isRevealed;

                return (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900/50 pb-2">
                        <span className="text-[9px] font-mono tracking-widest font-black text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                          TRANSMISSION #00{latestLetter.dayIndex}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                          {isRevealed ? "• OPENED" : "• LOCKED"}
                        </span>
                      </div>

                      {isRevealed ? (
                        <div className="space-y-4 font-sans">
                          {/* Rich glassmorphic gold script parchment sheet */}
                          <div className="relative bg-gradient-to-br from-amber-500/[0.04] via-amber-600/[0.01] to-transparent border border-amber-500/10 rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-inner">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
                            
                            <p className="text-[12.5px] text-amber-100/90 leading-relaxed italic pr-1 font-serif tracking-wide whitespace-pre-wrap select-text">
                              "{latestLetter.message}"
                            </p>
                          </div>
                          
                          <div className="bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-xl text-[10px] text-amber-400 font-mono font-medium flex items-center gap-1.5 leading-tight">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>This transmission is saved. Next declassified record arrives tonight.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-1">
                          {/* Sealed Ancient Secret Wax Panel Visual */}
                          <div className="relative border border-dashed border-amber-500/25 bg-slate-900/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 overflow-hidden shadow-inner group-hover:border-amber-500/40 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/[0.01] to-red-500/[0.01] pointer-events-none" />
                            
                            {/* Glowing Amber Circular Physical Wax Seal */}
                            <div className="relative flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center relative shadow-lg">
                                <FileText className="w-5 h-5 text-amber-400/95" />
                              </div>
                              <span className="absolute inset-0 rounded-full border border-amber-400/20 scale-110 opacity-70 animate-pulse" />
                            </div>

                            <div className="space-y-1.5 px-2">
                              <h5 className="font-serif text-sm font-medium text-amber-100 tracking-tight">
                                Your Future Left Something Private
                              </h5>
                              <p className="text-[10.5px] text-slate-450 leading-relaxed max-w-[245px] font-medium">
                                A personal memory from ten years ahead is waiting. Erase the static shield to open it.
                              </p>
                            </div>

                            <div className="pt-1 select-none">
                              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-mono font-black text-[9px] tracking-widest px-4.5 py-2.5 rounded-xl uppercase shadow-md group-hover:shadow-amber-500/20 group-hover:scale-[1.02] active:scale-97 transition-all leading-none">
                                <Unlock className="w-2.5 h-2.5" /> ERASE TRANSMITTAL SHIELD
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-900/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>Status: {isRevealed ? "Saved in Logbook" : "Awaiting cover erase"}</span>
                      <span className="group-hover:text-amber-400 transition-colors inline-flex items-center gap-0.5 font-bold">
                        {isRevealed ? "Read letter" : "Uncover letter"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* CARD 2: SCRATCH WRAPPER FOR USER REASSURANCE */}
            <div className="bg-slate-950/80 p-6 rounded-[32px] border border-slate-900 text-left flex flex-col justify-between" id="today-transmission-narrative">
              <div className="space-y-4 font-sans">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black block border border-amber-500/10 bg-amber-500/5 px-2.5 py-0.5 rounded w-max">RECOVERED RECORD ANALYSIS</span>
                <h4 className="text-base font-bold text-slate-100 font-sans tracking-tight leading-none pt-1">Messages From Ten Years Ahead</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  These pages contain small recollections, fragments of laughter, and warnings from your future self. Use them to reflect upon your daily habits and choices today.
                </p>
                
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-850/60 space-y-2 text-[10.5px] font-mono text-slate-400">
                  <div className="flex justify-between"><span>Origin Year:</span> <span className="text-amber-400 font-bold">Year {futureYear}</span></div>
                  <div className="flex justify-between"><span>Addressed To:</span> <span className="text-slate-200">{name} (Age {profile?.age || 26})</span></div>
                  <div className="flex justify-between"><span>Origin Sender:</span> <span className="text-amber-400 font-bold">{name} (Age {(profile?.age || 26) + 10})</span></div>
                  <div className="flex justify-between"><span>Connection Lock:</span> <span className="text-emerald-400 font-bold">Active</span></div>
                  <div className="flex justify-between"><span>Logged Pages:</span> <span className="text-slate-200">{futureSelfState.letters?.length || 0} recovered</span></div>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* --- SECTION 3: FUTURE MESSAGE ARCHIVE --- */}
      {futureSelfState?.isOnboarded && (
        <section className="bg-slate-950/40 border border-slate-900 rounded-[36px] p-6 sm:p-8 max-w-4xl mx-auto space-y-5 text-left" id="section-3-archives">
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-4">
            <Archive className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-black font-mono text-slate-200 uppercase tracking-wide">
              Private Letter Archives ({futureSelfState.letters.filter(l => l.isRevealed).length} Saved)
            </h4>
          </div>

          {futureSelfState.letters.filter(l => l.isRevealed).length === 0 ? (
            <div className="bg-slate-950/60 border border-slate-900 p-8 rounded-3xl text-center space-y-2">
              <Lock className="w-8 h-8 text-slate-650 mx-auto animate-pulse" />
              <p className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wide">No Letters Saved Yet</p>
              <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-normal font-sans font-medium">
                Uncover today's transmission above by tapping its card and rubbing off the static shield layer to save items permanently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              {[...futureSelfState.letters]
                .filter(l => l.isRevealed)
                .sort((a,b) => b.dayIndex - a.dayIndex)
                .map((letter) => (
                  <div 
                    key={letter.dayIndex}
                    onClick={() => setViewingLetterDetails(letter)}
                    className="bg-slate-900/35 hover:bg-slate-900/50 p-4 rounded-2xl border border-slate-850/60 transition-all cursor-pointer flex flex-col justify-between text-left space-y-3 group hover:border-amber-500/25"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-black font-mono tracking-wider text-amber-500">
                          TRANSMISSION #00{letter.dayIndex}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900/60 font-black uppercase tracking-wider">
                          {letter.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium line-clamp-3">
                        "{letter.message.replace(/Hey.*\r?\n+/, '').substring(0, 105)}..."
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 flex items-center justify-between group-hover:text-amber-400 transition-colors">
                      <span>Read full letter</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* --- SECTION 4: COMING SOON TRACKER FEATURES --- */}
      <section className="bg-slate-950/40 border border-slate-900 rounded-[36px] p-6 sm:p-8 max-w-4xl mx-auto space-y-8 text-left" id="section-4-preview">
        <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-1 block">
            <span className="text-[9px] font-mono uppercase text-emerald-400 font-black tracking-widest bg-emerald-500/10 px-2.0 py-0.5 rounded inline-block border border-emerald-500/10">PREMIUM UPGRADE</span>
            <h4 className="text-sm font-black font-mono text-slate-200 uppercase tracking-widest block leading-none pt-1">FUTURE PREMIUM HEALTH ECOSYSTEM</h4>
            <p className="text-xs text-slate-400 font-sans font-medium">Under active development. Preview our upcoming high-fidelity tracking features coming in the next update!</p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1: 🚶 Steps */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">🚶 Daily Steps</h5>
              </div>
              <div className="pt-2 font-sans">
                <div className="text-3xl font-display font-black text-white">{simSteps.toLocaleString()}</div>
                <p className="text-[10.5px] text-slate-450 mt-1">Goal progress metric tracking</p>
              </div>
              
              <div className="space-y-1 pt-1 font-sans">
                <div className="flex justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Pace goal</span>
                  <span>{Math.round((simSteps / 10000) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (simSteps / 10000) * 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2 rounded-lg border border-slate-900/40 text-center">
              Target Cadence: 110 SPM
            </div>
          </div>

          {/* Bento Card 2: 🔥 Calories */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">🔥 METABOLIC BURN</h5>
              </div>
              <div className="pt-2 font-sans">
                <div className="text-3xl font-display font-black text-white">{simMetrics.calories} <span className="text-xs font-mono font-normal text-slate-450">kcal</span></div>
                <p className="text-[10.5px] text-slate-450 mt-1">Simulated raw metabolic expenditure</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2 rounded-lg border border-slate-900/40 text-center font-sans">
              Direct off-wrist tracking algorithms
            </div>
          </div>

          {/* Bento Card 3: 📏 Distance */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">📏 Geodistance</h5>
              </div>
              <div className="pt-2 font-sans">
                <div className="text-3xl font-display font-black text-white">{simMetrics.distanceKm} <span className="text-xs font-mono font-normal text-slate-450">KM</span></div>
                <p className="text-[10.5px] text-slate-450 mt-1">Calculated geodesic space traveled</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-blue-400/90 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10 text-center font-sans">
              ⏱ Approx {simMetrics.durationMinutes} mins walk
            </div>
          </div>

          {/* Bento Card 4: 🍔 Food Equivalents */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl col-span-1 md:col-span-1">
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500 font-sans">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">🍔 Food Equivalent</h5>
              </div>
              <div className="pt-1 space-y-1.5">
                <div className="text-lg font-black font-sans text-amber-400">≈ {simMetrics.rotiCount} Rotis</div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                  Burns the metabolic equivalent of eating <span className="text-amber-400 font-bold">{simMetrics.rotiCount} whole wheat rotis</span> (110 kcal each), <span className="text-amber-400 font-bold">{simMetrics.riceBowlCount} brown rice bowls</span>, or <span className="text-amber-400 font-bold">{simMetrics.samosaPercent}% of a fried samosa</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[22px] justify-center py-2 bg-slate-950/20 rounded-xl border border-slate-900/50">
              🥘 🍔 🍦
            </div>
          </div>

          {/* Bento Card 5: 🏛 Landmark Equivalents */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl col-span-1 md:col-span-1">
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400">
                  <Map className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">🏛 Landmark Scales</h5>
              </div>
              <div className="pt-1 space-y-1.5 font-sans">
                <div className="text-sm font-black font-sans text-indigo-400">≈ {simMetrics.bigBenClimbs} Big Ben climbs</div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                  Walking this distance is equal to crossing <span className="text-indigo-400 font-bold">{simMetrics.footballFields} professional stadium fields</span>, or climbing stairs in <span className="text-indigo-400 font-bold">Big Ben tower {simMetrics.bigBenClimbs} times</span>.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2 rounded-lg border border-slate-900/40 text-center font-sans">
              Historical elevation multipliers
            </div>
          </div>

          {/* Bento Card 6: 🏆 Achievements */}
          <div className="bg-slate-900/60 border border-slate-850/80 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all duration-300 shadow-xl col-span-1 md:col-span-2 lg:col-span-1">
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2.5 font-sans">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center text-yellow-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <h5 className="text-[11px] font-mono font-black text-slate-350 uppercase tracking-widest">🏆 Dynamic Badges</h5>
              </div>
              <div className="pt-1 space-y-2.5 font-sans">
                <div className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-900/60">
                  <span className="text-base shrink-0">🥇</span>
                  <div className="leading-tight">
                    <div className="text-[11px] font-bold text-white">First Step Match</div>
                    <p className="text-[9px] text-slate-500">Continuous sync active</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-2 py-2 rounded-xl border transition-all ${simSteps >= 8500 ? 'bg-amber-500/5 border-amber-500/15' : 'bg-slate-950/10 border-slate-900/30 opacity-50'}`}>
                  <span className="text-base shrink-0">⚡</span>
                  <div className="leading-tight font-sans">
                    <div className="text-[11px] font-bold text-white">Cardio Peak</div>
                    <p className="text-[9px] text-slate-500">
                      {simSteps >= 8500 ? 'Unlocked!' : 'Requires 8.5K+ steps'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>


      </section>

        {/* --- PREMIUM FUTURE TRACKER PREVIEW MODAL --- */}
      <AnimatePresence>
        {showFuturePreviewModal && (() => {
          // Beautiful mock month date set representing Screenshot 1
          const previewDaysData = [
            { day: 13, steps: 352, distance: 0.26, calories: 11, slowSteps: 108, slowPct: 31, briskSteps: 244, briskPct: 69, dateText: '6/13/2026' },
            { day: 12, steps: 2001, distance: 1.50, calories: 60, slowSteps: 855, slowPct: 43, briskSteps: 1146, briskPct: 57, dateText: '6/12/2026' },
            { day: 11, steps: 1692, distance: 1.27, calories: 51, slowSteps: 711, slowPct: 43, briskSteps: 981, briskPct: 57, dateText: '6/11/2026' },
            { day: 10, steps: 3614, distance: 2.71, calories: 108, slowSteps: 1116, slowPct: 31, briskSteps: 2498, briskPct: 69, dateText: '6/10/2026' },
            { day: 9, steps: 1794, distance: 1.35, calories: 54, slowSteps: 862, slowPct: 49, briskSteps: 932, briskPct: 51, dateText: '6/09/2026' },
            { day: 8, steps: 6158, distance: 4.62, calories: 185, slowSteps: 2100, slowPct: 34, briskSteps: 4058, briskPct: 66, dateText: '6/08/2026' },
          ];

          const activeData = previewDaysData.find(d => d.day === activePreviewDay) || previewDaysData[2];

          // Helper functions to convert calories and distance to customized items
          const getFoodEquivalentLocal = (kcal: number) => {
            if (kcal <= 55) {
              const samosaCount = parseFloat((kcal / 40).toFixed(2));
              return {
                title: "Total calories burned",
                value: `${kcal} kcal`,
                equivalent: `≈${samosaCount} Samosas`,
                desc: "Burns the metabolic equivalent of classic freshly fried golden samosas.",
                colorClass: "from-amber-600/10 to-orange-500/5 border-orange-500/10",
                iconBg: "bg-orange-500/10 text-orange-400",
                illustration: (
                  <svg viewBox="0 0 100 80" className="w-24 h-24 drop-shadow-md">
                    <path d="M40 12 L15 65 L65 65 Z" fill="url(#samosaGrad)" stroke="#c2410c" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M40 12 Q42 35 48 65" stroke="#b45309" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M58 24 L42 67 L80 67 Z" fill="url(#samosaGradDark)" stroke="#9a3412" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
                    <path d="M35 6 Q33 1 35 -4" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" fill="none" className="animate-pulse" />
                    <path d="M43 4 Q41 -1 43 -6" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" fill="none" className="animate-pulse" />
                    <defs>
                      <linearGradient id="samosaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="samosaGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                    </defs>
                  </svg>
                )
              };
            } else if (kcal <= 130) {
              const iceCreamCount = parseFloat((kcal / 120).toFixed(2));
              return {
                title: "Total calories burned",
                value: `${kcal} kcal`,
                equivalent: `≈${iceCreamCount} Ice Cream`,
                desc: "Metabolizes the energy equivalent of a sweet frozen ice cream waffle scoop.",
                colorClass: "from-pink-600/10 to-rose-500/5 border-pink-500/10",
                iconBg: "bg-pink-500/10 text-pink-400",
                illustration: (
                  <svg viewBox="0 0 80 100" className="w-20 h-24 drop-shadow-md">
                    <path d="M40 90 L20 45 L60 45 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M25 45 L45 90 M30 45 L42 75 M35 45 L40 55 M55 45 L35 90 M50 45 L38 75" stroke="#b45309" strokeWidth="1" opacity="0.4" />
                    <circle cx="40" cy="35" r="20" fill="url(#iceCreamGrad)" stroke="#be185d" strokeWidth="1.5" />
                    <path d="M32 40 C32 45 35 45 35 40 Z" fill="#f472b6" />
                    <defs>
                      <linearGradient id="iceCreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#db2777" />
                      </linearGradient>
                    </defs>
                  </svg>
                )
              };
            } else if (kcal <= 350) {
              const burgerCount = parseFloat((kcal / 300).toFixed(2));
              return {
                title: "Total calories burned",
                value: `${kcal} kcal`,
                equivalent: `≈${burgerCount} Burger`,
                desc: "Burns off the energy loading of a fully stacked savory grilled cheese burger.",
                colorClass: "from-amber-600/10 to-yellow-500/5 border-yellow-500/10",
                iconBg: "bg-yellow-500/10 text-yellow-400",
                illustration: (
                  <svg viewBox="0 0 80 80" className="w-20 h-20 drop-shadow-md">
                    <path d="M15 65 C15 72 65 72 65 65 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <rect x="12" y="52" width="56" height="8" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                    <path d="M14 52 L66 52 L62 57 L45 57 L41 52 Z" fill="#fbbf24" />
                    <rect x="16" y="47" width="48" height="5" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                    <path d="M14 47 Q24 45 34 47 Q44 45 54 47 Q64 45 66 47" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M15 42 C15 15 65 15 65 42 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                    <circle cx="30" cy="28" r="1" fill="#fef3c7" />
                    <circle cx="40" cy="24" r="1" fill="#fef3c7" />
                    <circle cx="50" cy="30" r="1" fill="#fef3c7" />
                  </svg>
                )
              };
            } else {
              const pizzaCount = parseFloat((kcal / 225).toFixed(2));
              return {
                title: "Total calories burned",
                value: `${kcal} kcal`,
                equivalent: `≈${pizzaCount} Pizza Slices`,
                desc: "Neutralizes the heavy caloric loading of baked pepperoni pizza slices.",
                colorClass: "from-red-600/10 to-orange-500/5 border-red-500/10",
                iconBg: "bg-red-500/10 text-red-400",
                illustration: (
                  <svg viewBox="0 0 80 80" className="w-20 h-20 drop-shadow-md">
                    <path d="M40 75 L15 20 L65 20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M11 20 C25 15 55 15 69 20 L65 24 C55 19 25 19 15 24 Z" fill="#d97706" />
                    <path d="M40 70 L20 25 L60 25 Z" fill="#fef08a" />
                    <circle cx="35" cy="35" r="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                    <circle cx="48" cy="45" r="4.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                    <circle cx="38" cy="55" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  </svg>
                )
              };
            }
          };

          const getLandmarkEquivalentLocal = (km: number) => {
            if (km <= 1.99) {
              const pisaClimbs = parseFloat((km / 0.055).toFixed(2));
              return {
                title: "Total distance",
                value: `${km} km`,
                equivalent: `≈${pisaClimbs} Leaning Tower climbs`,
                colorClass: "from-blue-600/15 to-indigo-500/5 border-blue-500/10",
                iconBg: "bg-blue-500/10 text-blue-400",
                illustration: (
                  <div className="flex items-center justify-center py-2 h-28">
                    <svg viewBox="0 0 80 120" className="w-20 h-28 transform -rotate-6 drop-shadow-lg">
                      <rect x="20" y="105" width="40" height="8" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                      <rect x="23" y="15" width="34" height="12" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                      <rect x="24" y="27" width="32" height="13" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                      <rect x="25" y="40" width="30" height="13" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                      <rect x="26" y="53" width="28" height="13" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                      <rect x="27" y="66" width="26" height="13" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                      <rect x="28" y="79" width="24" height="13" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                      <rect x="29" y="92" width="22" height="13" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                      <line x1="28" y1="21" x2="52" y2="21" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="29" y1="33" x2="51" y2="33" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="30" y1="46" x2="50" y2="46" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="31" y1="59" x2="49" y2="59" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="32" y1="72" x2="48" y2="72" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="33" y1="85" x2="47" y2="85" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <line x1="34" y1="98" x2="46" y2="98" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M30 15 Q40 5 50 15 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                      <line x1="40" y1="5" x2="40" y2="1" stroke="#ef4444" strokeWidth="1.5" />
                    </svg>
                  </div>
                )
              };
            } else if (km <= 3.99) {
              const charminarClimbs = parseFloat((km / 1.5).toFixed(2));
              return {
                title: "Total distance",
                value: `${km} km`,
                equivalent: `≈${charminarClimbs} Charminar climbs`,
                colorClass: "from-sky-600/15 to-blue-500/5 border-blue-400/10",
                iconBg: "bg-blue-500/10 text-blue-400",
                illustration: (
                  <div className="flex items-center justify-center py-2 h-28">
                    <svg viewBox="0 0 100 120" className="w-20 h-26 drop-shadow-lg">
                      <rect x="25" y="55" width="50" height="45" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                      <path d="M38 100 C38 75 62 75 62 100 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                      <rect x="22" y="50" width="56" height="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                      <path d="M42 50 Q50 38 58 50 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                      <rect x="18" y="20" width="8" height="80" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                      <rect x="74" y="20" width="8" height="80" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                      <path d="M18 20 Q22 10 26 20 Z" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                      <path d="M74 20 Q78 10 82 20 Z" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
                    </svg>
                  </div>
                )
              };
            } else if (km <= 7.99) {
              const eiffelClimbs = parseFloat((km / 5.0).toFixed(2));
              return {
                title: "Total distance",
                value: `${km} km`,
                equivalent: `≈${eiffelClimbs} Eiffel Tower climb`,
                colorClass: "from-cyan-600/15 to-teal-500/5 border-teal-500/10",
                iconBg: "bg-teal-500/10 text-cyan-400",
                illustration: (
                  <div className="flex items-center justify-center py-2 h-28">
                    <svg viewBox="0 0 80 120" className="w-20 h-28 drop-shadow-md">
                      <path d="M22 110 Q40 95 58 110 L50 85 L30 85 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                      <rect x="26" y="80" width="28" height="5" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                      <path d="M31 80 L35 45 L45 45 L49 80 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                      <rect x="33" y="42" width="14" height="4" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                      <path d="M36 42 L39 12 Q40 5 41 12 L44 42 Z" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
                      <line x1="40" y1="5" x2="40" y2="1" stroke="#ef4444" strokeWidth="1.5" />
                    </svg>
                  </div>
                )
              };
            } else {
              const everestProportions = parseFloat((km / 8.848).toFixed(2));
              return {
                title: "Total distance",
                value: `${km} km`,
                equivalent: `≈${everestProportions} of Mount Everest`,
                colorClass: "from-indigo-600/15 to-purple-500/5 border-indigo-500/10",
                iconBg: "bg-indigo-500/10 text-indigo-400",
                illustration: (
                  <div className="flex items-center justify-center py-2 h-28">
                    <svg viewBox="0 0 100 100" className="w-22 h-24 drop-shadow-lg">
                      <path d="M15 85 L50 15 L85 85 Z" fill="url(#everestGrad)" stroke="#1e293b" strokeWidth="1.5" />
                      <path d="M38 40 L50 15 L62 40 L55 35 L50 42 L45 35 Z" fill="#ffffff" />
                      <path d="M50 15 L50 85" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
                      <defs>
                        <linearGradient id="everestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#475569" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )
              };
            }
          };

          const activeFoodInfo = getFoodEquivalentLocal(activeData.calories);
          const activeLandmarkInfo = getLandmarkEquivalentLocal(activeData.distance);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 sm:p-8 rounded-[36px] max-w-4xl w-full text-left relative space-y-6 shadow-2xl max-h-[95vh] overflow-y-auto"
              >
                {/* Header Row */}
                <div className="flex justify-between items-center border-b border-slate-950 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded border border-emerald-500/10">
                        PREVIEW FUTURE TRACKER
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black font-sans text-white tracking-tight">Active Interactive Roadmap</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowFuturePreviewModal(false)}
                    className="text-xs font-mono text-slate-400 hover:text-slate-100 uppercase tracking-wider cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Tab select bar */}
                <div className="flex gap-2 p-1.5 bg-slate-950 border border-slate-900 rounded-2xl">
                  <button
                    onClick={() => setPreviewTab('monthly')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-extrabold transition-all ${
                      previewTab === 'monthly'
                        ? 'bg-slate-900 text-emerald-400 shadow border border-slate-800'
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    📅 Monthly Records (Feed Timeline)
                  </button>
                  <button
                    onClick={() => setPreviewTab('daily')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      previewTab === 'daily'
                        ? 'bg-slate-900 text-emerald-400 shadow border border-slate-800'
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    ⚡ Dynamic Day Analysis (Gauge Detail)
                  </button>
                </div>

                {/* TAB CONTENT: MONTHLY RECORDS LIST (Screenshot 1) */}
                {previewTab === 'monthly' && (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                    
                    {/* Horizontal Months strip */}
                    <div className="flex items-center justify-between border-b border-slate-900/80 pb-3 font-mono text-xs text-slate-500 overflow-x-auto gap-4 scrollbar-none">
                      <span className="hover:text-slate-300 transition-all cursor-pointer">Dec</span>
                      <span className="hover:text-slate-300 transition-all cursor-pointer">Jan 2026</span>
                      <span className="hover:text-slate-300 transition-all cursor-pointer">Feb</span>
                      <span className="hover:text-slate-300 transition-all cursor-pointer">Mar</span>
                      <span className="hover:text-slate-300 transition-all cursor-pointer">Apr</span>
                      <span className="hover:text-slate-300 transition-all cursor-pointer">May</span>
                      <span className="text-white font-extrabold border-b-2 border-emerald-400 pb-1.5 px-3 uppercase text-xs tracking-wider">Jun 2026</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500">6/2026 RECORDS</div>

                    {/* Timeline Feed items */}
                    <div className="space-y-4">
                      {previewDaysData.map((d) => {
                        const isActive = activePreviewDay === d.day;
                        return (
                          <div
                            key={d.day}
                            onClick={() => {
                              setActivePreviewDay(d.day);
                              setPreviewTab('daily');
                            }}
                            className={`p-.5 rounded-3xl transition-all border text-left cursor-pointer group relative overflow-hidden ${
                              isActive 
                                ? 'bg-gradient-to-r from-slate-900 to-slate-950 border-emerald-400/40 shadow-emerald-950/20 shadow-lg' 
                                : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="p-5 space-y-3">
                              
                              {/* Header Day */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="text-sm font-black font-sans text-white group-hover:text-emerald-400 transition-colors uppercase flex items-center gap-2">
                                    <span className="inline-block">🚶</span> {d.steps} <span className="text-xs text-slate-400 font-mono font-medium lowercase">steps</span>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-600 block">{d.day}th</span>
                              </div>

                              {/* Progress bar Slow vs Brisk */}
                              <div className="space-y-1">
                                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                                  <div 
                                    className="h-full bg-orange-400" 
                                    style={{ width: `${d.slowPct}%` }}
                                    title={`Slow walking: ${d.slowSteps} steps`}
                                  />
                                  <div 
                                    className="h-full bg-red-500" 
                                    style={{ width: `${d.briskPct}%` }}
                                    title={`Brisk walking: ${d.briskSteps} steps`}
                                  />
                                </div>
                                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                  <span>{d.slowSteps} · {d.slowPct}% <span className="text-slate-600">Slow walking</span></span>
                                  <span>{d.briskSteps} · {d.briskPct}% <span className="text-slate-600 font-medium">Brisk walking</span></span>
                                </div>
                              </div>

                              {/* Footer mini stats strip */}
                              <div className="flex justify-center items-center gap-12 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-950">
                                <span className="flex items-center gap-1 leading-none">
                                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> {d.distance} km
                                </span>
                                <span className="flex items-center gap-1 leading-none">
                                  <Flame className="w-3.5 h-3.5 text-orange-500" /> {d.calories} kcal
                                </span>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl text-center">
                      <p className="text-xs text-slate-500 leading-normal font-sans font-medium">
                        💡 Tapping any of the daily records above instantly sets context and redirects you to the detailed <span className="text-emerald-400 font-bold font-mono">Dynamic Day Analysis</span> view.
                      </p>
                    </div>

                  </div>
                )}

                {/* TAB CONTENT: DAILY ACTIVITY DETAIL ANALYSIS (Screenshot 2) */}
                {previewTab === 'daily' && (
                  <div className="space-y-6 max-h-[66vh] overflow-y-auto pr-1 text-center font-sans">
                    
                    {/* Date select breadcrumb or header */}
                    <div className="flex items-center justify-between border-b border-slate-900/80 pb-3">
                      <button 
                        onClick={() => setPreviewTab('monthly')}
                        className="text-xs font-mono text-emerald-400 hover:text-emerald-350 transition-colors uppercase font-extrabold flex items-center gap-1"
                      >
                        ← Back to Monthly Timeline
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                        Date: {activeData.dateText}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-mono tracking-wider font-extrabold uppercase text-slate-500">Today's walking record</div>
                    </div>

                    {/* TAB CONTENT: DAILY ACTIVITY DETAIL ANALYSIS (Screenshot 2) */}
                    {/* Modern Circular Step Progress Ring */}
                    <div className="relative max-w-sm mx-auto flex flex-col items-center py-8">
                      <div className="relative w-56 h-56 flex items-center justify-center">
                        {/* Background Pulsing Ambient Glow */}
                        <div className="absolute inset-4 rounded-full bg-emerald-500/[0.03] blur-2xl animate-pulse pointer-events-none" />
                        
                        {/* SVG Rings */}
                        <svg className="w-52 h-52 transform -rotate-90 select-none" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="60%" stopColor="#34d399" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                          
                          {/* Track Ring */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            stroke="#0f172a" 
                            strokeWidth="6.5" 
                            className="stroke-slate-900/80"
                            fill="transparent" 
                          />
                          
                          {/* Inner Border Accents for physical depth */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="39" 
                            stroke="#1e293b" 
                            strokeWidth="0.5" 
                            strokeDasharray="3 3"
                            fill="transparent" 
                            opacity="0.3"
                          />
                          
                          {/* Active Glowing Progress Ring */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            stroke="url(#ringGrad)" 
                            strokeWidth="7" 
                            strokeLinecap="round"
                            fill="transparent" 
                            initial={{ strokeDasharray: 2 * Math.PI * 42, strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ 
                              strokeDashoffset: (2 * Math.PI * 42) * (1 - Math.min(1, activeData.steps / 10000)) 
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>

                        {/* Middle Text Segment with Premium Typography */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-sans">
                          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest leading-none">STEPS WALKED</span>
                          <span className="text-4xl font-display font-black text-white tracking-tight mt-1.5 mb-0.5 leading-none">
                            {activeData.steps.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-400">
                            / 10,000 steps
                          </span>
                        </div>
                      </div>

                      {/* Goal progress clearly visible below as elegant premium chips */}
                      <div className="w-full flex justify-center items-center gap-3 mt-4">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/15 shadow-sm shadow-blue-950/25">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-400" /> {activeData.distance} km
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/15 shadow-sm shadow-orange-950/25">
                          <Flame className="w-3.5 h-3.5 shrink-0 text-orange-400" /> {activeData.calories} kcal
                        </span>
                      </div>
                    </div>

                    {/* Progress slider slow vs brisk */}
                    <div className="bg-slate-950/40 p-4 rounded-3xl border border-slate-900 max-w-lg mx-auto space-y-2 text-left">
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                        <div className="h-full bg-orange-400" style={{ width: `${activeData.slowPct}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${activeData.briskPct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-450 leading-none">
                        <span>{activeData.slowSteps} · {activeData.slowPct}% <span className="text-slate-500">Slow walking</span></span>
                        <span>{activeData.briskSteps} · {activeData.briskPct}% <span className="text-slate-500 font-medium">Brisk walking</span></span>
                      </div>
                    </div>

                    {/* FOOD EQUIVALENTS CARD (Yellow-Gold Gradient) & LANDMARK EQUIVALENTS CARD (Blue-Indigo gradient) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2 text-left">
                      
                      {/* Calories Food Equivalent Card */}
                      <div className={`p-6 rounded-3xl border bg-gradient-to-br flex items-center justify-between gap-5 transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-md ${activeFoodInfo.colorClass}`}>
                        {/* Background ambient circular blur for high depth feel */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
                        <div className="space-y-4 flex-1 relative z-10 font-sans">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider block text-orange-400/90 font-black leading-none">🔥 Calories Burned</span>
                            <div className="text-3xl font-display font-black text-white tracking-tight mt-1">{activeFoodInfo.value}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-black font-sans text-orange-300 capitalize">{activeFoodInfo.equivalent}</div>
                            <p className="text-[11px] text-slate-400 font-sans leading-relaxed font-semibold">
                              Enough energy to completely burn {activeFoodInfo.equivalent.replace('≈', '')}.
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 p-3 bg-slate-950/40 rounded-full border border-slate-900 shadow-xl relative z-10">
                          {activeFoodInfo.illustration}
                        </div>
                      </div>

                      {/* Distance Landmark Equivalent Card */}
                      <div className={`p-6 rounded-3xl border bg-gradient-to-br flex flex-col justify-between gap-5 transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-md ${activeLandmarkInfo.colorClass}`}>
                        {/* Background ambient circular blur for high depth feel */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
                        <div className="space-y-4 relative z-10 font-sans">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider block text-blue-400 font-black leading-none">🏛 Distance Equivalent</span>
                            <div className="text-3xl font-display font-black text-white tracking-tight mt-1">{activeData.distance} km</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-black font-sans text-blue-300">{activeLandmarkInfo.equivalent}</div>
                            <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-medium">
                              Your spatial movement translates to conquering {activeLandmarkInfo.equivalent.replace('≈', '')} sequentially.
                            </p>
                          </div>
                        </div>
                        <div className="self-end mt-2 p-2 bg-slate-950/45 rounded-2xl border border-slate-900/40 shadow-xl relative z-10">
                          {activeLandmarkInfo.illustration}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* Footer specs */}
                <div className="pt-4 border-t border-slate-950 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-[10.5px] font-mono text-slate-500 leading-relaxed">
                  <span>⚡ Calibrated through metabolic equivalents and standard geodesic elevations</span>
                  <span>Feature Sandbox Engine · Launch Target Q3</span>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* --- REVEAL / SCRATCH INTERACTIVE MODAL OVERLAY --- */}
      <AnimatePresence>
        {scratchModalOpen && futureSelfState?.isOnboarded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#090f1d] border border-amber-500/15 p-6 sm:p-8 rounded-[36px] max-w-lg w-full text-left relative space-y-6 shadow-2xl overflow-hidden"
              id="scratch-revealer-modal"
            >
              {/* Gold backglow */}
              <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none" />

              {(() => {
                const letters = futureSelfState.letters || [];
                const latestLetter = letters[letters.length - 1];
                if (!latestLetter) return null;

                const letterThemeColor = onboardingAnswers.favoriteColor || "#f59e0b";

                return (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3 relative z-10">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest font-black text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 uppercase block">
                          RECOVERED MEMORY
                        </span>
                        <h4 className="text-base font-black font-sans text-amber-100 tracking-tight pt-1">Transmission Fragment</h4>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setScratchModalOpen(false)}
                        className="text-slate-500 hover:text-amber-400 transition-colors bg-slate-900/80 p-2 rounded-xl border border-slate-850 cursor-pointer text-xs w-8 h-8 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>

                    {!scratchDone && !latestLetter.isRevealed ? (
                      <div className="space-y-5 text-center relative z-10">
                        <div className="bg-amber-500/[0.02] border border-amber-500/10 p-4 rounded-2xl text-left">
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                            Erase the temporal static shield on the card below with your finger or pointer to declassify and reveal this private letter from {futureYear}.
                          </p>
                        </div>
                        
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-500/10">
                          <ScratchCard 
                            onComplete={() => handleRevealScratchCard(latestLetter.dayIndex)}
                            coverColor="#000000"
                          >
                            <div className="p-5 md:p-6 space-y-4 bg-gradient-to-br from-amber-500/[0.06] via-amber-600/[0.02] to-transparent min-h-[180px] flex flex-col justify-between">
                              <div className="flex items-center justify-between border-b border-amber-500/10 pb-3">
                                <span className="font-mono text-amber-500 text-[10px] font-bold tracking-widest uppercase">TRANSMISSION #00{latestLetter.dayIndex}</span>
                                <span className="text-[10px] font-mono text-slate-500">{futureYear} SECURE</span>
                              </div>
                              <p className="text-[12.5px] text-amber-100/95 font-serif italic whitespace-pre-wrap leading-relaxed select-none py-1.5">
                                "{latestLetter.message}"
                              </p>
                              <div className="text-[9px] font-mono text-amber-500/50 mt-1">— Future You</div>
                            </div>
                          </ScratchCard>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-amber-500/[0.04] via-amber-600/[0.01] to-slate-950 p-6 rounded-2xl border border-amber-500/10 text-left relative shadow-2xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-500/5 border border-amber-500/15 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-mono font-black uppercase text-amber-500 tracking-wider">
                            TRANSMISSION #00{latestLetter.dayIndex}
                          </span>
                          <span className="text-[9px] font-mono text-slate-550">SAVED TO HISTORY</span>
                        </div>
                        
                        <p className="text-amber-100/90 text-[12.5px] sm:text-sm leading-relaxed whitespace-pre-wrap font-serif italic select-text p-4 bg-[#111624] border border-amber-500/10 rounded-2xl">
                          "{latestLetter.message}"
                        </p>

                        <div className="pt-4 border-t border-slate-900 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setScratchModalOpen(false);
                            }}
                            className="border border-amber-500/20 hover:border-amber-400 text-amber-400 hover:text-amber-300 font-mono text-[10px] font-bold py-2.5 px-5 rounded-xl uppercase tracking-widest shadow-lg hover:bg-amber-500/5 transition-all duration-200 cursor-pointer"
                          >
                            Close and Log to Archive
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- INLINE LETTER DETAILS DIALOG/MODAL --- */}
      <AnimatePresence>
        {viewingLetterDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#090f1d] border border-amber-500/15 p-6 sm:p-8 rounded-[36px] max-w-2xl w-full text-left relative space-y-6 shadow-2xl"
              id="archive-details-modal"
            >
              {/* Gold backglow */}
              <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none" />

              <div className="flex justify-between items-center border-b border-slate-900 pb-4 relative z-10">
                <span className="bg-amber-500/5 border border-amber-500/15 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-wider font-extrabold uppercase text-amber-500">
                  ARCHIVED TRANSMISSION #00{viewingLetterDetails.dayIndex}
                </span>
                <button 
                  type="button"
                  onClick={() => setViewingLetterDetails(null)}
                  className="text-[10px] font-mono text-slate-400 hover:text-amber-400 uppercase tracking-widest cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition-all"
                  id="btn-close-archive"
                >
                  Close Note
                </button>
              </div>

              <div className="text-amber-105 text-xs sm:text-sm font-serif italic leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto tracking-wide pr-2 p-5 bg-gradient-to-br from-amber-500/[0.05] via-amber-600/[0.01] to-slate-950 border border-amber-500/10 rounded-2xl relative z-10 select-text">
                "{viewingLetterDetails.message}"
              </div>

              <div className="pt-4 border-t border-slate-900/80 flex justify-between items-center text-[9px] font-mono text-slate-500 relative z-10">
                <span>Logbook Entry Lock: Synchronized</span>
                <span>Recovered: {new Date(viewingLetterDetails.notifiedAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
