import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Footprints, 
  Apple, 
  User, 
  ArrowRight, 
  Activity, 
  Flame, 
  TrendingUp, 
  Scale, 
  ChevronRight,
  Sparkles,
  Search,
  Compass,
  Award,
  Lock,
  CheckCircle,
  Clock,
  Heart,
  Droplet,
  Coffee,
  Bed
} from 'lucide-react';
import { UserProfile } from '../types';
import HealthMateMascot from './HealthMateMascot';
import { triggerCompanion, triggerCompanionQuote } from '../utils/companion';

interface HomeTabProps {
  steps: number;
  stepGoal: number;
  sensorActive: boolean;
  bmiClassification: string;
  setActiveTab: (tab: 'home' | 'food' | 'steps' | 'future' | 'profile') => void;
  authUser: any;
  profile: UserProfile;
}

export default function HomeTab({
  steps,
  stepGoal,
  sensorActive,
  bmiClassification,
  setActiveTab,
  authUser,
  profile
}: HomeTabProps) {

  // Live BMI calculation (8-level scale ready)
  const calculatedBmi = useMemo(() => {
    if (!profile.height || !profile.weight) return 0;
    return Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10;
  }, [profile]);

  // Modern 8-Level BMI Classifications matching system parity
  const bmiDetails = useMemo(() => {
    const bmi = calculatedBmi;
    if (bmi < 16) {
      return { text: 'Critical Zone', emoji: '🔴', color: 'text-rose-500', border: 'border-rose-500/30', bg: 'bg-rose-500/10', desc: 'Level 1 • Critical Zone (BMI < 16) • Focus on eating nutritious foods.' };
    }
    if (bmi >= 16 && bmi < 18.5) {
      return { text: 'Recovery Zone', emoji: '🟠', color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', desc: 'Level 2 • Recovery Zone (BMI 16 - 18.4) • Focus on energy and building strength.' };
    }
    if (bmi >= 18.5 && bmi < 20) {
      return { text: 'Beginner Fit', emoji: '🟡', color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/10', desc: 'Level 3 • Beginner Fit (BMI 18.5 - 20) • Building positive daily habits.' };
    }
    if (bmi >= 20 && bmi < 23) {
      return { text: 'Fit', emoji: '🟢', color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', desc: 'Level 4 • Fit (BMI 20 - 22.9) • Excellent healthy balance.' };
    }
    if (bmi >= 23 && bmi < 25) {
      return { text: 'Strong Fit', emoji: '💪', color: 'text-teal-400', border: 'border-teal-400/30', bg: 'bg-teal-500/10', desc: 'Level 5 • Strong Fit (BMI 23 - 24.9) • Superb physical strength!' };
    }
    if (bmi >= 25 && bmi < 27.5) {
      return { text: 'Fitness Warning', emoji: '🟡', color: 'text-yellow-500', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', desc: 'Level 6 • Fitness Warning (BMI 25 - 27.4) • Balanced active steps recommended.' };
    }
    if (bmi >= 27.5 && bmi < 30) {
      return { text: 'High Risk Fit', emoji: '🟠', color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', desc: 'Level 7 • High Risk Fit (BMI 27.5 - 29.9) • Simple lifestyle habits can help.' };
    }
    return { text: 'Critical Risk', emoji: '🔴', color: 'text-rose-600', border: 'border-rose-600/30', bg: 'bg-rose-600/10', desc: 'Level 8 • Critical Risk (BMI 30+) • Positive health adjustments supported.' };
  }, [calculatedBmi]);

  // Dynamic Future Health Status projection based on physical telemetry
  const projectedFutureStatus = useMemo(() => {
    const bmi = calculatedBmi;
    if (bmi >= 20 && bmi < 25) {
      return {
        text: "Peak Fitness Baseline Maintained! 👑",
        sub: "Maintain current physical balance with consistent daily hydration & calories balance."
      };
    }
    if (bmi >= 25) {
      return {
        text: "Lean Composition Achieved! ⚡",
        sub: "Projected calorie balance achieved in 1 Yr with structured diet and daily missions."
      };
    }
    return {
      text: "Normal Zone Baseline Achieved! 🌱",
      sub: "Projected healthy muscle density baseline achieved in 1 Yr with steady clean nutrition."
    };
  }, [calculatedBmi]);

  // Interactive Daily Health Mission States
  const [missionWater, setMissionWater] = useState<boolean>(() => localStorage.getItem('healthmate_mission_water') === 'true');
  const [missionCalories, setMissionCalories] = useState<boolean>(() => localStorage.getItem('healthmate_mission_calories') === 'true');
  const [missionSleep, setMissionSleep] = useState<boolean>(() => localStorage.getItem('healthmate_mission_sleep') === 'true');

  const completedMissionsCount = useMemo(() => {
    return (missionWater ? 1 : 0) + (missionCalories ? 1 : 0) + (missionSleep ? 1 : 0);
  }, [missionWater, missionCalories, missionSleep]);

  const toggleMission = (type: 'water' | 'calories' | 'sleep') => {
    let newVal = false;
    if (type === 'water') {
      newVal = !missionWater;
      setMissionWater(newVal);
      localStorage.setItem('healthmate_mission_water', String(newVal));
      if (newVal) {
        triggerCompanion("Your body will thank you. That was worth logging! 💧", "excited");
      } else {
        triggerCompanionQuote('water', 'thoughtful');
      }
    } else if (type === 'calories') {
      newVal = !missionCalories;
      setMissionCalories(newVal);
      localStorage.setItem('healthmate_mission_calories', String(newVal));
      if (newVal) {
        triggerCompanion("Nice work on staying active today!", "excited");
      } else {
        triggerCompanionQuote('home', 'calm');
      }
    } else if (type === 'sleep') {
      newVal = !missionSleep;
      setMissionSleep(newVal);
      localStorage.setItem('healthmate_mission_sleep', String(newVal));
      if (newVal) {
        triggerCompanion("Restorative sleep is wonderful for your mind.", "calm");
      } else {
        triggerCompanionQuote('home', 'calm');
      }
    }

    // Play visual feedback chime sound to represent dynamic interaction
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}

    // Dispatch global custom event for lockstep synchronization with other views
    window.dispatchEvent(new Event('healthmate_mission_sync'));
  };

  // Sync state if localStorage changes externally
  useEffect(() => {
    const handleSync = () => {
      setMissionWater(localStorage.getItem('healthmate_mission_water') === 'true');
      setMissionCalories(localStorage.getItem('healthmate_mission_calories') === 'true');
      setMissionSleep(localStorage.getItem('healthmate_mission_sleep') === 'true');
    };
    window.addEventListener('healthmate_mission_sync', handleSync);
    return () => window.removeEventListener('healthmate_mission_sync', handleSync);
  }, []);

  // Dynamic Unified Health Score Formula aligned with ProfileTab
  const healthScore = useMemo(() => {
    let score = 55;
    const bmi = calculatedBmi;
    if (bmi >= 23 && bmi < 25) score += 30; // Optimal Healthy
    else if (bmi >= 20 && bmi < 23) score += 25; // Healthy
    else if ((bmi >= 18.5 && bmi < 20) || (bmi >= 25 && bmi < 27.5)) score += 15; // Near Healthy / Overweight Risk
    else if ((bmi >= 16 && bmi < 18.5) || (bmi >= 27.5 && bmi < 30)) score += 8; // Underweight / Obesity Risk
    else score += 3; // Severe Underweight / Obese

    score += completedMissionsCount * 5;
    return Math.min(100, score);
  }, [calculatedBmi, completedMissionsCount]);

  // Medal Ranking aligned with ProfileTab
  const currentRank = useMemo(() => {
    if (healthScore < 65) return 'Silver';
    if (healthScore >= 65 && healthScore < 80) return 'Gold';
    return 'Diamond';
  }, [healthScore]);

  const rankProgress = useMemo(() => {
    if (currentRank === 'Silver') {
      return {
        next: 'Gold 🥇',
        percent: Math.round((healthScore / 65) * 100),
        goalText: 'Reach a Health Score of 65% to upgrade.'
      };
    } else if (currentRank === 'Gold') {
      return {
        next: 'Diamond 💎',
        percent: Math.round(((healthScore - 65) / (80 - 65)) * 100),
        goalText: 'Reach a Health Score of 80% to upgrade.'
      };
    } else {
      return {
        next: 'Max Level 👑',
        percent: 100,
        goalText: 'Maximum possible ranking achieved!'
      };
    }
  }, [currentRank, healthScore]);

  // Mascot Custom Quotes triggered dynamically by the user's actual BMI and health values
  const getMascotQuotesByBmi = (bmiValue: number) => {
    if (bmiValue < 16) {
      return [
        "Let's focus on building strength and energy. Food is fuel! 🍲",
        "Hi! Sending you strength! Let's work on gentle nourishment today. 💪",
        "Your health is a beautiful path! Let's build up our strength and energy together. ❤️",
        "Every bit of gentle hydration makes me happy! Let's cherish our body. 🌿"
      ];
    }
    if (bmiValue >= 16 && bmiValue < 18.5) {
      return [
        "Let's focus on building strength and energy. 🍳",
        "Nourishing our body with dense proteins makes us both feel amazing! ✨",
        "Ready to power up? A delicious warm health meal is exactly what we need!",
        "Every small wellness choice builds strong vitality. You are doing great! 👏"
      ];
    }
    if (bmiValue >= 18.5 && bmiValue < 20) {
      return [
        "We are so close to the optimal zone! Keep moving and sleeping well! 🌟",
        "Fantastic momentum! Your physical parameters are showing great progress.",
        "Your consistency is shining! Let's complete our water goal together! 💧",
        "Every small habit forms a majestic shield for your future health. 🛡️"
      ];
    }
    if (bmiValue >= 20 && bmiValue < 23) {
      return [
        "You're doing great 👏",
        "You are in a great healthy rhythm! Keep up this incredible daily consistency. 🌱",
        "Looking absolutely fantastic today. Let's conquer all our daily missions! 🏆",
        "Perfect pacing! Let's take a nice deep breath of clean air."
      ];
    }
    if (bmiValue >= 23 && bmiValue < 25) {
      return [
        "Outstanding peak health status! You're performing at your absolute best 👏✨",
        "This is the golden zone of health! Proud of your ultimate daily focus. 💎",
        "Your fitness and daily moves are running with total precision today!",
        "Perfect healthy balance! Let's celebrate by keeping our sleep score high. 😴"
      ];
    }
    if (bmiValue >= 25 && bmiValue < 27.5) {
      return [
        "Small changes today can create a healthier future.",
        "Let's choose fiber-rich clean alternatives and enjoy our walking goals! 🚶",
        "A healthy path is created choice by choice. Let's aim to sleep 8 hours tonight!",
        "You are worthy of amazing energy. Let's focus on fresh, clean meals!"
      ];
    }
    if (bmiValue >= 27.5 && bmiValue < 30) {
      return [
        "Small changes today can create a healthier future.",
        "Tracking our health makes each choice intentional. I'm cheering for you! 🌟",
        "Gentle, consistent movement is a magical tonic for our circulation.",
        "Let's hydrate our body with cold pure water! Your cells will thank you. 💧"
      ];
    }
    return [
      "Small changes today can create a healthier future. Focus on gentle pacer habits. ❤️",
      "Every single choice you make builds a legacy of strength. Let's do this!",
      "I'm super proud of your efforts! Let's stay within our caloric parameters. 🥗",
      "Let's drink some crisp water together! Minor milestones create major wellness."
    ];
  };

  // Companion Walkway & Playground States
  const [positionX, setPositionX] = useState<number>(35);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thoughtful' | 'active' | 'calm' | 'excited' | 'speaking' | 'walking'>('happy');
  const [dialogBubble, setDialogBubble] = useState<string>(() => {
    const quotes = getMascotQuotesByBmi(calculatedBmi);
    return quotes[0] || "We're on a healthy track together! 🌿";
  });
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Auto behavior cycle pulling dynamic BMI quotes to prevent generic iterations
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runBehaviorCycle = () => {
      const r = Math.random();
      const currentQuotes = getMascotQuotesByBmi(calculatedBmi);

      if (r < 0.35) {
        // Move to a new visual coordinate
        const nextX = Math.floor(Math.random() * 55) + 20; 
        setDirection(nextX > positionX ? 'right' : 'left');
        setMascotMood('walking');
        setPositionX(nextX);

        timer = setTimeout(() => {
          setMascotMood('calm');
          setDialogBubble(currentQuotes[Math.floor(Math.random() * currentQuotes.length)]);
        }, 1200);

      } else if (r < 0.70) {
        setMascotMood('thoughtful');
        setDialogBubble(currentQuotes[Math.floor(Math.random() * currentQuotes.length)]);
      } else {
        setMascotMood('speaking');
        setDialogBubble(currentQuotes[Math.floor(Math.random() * currentQuotes.length)]);
      }

      timer = setTimeout(runBehaviorCycle, 7000); // Friendly longer interval
    };

    timer = setTimeout(runBehaviorCycle, 4000);
    return () => clearTimeout(timer);
  }, [calculatedBmi, positionX]);

  const handleMascotPoke = () => {
    setIsJumping(true);
    setMascotMood('excited');
    
    const currentQuotes = getMascotQuotesByBmi(calculatedBmi);
    const pokeReplies = [
      "Hehehe! That tickles! 😄 Let's stay active!",
      "Boing! I love our wellness journey together! 🍀",
      currentQuotes[Math.floor(Math.random() * currentQuotes.length)]
    ];
    setDialogBubble(pokeReplies[Math.floor(Math.random() * pokeReplies.length)]);

    setTimeout(() => {
      setIsJumping(false);
      setMascotMood('calm');
    }, 1200);
  };

  // Hide the incomplete Smart Pedometer widgets as requested.
  // Set showWalkingTracker to false to satisfy the hiding rule, preserving the components structure below.
  const showWalkingTracker = false;

  return (
    <div className="space-y-6 pb-6 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/10 p-5 rounded-2xl border border-slate-850/50">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Companion dashboard
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight leading-none mt-2 text-left">
            Hi, {authUser?.name || 'Friend'} 👋
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1 text-left">
            Let's check your target zones and complete today's health mission.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-xs text-slate-300 rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Update Weight</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: PREMIUM HEALTH SNAPSHOT + DAILY MISSIONS */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* 🧬 HEALTH SNAPSHOT CARD */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[28px] relative overflow-hidden backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-between">
            {/* Top right gradient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/[0.03] filter blur-2xl rounded-full pointer-events-none" />
            
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="space-y-0.5 text-left">
                  <span className="text-[10px] font-mono font-black tracking-widest text-emerald-400 uppercase block">CLINICAL METRICS</span>
                  <h2 className="font-display text-base font-bold text-slate-100 flex items-center gap-2">
                    🧬 Health Snapshot
                  </h2>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Snapshot Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. BMI Value Card */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-2xl text-left relative overflow-hidden">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">BMI Value</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-mono font-black text-white">{calculatedBmi}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Index</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-1.5 truncate">
                    {bmiDetails.desc}
                  </p>
                </div>

                {/* 2. Health Zone Card */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-2xl text-left">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Current Health Zone</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl">{bmiDetails.emoji}</span>
                    <span className={`text-base font-black font-display ${bmiDetails.color}`}>
                      {bmiDetails.text}
                    </span>
                  </div>
                  {/* Miniature 8-Level visual scale strip */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full flex overflow-hidden mt-3 gap-[1px]">
                    <div className={`flex-1 ${calculatedBmi < 16 ? 'bg-rose-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 16 && calculatedBmi < 18.5 ? 'bg-orange-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 18.5 && calculatedBmi < 20 ? 'bg-yellow-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 20 && calculatedBmi < 23 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 23 && calculatedBmi < 25 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 25 && calculatedBmi < 27.5 ? 'bg-yellow-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 27.5 && calculatedBmi < 30 ? 'bg-orange-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 ${calculatedBmi >= 30 ? 'bg-rose-600' : 'bg-slate-800'}`} />
                  </div>
                </div>

                {/* 3. Unified Health Score */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-2xl text-left">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Health Score</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-mono font-black text-amber-400">{healthScore}</span>
                      <span className="text-xs font-mono text-slate-500">/ 100</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold">
                      {healthScore >= 80 ? 'EXCELLENT' : healthScore >= 65 ? 'GOOD' : 'FAIR'}
                    </span>
                  </div>
                  {/* Unified Progress line */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-3.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>

                {/* 4. Current Rank Medal Status */}
                <div className="bg-slate-950/50 border border-slate-850 p-4.5 rounded-2xl text-left flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Medal Rank</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-2xl">
                        {currentRank === 'Silver' ? '🥈' : currentRank === 'Gold' ? '🥇' : '💎'}
                      </span>
                      <span className="text-base font-black font-display text-slate-200">
                        {currentRank} Rank
                      </span>
                    </div>
                  </div>
                  <span className="text-[9.5px] text-slate-400 block mt-2">
                    Next: {rankProgress.next} ({rankProgress.percent}%)
                  </span>
                </div>

              </div>

              {/* 5. Interactive Future Health Status Card */}
              <div 
                onClick={() => setActiveTab('future')}
                className="bg-slate-950/65 border border-emerald-500/15 hover:border-emerald-500/35 p-4 rounded-2xl text-left cursor-pointer group transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden mt-2"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] filter blur-xl rounded-full pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block tracking-widest">Future Health Projection</span>
                    <h4 className="text-xs font-black text-slate-100 group-hover:text-[#10b981] transition-colors leading-tight mt-0.5">
                      {projectedFutureStatus.text}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans max-w-sm sm:max-w-md">
                      {projectedFutureStatus.sub}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-amber-400 font-extrabold self-end sm:self-auto group-hover:text-amber-300">
                  <span>Projections 🔮</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-all group-hover:translate-x-0.5" />
                </div>
              </div>

            </div>

            {/* Rank Progression Bar inside Health Snapshot */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/60 mt-4 text-left">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400">Progression to {rankProgress.next}</span>
                <span className="text-emerald-400 font-black">{rankProgress.percent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, rankProgress.percent)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                {rankProgress.goalText}
              </p>
            </div>

          </div>

          {/* 🎯 TODAY'S MISSION CARD */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[28px] relative overflow-hidden backdrop-blur-md shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-black tracking-widest text-[#10b981] uppercase block">PREVENTATIVE HABITS</span>
                <h2 className="font-display text-base font-bold text-slate-100 flex items-center gap-2">
                  🎯 Today's Mission
                </h2>
              </div>
              <span className="text-xs font-mono font-black text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/10 px-3 py-1 rounded-full">
                {completedMissionsCount} / 3 COMPLETED
              </span>
            </div>

            {/* Missions List */}
            <div className="space-y-2.5">
              
              {/* Mission 1: Water */}
              <div 
                onClick={() => toggleMission('water')}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  missionWater 
                    ? 'bg-emerald-550/10 border-emerald-550/30 text-emerald-400' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-350'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${missionWater ? 'bg-emerald-500/20' : 'bg-slate-900'}`}>
                    <Droplet className={`w-4 h-4 ${missionWater ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-100">Drink 2.5L Water</h4>
                    <p className="text-[10px] text-slate-400">Maintains structural cell volume and focus</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  missionWater ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-transparent'
                }`}>
                  {missionWater && <CheckCircle className="w-3.5 h-3.5 text-slate-950 stroke-[3px]" />}
                </div>
              </div>

              {/* Mission 2: Calories */}
              <div 
                onClick={() => toggleMission('calories')}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  missionCalories 
                    ? 'bg-emerald-550/10 border-emerald-550/30 text-emerald-400' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-350'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${missionCalories ? 'bg-emerald-500/20' : 'bg-slate-900'}`}>
                    <Coffee className={`w-4 h-4 ${missionCalories ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-100">Stay Below 2200 Calories</h4>
                    <p className="text-[10px] text-slate-400">Perfect daily energy and calorie balance</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  missionCalories ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-transparent'
                }`}>
                  {missionCalories && <CheckCircle className="w-3.5 h-3.5 text-slate-950 stroke-[3px]" />}
                </div>
              </div>

              {/* Mission 3: Sleep */}
              <div 
                onClick={() => toggleMission('sleep')}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  missionSleep 
                    ? 'bg-emerald-550/10 border-emerald-550/30 text-emerald-400' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-350'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${missionSleep ? 'bg-emerald-500/20' : 'bg-slate-900'}`}>
                    <Bed className={`w-4 h-4 ${missionSleep ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-100">Sleep 8 Hours</h4>
                    <p className="text-[10px] text-slate-400">Crucial for cardiovascular recovery and repair</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  missionSleep ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-transparent'
                }`}>
                  {missionSleep && <CheckCircle className="w-3.5 h-3.5 text-slate-950 stroke-[3px]" />}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE MASCOT WITH GRASSY ISLAND + FAST ACTION SHORTCUTS */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* CHARMING GRASSY ISLAND ARENA CARD */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[28px] relative overflow-hidden backdrop-blur-md shadow-2xl flex-1 flex flex-col items-center justify-center py-8">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.012] via-transparent to-transparent pointer-events-none" />
            
            {/* The Landscape Grassy Island Arena */}
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[300px] flex items-center justify-center rounded-full mt-2">
              
              {/* Star sparkles and light particle overlays mapping to mockup aesthetic */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <motion.div 
                  className="absolute top-4 left-1/4 text-emerald-400 animate-pulse text-xs"
                  animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✦
                </motion.div>
                <motion.div 
                  className="absolute top-1/3 right-4 text-emerald-300 animate-pulse text-[15px]"
                  animate={{ y: [0, 8, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  ✨
                </motion.div>
                <div className="absolute bottom-8 left-6 text-emerald-400 opacity-60 text-lg animate-bounce">
                  🍀
                </div>
              </div>

              {/* Island Spotlight Backlight Ring */}
              <div className="absolute inset-4 rounded-full bg-radial-gradient from-emerald-500/15 via-emerald-600/5 to-transparent blur-xl pointer-events-none" />

              {/* Grassy Pedestal Island styled exactly matching reference shots */}
              <div className="absolute bottom-1 w-64 h-24 bg-gradient-to-b from-[#2E8B57] to-[#124e2b] rounded-full filter border-t border-emerald-400/40 shadow-2xl flex flex-col items-center justify-start overflow-hidden">
                <div className="w-full h-5 bg-[#3CB371] opacity-70 filter blur-[2px] rounded-full border-t border-emerald-300" />
                <div className="w-full h-full bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 flex flex-wrap gap-2.5 p-1 select-none pointer-events-none opacity-40">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-4 bg-[#3CB371] rounded-full transform rotate-12" />
                  ))}
                </div>
              </div>

              {/* The interactive companion 3-dimensional element */}
              <motion.div
                onClick={handleMascotPoke}
                className="absolute bottom-12 z-25 cursor-pointer flex flex-col items-center justify-end select-none active:scale-95 transition-transform"
                animate={{ 
                  y: isJumping ? -35 : 0,
                  scale: isJumping ? [1, 1.08, 0.96, 1] : 1
                }}
                transition={{ 
                  y: { type: "spring", stiffness: 350, damping: 10 },
                  scale: { duration: 0.6 }
                }}
                whileHover={{ scale: 1.04 }}
              >
                {/* 3D Mascot renderer */}
                <HealthMateMascot size="xxl" expression={mascotMood} animate={true} />
                
                {/* Drop shadow on green surface */}
                <div className="w-16 h-1 bg-black/40 rounded-full blur-[2px] mt-1 shrink-0" />
              </motion.div>

            </div>

            <div className="text-center mt-3 select-none max-w-[280px]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#10b981] block">Active Mascot</span>
              <h3 className="text-xs font-bold text-slate-350 mt-1">
                {(() => {
                  const rawName = localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
                  const trimmed = rawName.trim();
                  if (!trimmed || trimmed === 'HealthMate') {
                    return 'HealthMate 🌱';
                  }
                  return `${trimmed} the HealthMate 🌱`;
                })()} • Click on me!
              </h3>
              
              {/* Dialogue speech bubble */}
              <AnimatePresence mode="wait">
                {dialogBubble && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-3 bg-slate-950/90 border border-emerald-500/20 px-4 py-2.5 rounded-2xl text-center text-[10.5px] font-sans font-medium leading-relaxed text-emerald-300 shadow-xl"
                  >
                    "{dialogBubble}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ACTIVE CONTROLS SHORTCUT NAVIGATION GRID */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[28px] space-y-3 flex flex-col text-left">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase block px-1">
              Active Controls & Shortcuts
            </span>

            {/* Shortcut 1: Food Analytics */}
            <div 
              onClick={() => setActiveTab('food')}
              className="bg-slate-950/60 border border-slate-850 p-3 rounded-2xl hover:border-emerald-500/30 cursor-pointer group transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight">Food Analytics</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Access search, index & suggestions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-0.5" />
            </div>

            {/* Shortcut 2: Goal Tracker */}
            <div 
              onClick={() => setActiveTab('steps')}
              className="bg-slate-950/60 border border-slate-850 p-3 rounded-2xl hover:border-emerald-500/30 cursor-pointer group transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-200 group-hover:text-teal-400 transition-colors leading-tight">Goal Tracker</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-none font-sans">View historical paces & logs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-all group-hover:translate-x-0.5" />
            </div>

            {/* Shortcut 3: Nutrition Recommendations */}
            <div 
              onClick={() => setActiveTab('food')}
              className="bg-slate-950/60 border border-slate-850 p-3 rounded-2xl hover:border-emerald-500/30 cursor-pointer group transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-200 group-hover:text-amber-400 transition-colors leading-tight">Recommendations</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Adaptive clinical eating plans</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-all group-hover:translate-x-0.5" />
            </div>

          </div>

        </div>

      </div>

      {/* 
        ========================================================================
        PRESERVED WALKWAY GRAPHICS & DATA
        The following layout contains the walking metrics and sections from the 
        previous version of the applet. To prevent permanent code deletion 
        while making the Health Snapshot and Daily Missions primary, the items 
        below are kept safely wrapped in the showWalkingTracker local variable logic.
        ========================================================================
      */}
      {showWalkingTracker && (
        <div className="p-6 bg-slate-900/10 rounded-2xl border border-dashed border-slate-800 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Preserved Walking Modules</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Steps dial preservation mock */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 text-left">
              <span className="text-[9.5px] font-mono text-slate-500 block">Today's Steps Dial</span>
              <span className="text-xl font-mono font-bold text-slate-350">{steps.toLocaleString()} / {stepGoal}</span>
            </div>

            {/* Distance widget representation */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 text-left">
              <span className="text-[9.5px] font-mono text-slate-500 block">Preserved Distance</span>
              <span className="text-xl font-mono font-bold text-slate-350">{parseFloat(((steps * 0.72) / 1000).toFixed(2))} km</span>
            </div>

            {/* Active minutes widget representation */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 text-left">
              <span className="text-[9.5px] font-mono text-slate-500 block">Preserved Active Minutes</span>
              <span className="text-xl font-mono font-bold text-slate-350">{Math.round(steps / 130)} min</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
