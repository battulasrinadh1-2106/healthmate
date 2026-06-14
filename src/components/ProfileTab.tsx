import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Sparkles, Scale, Accessibility, Camera, Trash2, Check, RefreshCw, Award, Lock, Unlock } from 'lucide-react';
import { UserProfile, BMIClassification } from '../types';
import { calculateBMI, classifyBMI } from '../data/foods';
import HealthMateMascot from './HealthMateMascot';

interface ProfileTabProps {
  profile: UserProfile;
  authUser: any;
  onLogout: () => void;
  onUpdateProfile: (newProfile: UserProfile, newAuthDetails: { name: string; email: string }) => void;
  steps?: number;
}

export default function ProfileTab({ profile, authUser, onLogout, onUpdateProfile, steps = 0 }: ProfileTabProps) {
  const [photo, setPhoto] = useState<string>(() => {
    return localStorage.getItem(`profile_pic_${authUser?._id || 'guest'}`) || '';
  });
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem(`profile_name_${authUser?._id || 'guest'}`) || authUser?.name || 'HealthMate Friend';
  });
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem(`profile_email_${authUser?._id || 'guest'}`) || authUser?.email || 'companion@healthmate.ai';
  });
  const [age, setAge] = useState<number>(profile.age);
  const [height, setHeight] = useState<number>(profile.height);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [gender, setGender] = useState<any>(profile.gender || 'female');
  const [activityLevel, setActivityLevel] = useState<any>(profile.activityLevel || 'moderate');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [mascotName, setMascotName] = useState<string>(() => {
    return localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
  });

  // Height Unit State Supporting Centimeter & Feet-Inches Toggles
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft-in'>('cm');
  const [feetInput, setFeetInput] = useState<number>(() => {
    const totalInches = profile.height / 2.54;
    return Math.floor(totalInches / 12) || 5;
  });
  const [inchesInput, setInchesInput] = useState<number>(() => {
    const totalInches = profile.height / 2.54;
    return Math.round((totalInches % 12) * 10) / 10 || 7;
  });

  // Calculate equivalent displays in real time
  const heightInFtInText = React.useMemo(() => {
    const totalInches = height / 2.54;
    const f = Math.floor(totalInches / 12);
    const i = Math.round((totalInches % 12) * 10) / 10;
    return `${f} ft ${i} in`;
  }, [height]);

  const heightInCmText = React.useMemo(() => {
    const calculatedCm = (feetInput * 12 + inchesInput) * 2.54;
    return `${calculatedCm.toFixed(1)} cm`;
  }, [feetInput, inchesInput]);

  // Auto scroll up on tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute live BMI on form state edits
  const liveBmi = (() => {
    if (!height || !weight || height <= 0 || weight <= 0) return 0;
    return parseFloat((weight / ((height / 100) * (height / 100))).toFixed(1));
  })();

  const getBmiStatusIndicator = (bmi: number) => {
    if (bmi < 16) {
      return { text: 'Critical Zone', color: 'text-rose-500 border-rose-500/25 animate-pulse', gap: '🔴 Critical Zone < 16', label: '🔴 Critical Zone' };
    }
    if (bmi >= 16 && bmi < 18.5) {
      return { text: 'Recovery Zone', color: 'text-orange-400 border-orange-500/25', gap: '🟠 Recovery Zone 16 - 18.4', label: '🟠 Recovery Zone' };
    }
    if (bmi >= 18.5 && bmi < 20) {
      return { text: 'Beginner Fit', color: 'text-yellow-400 border-yellow-500/25', gap: '🟡 Beginner Fit 18.5 - 19.9', label: '🟡 Beginner Fit' };
    }
    if (bmi >= 20 && bmi < 23) {
      return { text: 'Fit', color: 'text-emerald-400 border-emerald-500/25', gap: '🟢 Fit 20 - 22.9', label: '🟢 Fit' };
    }
    if (bmi >= 23 && bmi < 25) {
      return { text: 'Strong Fit', color: 'text-teal-400 border-teal-500/25', gap: '💪 Strong Fit 23 - 24.9', label: '💪 Strong Fit' };
    }
    if (bmi >= 25 && bmi < 27.5) {
      return { text: 'Fitness Warning', color: 'text-yellow-400 border-yellow-550/25', gap: '🟡 Fitness Warning 25 - 27.4', label: '🟡 Fitness Warning' };
    }
    if (bmi >= 27.5 && bmi < 30) {
      return { text: 'High Risk Fit', color: 'text-orange-400 border-orange-550/25', gap: '🟠 High Risk Fit 27.5 - 29.9', label: '🟠 High Risk Fit' };
    }
    return { text: 'Critical Risk', color: 'text-rose-500 border-rose-600/25', gap: '🔴 Critical Risk 30+', label: '🔴 Critical Risk' };
  };

  const getMascotBmiAdvice = (bmi: number) => {
    if (bmi < 16) return "Your BMI is in the severe underweight range. Let's work together step-by-step on building healthy habits, nourishing snacks, and steady strength! 🌱";
    if (bmi >= 16 && bmi < 17) return "Your BMI points to a moderate underweight profile. Adding some calorie-rich whole foods like healthy nuts, avocados, and natural proteins will do wonders! 💪";
    if (bmi >= 17 && bmi < 18.5) return "You are just slightly underweight! Adding balanced healthy oils and small nutritious snacks will easily guide you to complete equilibrium. 🍎";
    if (bmi >= 18.5 && bmi < 25) return "Great! Your BMI falls within the Healthy Weight range. Let's celebrate this wonderful homeostatic balance and keep walking! 🎉";
    if (bmi >= 25 && bmi < 30) return "Your BMI suggests you may be slightly above your target range. No worries! Just focusing on a few more daily steps and fiber-rich meals will work great! 🏃‍♀️";
    if (bmi >= 30 && bmi < 35) return "Your BMI indicates Obesity Class I. Let's focus on joint-safe, low-impact exercise habits like brisk walking, lots of hydration, and fresh, colorful meals! 💚";
    if (bmi >= 35 && bmi < 40) return "Your BMI suggests Obesity Class II. We walk calmly and fuel mindfully. Wholesome, green fiber-rich options and consistent steps is a life-changing path! ✨";
    return "Your BMI suggests Obesity Class III. Remember, small, steady adjustments build life-changing, durable results. Rest assured, I am right here to companion you every single day! 💚";
  };

  const currentBmiIndicator = getBmiStatusIndicator(liveBmi);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhoto(base64String);
      localStorage.setItem(`profile_pic_${authUser?._id || 'guest'}`, base64String);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto('');
    localStorage.removeItem(`profile_pic_${authUser?._id || 'guest'}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please provide a name.');
      return;
    }

    if (age < 12 || age > 110) {
      setErrorMessage('Please enter an age between 12 and 110.');
      return;
    }

    if (height < 90 || height > 260) {
      setErrorMessage('Please specify a height between 90cm and 260cm.');
      return;
    }

    if (weight < 25 || weight > 300) {
      setErrorMessage('Please verify weight is between 25kg and 300kg.');
      return;
    }

    setErrorMessage('');
    
    // Save to localStorages
    localStorage.setItem(`profile_name_${authUser?._id || 'guest'}`, name);
    localStorage.setItem(`profile_email_${authUser?._id || 'guest'}`, email);
    localStorage.setItem('healthmate_mascot_name', mascotName);

    // Call update callback to trigger structural sync in MainPage & database api calls
    onUpdateProfile(
      { age, height, weight, gender, activityLevel },
      { name, email }
    );

    setIsSaved(true);
    
    // Play synthetic save pop tone
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {}

    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const handleLogoutSubmit = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}

    onLogout();
  };

  // Dynamic Health Medal Rankings integrated into the new 8-level BMI check metrics
  const isHealthyForRankings = true; // Always unlocked to encourage progress and support physical health
  const [syncKey, setSyncKey] = React.useState<number>(0);

  React.useEffect(() => {
    const handleSync = () => setSyncKey(prev => prev + 1);
    window.addEventListener('healthmate_mission_sync', handleSync);
    return () => window.removeEventListener('healthmate_mission_sync', handleSync);
  }, []);

  const completedChallengesCount = React.useMemo(() => {
    try {
      const stored = localStorage.getItem('healthmate_completed_challenges');
      return stored ? JSON.parse(stored).length : 0;
    } catch {
      return 0;
    }
  }, []);

  const completedMissions = React.useMemo(() => {
    const w = localStorage.getItem('healthmate_mission_water') === 'true';
    const c = localStorage.getItem('healthmate_mission_calories') === 'true';
    const s = localStorage.getItem('healthmate_mission_sleep') === 'true';
    return (w ? 1 : 0) + (c ? 1 : 0) + (s ? 1 : 0);
  }, [syncKey]);

  const profileHealthScore = React.useMemo(() => {
    let score = 55;
    const bmi = liveBmi;
    if (bmi >= 23 && bmi < 25) score += 30; // Optimal Healthy
    else if (bmi >= 20 && bmi < 23) score += 25; // Healthy
    else if ((bmi >= 18.5 && bmi < 20) || (bmi >= 25 && bmi < 27.5)) score += 15; // Near Healthy / Overweight Risk
    else if ((bmi >= 16 && bmi < 18.5) || (bmi >= 27.5 && bmi < 30)) score += 8; // Underweight / Obesity Risk
    else score += 3; // Severe Underweight / Obese

    score += completedMissions * 5;
    return Math.min(105, score); // clamp or let it go up to 100 max
  }, [liveBmi, completedMissions]);

  const currentRank = React.useMemo(() => {
    if (profileHealthScore < 65) return 'Silver';
    if (profileHealthScore >= 65 && profileHealthScore < 80) return 'Gold';
    return 'Diamond';
  }, [profileHealthScore]);

  // Check and announce rank upgrades
  const [showUpgradeConfetti, setShowUpgradeConfetti] = useState<boolean>(false);
  const [upgradeRankName, setUpgradeRankName] = useState<string>('');

  useEffect(() => {
    if (currentRank === 'Locked') return;
    
    const prevSavedRank = localStorage.getItem('healthmate_stored_rank') || 'Silver';
    
    const rankWeights: Record<string, number> = {
      'Locked': 0,
      'Silver': 1,
      'Gold': 2,
      'Diamond': 3
    };

    const currentWeight = rankWeights[currentRank] || 1;
    const prevWeight = rankWeights[prevSavedRank] || 1;

    if (currentWeight > prevWeight) {
      setUpgradeRankName(currentRank);
      setShowUpgradeConfetti(true);
      localStorage.setItem('healthmate_stored_rank', currentRank);
      
      // Level-up audio celebratory chimes
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const playNote = (freq: number, delay: number, dur: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0.02, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + dur);
          };

          playNote(523.25, 0, 0.15); // C5
          playNote(659.25, 0.1, 0.15); // E5
          playNote(783.99, 0.2, 0.15); // G5
          playNote(1046.50, 0.3, 0.4); // C6
        }
      } catch {}

      // Dispatch companion bubble broadcast
      const bannerMsg = `Hooray! You've been upgraded to ${currentRank} Rank! 🏆 Your dedication to health is incredible!`;
      const updateEvent = new CustomEvent('aura-buddy', {
        detail: {
          text: bannerMsg,
          mood: 'proud',
        },
      });
      window.dispatchEvent(updateEvent);

    } else if (currentRank !== prevSavedRank) {
      localStorage.setItem('healthmate_stored_rank', currentRank);
    }
  }, [currentRank, mascotName]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Profile Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* Picture Circle with upload controls */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-full border-2 border-emerald-500/20 bg-slate-950 overflow-hidden relative shadow-lg shadow-black/40 flex items-center justify-center">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-1">
                  <User className="w-10 h-10 text-slate-600 mx-auto" />
                  <span className="text-[9px] font-mono font-medium text-slate-500 uppercase tracking-widest block">NO PHOTO</span>
                </div>
              )}
            </div>

            {/* Float camera upload triggers */}
            <div className="absolute bottom-0 right-0 flex items-center gap-1">
              <label 
                htmlFor="avatar-file-input" 
                className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer transition-all hover:scale-110 flex items-center justify-center"
                title="Upload Profile Picture"
              >
                <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photo && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 rounded-full bg-red-500 hover:bg-red-400 text-slate-950 shadow-md cursor-pointer transition-all hover:scale-110 flex items-center justify-center"
                  title="Remove Picture"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono tracking-wider font-bold">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              YOUR HEALTH COMPANION PROFILE
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-100">{name}</h2>
            <p className="text-xs font-mono text-slate-500">{email}</p>
          </div>
        </div>
      </div>

      {/* 5-Column High Fidelity Biometric Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm shadow-md shadow-black/10">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">Age</span>
          <span className="text-2xl font-mono font-black text-emerald-400">{age} <span className="text-xs font-normal text-slate-500">yrs</span></span>
          <span className="text-[10px] text-slate-400">Years</span>
        </div>
        <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm shadow-md shadow-black/10">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">Height</span>
          <span className="text-2xl font-mono font-black text-emerald-400">{height} <span className="text-xs font-normal text-slate-500">cm</span></span>
          <span className="text-[10px] text-slate-400">Height</span>
        </div>
        <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm shadow-md shadow-black/10">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">Weight</span>
          <span className="text-2xl font-mono font-black text-emerald-400">{weight} <span className="text-xs font-normal text-slate-500">kg</span></span>
          <span className="text-[10px] text-slate-400">Weight</span>
        </div>
        <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm shadow-md shadow-black/10">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">Body Mass Index</span>
          <span className="text-2xl font-mono font-black text-emerald-400">{liveBmi}</span>
          <span className="text-[10px] text-slate-400">Calculated BMI</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-sm shadow-md shadow-black/10">
          <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">BMI Status</span>
          <span className={`text-xs font-extrabold tracking-wide py-1 px-2.5 rounded-full bg-slate-950 font-mono ${currentBmiIndicator.color}`}>
            {currentBmiIndicator.text}
          </span>
          <span className="text-[10px] text-slate-450 font-sans">Classification</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Core Profile Parameters Forms (7 columns) */}
        <div className="md:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-5">
          <div className="border-b border-slate-850 pb-3.5">
            <h3 className="font-display font-bold text-lg text-slate-100">Personal Goals & Profile Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Configure your metrics to optimize your goals.</p>
          </div>

          {/* Mascot Guidance Message */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center gap-3 text-left">
            <div className="shrink-0 flex items-center justify-center">
              <HealthMateMascot size="sm" expression={liveBmi >= 18.5 && liveBmi < 25 ? "proud" : "calm"} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-widest text-[#10b981] font-bold uppercase block">HealthMate Guide</span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                "{getMascotBmiAdvice(liveBmi)}"
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-emerald-400 uppercase block">HealthMate Companion Nickname</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-emerald-400">✨</span>
                  <input
                    type="text"
                    required
                    value={mascotName}
                    onChange={(e) => setMascotName(e.target.value)}
                    placeholder="e.g. Buddy, Leafy"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-slate-100 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Age (years)
                </label>
                <input
                  type="number"
                  required
                  min="12"
                  max="110"
                  value={age || ''}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/55 rounded-xl px-4 py-3 font-mono text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  min="25"
                  max="300"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/55 rounded-xl px-4 py-3 font-mono text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Premium Interactive Height Slider Card */}
            <div className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-2xl space-y-3.5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-900 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Adjust Metric Height</h4>
                  <p className="text-[10px] text-slate-500">Live dual centimeter & imperial conversion</p>
                </div>
                
                {/* Format toggle pills */}
                <div className="bg-slate-900 p-0.5 rounded-full border border-slate-800 flex self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                      heightUnit === 'cm'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft-in')}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                      heightUnit === 'ft-in'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-455 hover:text-slate-200'
                    }`}
                  >
                    ft & in
                  </button>
                </div>
              </div>

              {heightUnit === 'cm' ? (
                <div className="space-y-3 py-0.5">
                  {/* Centimeters with Range Slider */}
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 font-mono">Height (cm)</span>
                    <div className="flex items-baseline gap-1 bg-slate-900/60 border border-slate-850 px-2.5 py-0.5 rounded-lg">
                      <input
                        type="number"
                        required
                        min="90"
                        max="240"
                        value={height || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setHeight(val);
                          // Sync ft in states
                          const totalInches = val / 2.54;
                          setFeetInput(Math.floor(totalInches / 12) || 5);
                          setInchesInput(Math.round((totalInches % 12) * 10) / 10 || 0);
                        }}
                        className="bg-transparent text-right font-mono text-sm font-bold text-slate-100 focus:outline-none w-12"
                      />
                      <span className="text-[10px] text-slate-500 font-bold uppercase select-none">cm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="range"
                      min="90"
                      max="240"
                      step="0.5"
                      value={height}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setHeight(val);
                        // Sync ft in states
                        const totalInches = val / 2.54;
                        setFeetInput(Math.floor(totalInches / 12) || 5);
                        setInchesInput(Math.round((totalInches % 12) * 10) / 10 || 0);
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-650">
                      <span>90 cm</span>
                      <span>160 cm</span>
                      <span>240 cm</span>
                    </div>
                  </div>

                  <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-900/50">
                    <span className="text-slate-500">Imperial Conversion</span>
                    <span className="font-mono font-bold text-emerald-400 bg-slate-900/40 border border-slate-850 px-2 rounded-lg py-0.5">{heightInFtInText}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-0.5">
                  {/* Feet & Inches Numeric Boxes with Dual Range Sliders */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Feet (ft)</span>
                        <span className="text-emerald-400 font-bold">{feetInput} ft</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="8"
                        step="1"
                        value={feetInput}
                        onChange={(e) => {
                          const f = parseInt(e.target.value);
                          setFeetInput(f);
                          const calculatedCm = parseFloat(((f * 12 + inchesInput) * 2.54).toFixed(1));
                          setHeight(calculatedCm);
                        }}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Inches (in)</span>
                        <span className="text-emerald-400 font-bold">{inchesInput} in</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="11.5"
                        step="0.5"
                        value={inchesInput}
                        onChange={(e) => {
                          const inc = parseFloat(e.target.value);
                          setInchesInput(inc);
                          const calculatedCm = parseFloat(((feetInput * 12 + inc) * 2.54).toFixed(1));
                          setHeight(calculatedCm);
                        }}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-900/50 pt-2.5">
                    <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-lg border border-slate-850">
                      <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-bold">Ft</span>
                      <input
                        type="number"
                        min="3"
                        max="8"
                        value={feetInput}
                        onChange={(e) => {
                          const f = parseInt(e.target.value) || 3;
                          setFeetInput(f);
                          const calculatedCm = parseFloat(((f * 12 + inchesInput) * 2.54).toFixed(1));
                          setHeight(calculatedCm);
                        }}
                        className="bg-transparent text-right font-mono text-xs font-bold text-slate-100 focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-lg border border-slate-850">
                      <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-bold">In</span>
                      <input
                        type="number"
                        min="0"
                        max="11.9"
                        step="0.1"
                        value={inchesInput}
                        onChange={(e) => {
                          const inc = parseFloat(e.target.value) || 0;
                          setInchesInput(inc);
                          const calculatedCm = parseFloat(((feetInput * 12 + inc) * 2.54).toFixed(1));
                          setHeight(calculatedCm);
                        }}
                        className="bg-transparent text-right font-mono text-xs font-bold text-slate-100 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-900/50">
                    <span className="text-slate-500">Metric Conversion</span>
                    <span className="font-mono font-bold text-emerald-400 bg-slate-900/40 border border-slate-850 px-2 rounded-lg py-0.5">{heightInCmText}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 font-sans text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase block">Daily Activity</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 font-sans text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="sedentary">Sedentary (Little/no exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="very">Very Active (6-7 days/week)</option>
                  <option value="athlete">Athlete (Intense training)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer transition-all active:scale-98"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Saved Changes!
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Update Physical Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Clean, Simple BMI Card (5 columns) */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100">BMI Metric Card</h3>
            <p className="text-xs text-slate-500 mt-1">Live Body Mass Index matching your input height & weight.</p>
          </div>

          {/* Central score display */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-extrabold font-mono tracking-widest text-slate-500 uppercase">CURRENT SCORE</span>
            <h2 className="text-5xl font-mono font-extrabold text-emerald-400 tracking-tight">{liveBmi}</h2>
            <div className={`text-xs font-extrabold tracking-wide px-3 py-1 bg-slate-900 border border-slate-800 rounded-full inline-block ${currentBmiIndicator.color}`}>
              {currentBmiIndicator.label}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-2 font-medium">
              {currentBmiIndicator.gap}
            </p>
          </div>

          {/* Clean Reference Guide */}
          <div className="space-y-2.5 font-sans">
            <span className="text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase block">8-LEVEL HEALTH CLASSIFICATIONS</span>
            
            <div className="space-y-1.5 text-xs">
              {[
                { label: '🔴 Critical Zone', range: 'BMI < 16.0', min: 0, max: 16 },
                { label: '🟠 Recovery Zone', range: '16.0 - 18.4', min: 16, max: 18.5 },
                { label: '🟡 Beginner Fit', range: '18.5 - 19.9', min: 18.5, max: 20 },
                { label: '🟢 Fit', range: '20.0 - 22.9', min: 20, max: 23 },
                { label: '💪 Strong Fit', range: '23.0 - 24.9', min: 23, max: 25 },
                { label: '🟡 Fitness Warning', range: '25.0 - 27.4', min: 25, max: 27.5 },
                { label: '🟠 High Risk Fit', range: '27.5 - 29.9', min: 27.5, max: 30 },
                { label: '🔴 Critical Risk', range: '30.0+', min: 30, max: 999 }
              ].map((item, idx) => {
                const isActive = liveBmi >= item.min && liveBmi < item.max;
                return (
                  <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-extrabold scale-[1.015]' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-400'
                  }`}>
                    <span>{isActive ? '👉 ' : ''}{item.label}</span>
                    <span className="font-mono font-semibold">{item.range}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* INTEGRATED HEALTH COMPANION MEDAL ROOM */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <Award className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <h3 className="font-display font-bold text-sm text-slate-100">Companion Medals & Rankings</h3>
              <p className="text-[10px] text-slate-500">Track and unlock standard rankings matching your health criteria.</p>
            </div>
          </div>

          {/* Always unlocked rank status progression */}
          <div className="space-y-4 text-left">
            {showUpgradeConfetti && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between gap-3 text-left relative overflow-hidden"
              >
                <div className="absolute -right-6 -bottom-6 text-6xl opacity-15 pointer-events-none select-none">🎉</div>
                <div className="space-y-1 z-10">
                  <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-extrabold uppercase block animate-bounce">RANK UPGRADE ANNOUNCEMENT!</span>
                  <h5 className="text-xs font-sans font-extrabold text-white">UPGRADED TO {upgradeRankName.toUpperCase()} RANK COMPANION!</h5>
                  <p className="text-[10.5px] text-slate-300 font-sans leading-relaxed">
                    Your virtual HealthMate companion {mascotName} is super proud! Keep this consistency up!
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowUpgradeConfetti(false)}
                  className="text-[10px] underline text-emerald-400 font-bold bg-transparent border-none cursor-pointer hover:text-white shrink-0 self-start z-10"
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            {/* Dynamic current rank display */}
            <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {currentRank === 'Silver' ? '🥈' : currentRank === 'Gold' ? '🥇' : '💎'}
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#10b981] font-black block uppercase">Current Rank Status</span>
                  <h4 className={`font-display font-black text-sm ${currentRank === 'Silver' ? 'text-slate-300' : currentRank === 'Gold' ? 'text-yellow-400' : 'text-teal-300'}`}>
                    {currentRank} Rank Medal
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {currentRank === 'Silver' && "BMI falls within baseline range! Turn on daily missions to increase."}
                    {currentRank === 'Gold' && "Fantastic work! Splendid consistency on daily health habits!"}
                    {currentRank === 'Diamond' && "Ultimate Master of Habits! You are in peak dynamic health!"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold block uppercase">Next Destination</span>
                <div className="text-xs font-display font-black text-slate-200">
                  {currentRank === 'Silver' ? '🥇 Gold Rank' : currentRank === 'Gold' ? '💎 Diamond' : '👑 Max Rank Unlocked'}
                </div>
              </div>
            </div>

            {/* Progress and status indicators */}
            {(() => {
              let nextRankName = "";
              let progressPercent = 0;
              let goalText = "";

              if (currentRank === 'Silver') {
                nextRankName = "Gold 🥇";
                progressPercent = Math.round((profileHealthScore / 65) * 100);
                goalText = `Unlock Gold rank by increasing your Health Score to 65%. Your current score is ${profileHealthScore}%. Complete daily missions to boost your score!`;
              } else if (currentRank === 'Gold') {
                nextRankName = "Diamond 💎";
                progressPercent = Math.round(((profileHealthScore - 65) / (80 - 65)) * 100);
                goalText = `Unlock Diamond rank by achieving a Health Score of 80% or greater. Your current score is ${profileHealthScore}%. Maintain healthy habits and complete all 3 daily missions!`;
              } else {
                nextRankName = "Ultimate Honor";
                progressPercent = 100;
                goalText = "Exceptional habit dedication! You have achieved Diamond Rank, representing your amazing progress in eating smart, staying active, and tracking your fitness.";
              }

              return (
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Progression to {nextRankName}</span>
                    <span className="text-emerald-400 font-mono font-black">{progressPercent}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    {goalText}
                  </p>
                </div>
              );
            })()}

            {/* Health Score Component Breakdown */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[9.5px] text-slate-400">
              <div className="flex justify-between">
                <span>BMI Zone Base Score:</span>
                <span className="text-emerald-400">
                  +{liveBmi >= 23 && liveBmi < 25 ? '75' : liveBmi >= 20 && liveBmi < 23 ? '70' : (liveBmi >= 18.5 && liveBmi < 20) || (liveBmi >= 25 && liveBmi < 27.5) ? '55' : (liveBmi >= 16 && liveBmi < 18.5) || (liveBmi >= 27.5 && liveBmi < 30) ? '40' : '25'} PTS
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-1.5 mt-1">
                <span>Daily Health Mission Progress ({completedMissions}/3 Done):</span>
                <span className="text-teal-400">+{completedMissions * 5} PTS</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-1.5 mt-1 font-bold text-[10px] text-slate-200">
                <span>Unified Health Score:</span>
                <span className="text-amber-400">{profileHealthScore} / 100</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      </div>

      {/* Modern, Accessible Logout Card Section */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/[0.015] rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left flex-1 border-b border-dashed border-slate-800 pb-4 md:border-none md:pb-0">
            <h3 className="font-display font-black text-slate-100 flex items-center justify-center md:justify-start gap-1.5">
              <span>🚪 Logout of HealthMate</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Sign out of your current session. Your progress and goals will be saved and waiting for you.
            </p>
          </div>
          
          <div className="shrink-0 w-full md:w-auto flex justify-center">
            {!showLogoutConfirm ? (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full md:w-auto py-3 px-6 rounded-xl bg-red-500/10 hover:bg-rose-500/15 border border-red-500/20 hover:border-red-500/30 text-red-400 font-display font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-98"
                id="profile-logout-btn"
                title="Initiate Logout"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="w-full bg-slate-950/65 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center sm:text-left space-y-0.5">
                  <span className="text-xs text-slate-200 font-bold block">Are you sure you want to logout?</span>
                  <span className="text-[10px] text-slate-500 block">You will need credentials to enter again.</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-slate-200 text-xs font-bold cursor-pointer transition-all active:scale-95"
                    title="Cancel Logout"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutSubmit}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 shadow-lg shadow-red-952/20"
                    title="Confirm Logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
