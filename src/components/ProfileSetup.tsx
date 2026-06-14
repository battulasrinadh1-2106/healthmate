/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Gender } from '../types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  Scale, 
  Ruler, 
  User, 
  Calendar,
  Layers,
  Sparkle
} from 'lucide-react';
import HealthMateMascot from './HealthMateMascot';

interface ProfileSetupProps {
  initialProfile?: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  onBack?: () => void;
}

export default function ProfileSetup({ initialProfile, onSubmit, onBack }: ProfileSetupProps) {
  // Screen 1: Welcome Greeting, 2: What should I call you?, 3: How old are you?, 4: Give me a nickname?, 5: Height & Weight Calibration
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Companion variables
  const [companionName, setCompanionName] = useState<string>(() => {
    return localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
  });
  const [companionNicknameInput, setCompanionNicknameInput] = useState<string>('');

  // User details
  const [fullName, setFullName] = useState<string>(() => {
    return initialProfile?.fullName || localStorage.getItem('healthmate_user_name') || '';
  });
  const [age, setAge] = useState<number>(() => {
    const saved = localStorage.getItem('healthmate_user_age');
    return saved ? parseInt(saved) : (initialProfile?.age || 24);
  });
  const [gender, setGender] = useState<Gender>(() => {
    return initialProfile?.gender || (localStorage.getItem('healthmate_user_gender') as Gender) || 'other';
  });

  const [weight, setWeight] = useState<number>(initialProfile?.weight || 64);
  const [height, setHeight] = useState<number>(initialProfile?.height || 168);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft-in'>('cm');

  // Feet/Inches fields
  const [feetInput, setFeetInput] = useState<number>(() => {
    const totalInches = (initialProfile?.height || 168) / 2.54;
    return Math.floor(totalInches / 12) || 5;
  });
  const [inchesInput, setInchesInput] = useState<number>(() => {
    const totalInches = (initialProfile?.height || 168) / 2.54;
    return Math.round(totalInches % 12);
  });

  const [validationError, setValidationError] = useState<string>('');

  // Audio synthy sound generator for interactive response feedback
  const playSound = (type: 'next' | 'back' | 'calc' | 'error' | 'bell') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'next') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(510, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      } else if (type === 'back') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      } else if (type === 'calc') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);
      } else if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      }
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Convert unit metric-imperial toggle
  const toggleHeightUnit = (unit: 'cm' | 'ft-in') => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (unit === 'cm') {
      const calculatedCm = Math.round((feetInput * 12 + inchesInput) * 2.54);
      setHeight(calculatedCm);
    } else {
      const totalInches = height / 2.54;
      setFeetInput(Math.floor(totalInches / 12) || 5);
      setInchesInput(Math.round(totalInches % 12));
    }
    playSound('calc');
  };

  const calculatedBmiScore = useMemo(() => {
    if (!height || !weight) return 0;
    const heightM = height / 100;
    return parseFloat((weight / (heightM * heightM)).toFixed(1));
  }, [height, weight]);

  const bmiDetails = useMemo(() => {
    const score = calculatedBmiScore;
    
    // Exact medical standards (fully translated to clinical English tags)
    if (score < 16) {
      return {
        category: 'Severe Thinness',
        color: 'text-sky-450',
        bg: 'bg-sky-500/5',
        border: 'border-sky-500/15',
        emoji: '❄️',
        msg: 'Severely low BMI. Let\'s make steady protein gains and regular, rich meal habits.'
      };
    }
    if (score >= 16 && score < 17) {
      return {
        category: 'Moderate Thinness',
        color: 'text-sky-400',
        bg: 'bg-sky-400/5',
        border: 'border-sky-400/15',
        emoji: '⚠️',
        msg: 'Indicates moderate thinness. Muscle building exercises can help support your skeleton!'
      };
    }
    if (score >= 17 && score < 18.5) {
      return {
        category: 'Mild Thinness',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/5',
        border: 'border-yellow-500/15',
        emoji: '🟡',
        msg: 'A fraction below average weight range. Let\'s focus on wholesome complex carbohydrates!'
      };
    }
    if (score >= 18.5 && score < 25) {
      return {
        category: 'Normal',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/5',
        border: 'border-emerald-500/15',
        emoji: '💚',
        msg: 'Perfect! Your BMI belongs inside the optimal healthy curve. Keep moving to stay fit!'
      };
    }
    if (score >= 25 && score < 30) {
      return {
        category: 'Overweight',
        color: 'text-amber-400',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/15',
        emoji: '🟠',
        msg: 'Slightly above standard scale. Eating fresh foods and taking daily walks is a wonderful way to feel lighter!'
      };
    }
    if (score >= 30 && score < 35) {
      return {
        category: 'Obese Class I',
        color: 'text-rose-400',
        bg: 'bg-rose-500/5',
        border: 'border-rose-500/15',
        emoji: '🚨',
        msg: 'Class I category. Setting continuous gentle step goals is a wonderful lifestyle habit!'
      };
    }
    if (score >= 35 && score < 40) {
      return {
        category: 'Obese Class II',
        color: 'text-red-400',
        bg: 'bg-red-500/5',
        border: 'border-red-500/15',
        emoji: '🚨',
        msg: 'Class II category. Let\'s explore nourishing low glycemic alternatives together!'
      };
    }
    return {
      category: 'Obese Class III',
      color: 'text-red-500',
      bg: 'bg-red-650/5',
      border: 'border-red-650/15',
      emoji: '🚨',
      msg: 'Class III category. Gradual routines and active walking produce amazing well-being.'
    };
  }, [calculatedBmiScore]);

  // Mascot dynamic posture expressions for the setup flow
  const currentMascotExpression = useMemo(() => {
    if (validationError) return 'concerned';
    switch (currentStep) {
      case 1: return 'excited'; // Waving!
      case 2: return 'curious';
      case 3: return 'thinking';
      case 4: return 'surprised';
      case 5: return 'proud';
      default: return 'happy';
    }
  }, [currentStep, validationError]);

  // Mascot speech dialogue text based on step
  const getSpeechBubbleText = () => {
    if (validationError) {
      return `Oh! Let's check: ${validationError}`;
    }
    switch (currentStep) {
      case 1:
        return `👋 Hi! I'm HealthMate. Your tiny health buddy. Let's take care of your health together.`;
      case 2:
        return `What should I call you? Choose a beautiful name so I can greet you correctly inside our space.`;
      case 3:
        return `How old are you, ${fullName || 'Friend'}? I use this to customize your daily activity and calorie goals.`;
      case 4:
        if (companionNicknameInput.trim() && companionNicknameInput.trim() !== 'HealthMate') {
          return `Meet your HealthMate Companion 🌱! You chose the nickname "${companionNicknameInput}". I love it!`;
        }
        return `Meet your HealthMate Companion 🌱! Keep the default name or choose a fun nickname. This is completely optional!`;
      case 5:
        return `Wonderful! Finally, let's calibrate your height and weight so we can establish your baseline index.`;
      default:
        return `Let's set up your personal health program!`;
    }
  };

  const handleNextStep = () => {
    setValidationError('');
    
    if (currentStep === 1) {
      playSound('next');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!fullName.trim()) {
        setValidationError('Please enter your name so we can introduce ourselves!');
        playSound('error');
        return;
      }
      playSound('next');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!age || age < 5 || age > 115) {
        setValidationError('Please type a realistic age between 5 and 115.');
        playSound('error');
        return;
      }
      playSound('next');
      setCurrentStep(4);
    } else if (currentStep === 4) {
      const finalNickname = companionNicknameInput.trim() || 'HealthMate';
      setCompanionName(finalNickname);
      localStorage.setItem('healthmate_mascot_name', finalNickname);
      // Notify components about new mascot nickname
      window.dispatchEvent(new CustomEvent('healthmate-name-changed', { detail: finalNickname }));
      playSound('bell');
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      playSound('back');
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      playSound('back');
      onBack();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError('Please type your name.');
      setCurrentStep(2);
      return;
    }

    if (!age || age < 5 || age > 115) {
      setValidationError('Please select an age.');
      setCurrentStep(3);
      return;
    }

    if (height < 90 || height > 245) {
      setValidationError('Select a height calibration range between 90 and 245 cm.');
      playSound('error');
      return;
    }

    if (weight < 25 || weight > 250) {
      setValidationError('Select a weight calibration range between 25 and 250 kg.');
      playSound('error');
      return;
    }

    const finalMascotName = companionName.trim() || 'HealthMate';
    localStorage.setItem('healthmate_mascot_name', finalMascotName);
    localStorage.setItem('healthmate_user_name', fullName.trim());
    localStorage.setItem('healthmate_user_age', age.toString());
    localStorage.setItem('healthmate_user_gender', gender);

    playSound('bell');

    onSubmit({
      fullName: fullName.trim(),
      age: age,
      gender: gender,
      height: Math.round(height),
      weight: Math.round(weight),
      activityLevel: 'moderate',
      bmiScore: calculatedBmiScore,
      bmiCategory: bmiDetails.category
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#03060B] text-slate-100 flex flex-col justify-start md:justify-center items-center px-4 py-8 overflow-y-auto selection:bg-emerald-500/25 selection:text-emerald-300">
      
      {/* Immersive layered environmental blooms */}
      <div className="absolute top-[8%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        
        {/* CHARACTER HEADLINE CIRCLE STAGE */}
        <div className="w-full flex flex-col items-center mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 relative"
          >
            <div className="relative">
              <HealthMateMascot 
                size={currentStep === 1 ? 'xxl' : 'lg'} 
                expression={currentMascotExpression} 
                className="drop-shadow-[0_15px_35px_rgba(16,185,129,0.25)] transition-all duration-300"
              />
              {/* Dynamic halo support ring */}
              <div className="absolute inset-1 border-2 border-dashed border-emerald-500/10 rounded-full -z-10 animate-[spin_60s_linear_infinite]" />
            </div>

            <span className="absolute bottom-1 right-2 bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-full shadow-lg shadow-emerald-550/30">
              <Sparkle className="w-3.5 h-3.5 text-slate-950 fill-slate-950 stroke-[2]" />
            </span>
          </motion.div>

          {/* Dialog Bubble Interface Board */}
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#090F17] border border-slate-850 rounded-2xl p-4 w-full shadow-xl backdrop-blur-md"
          >
            <div className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#090F17] border-t border-l border-slate-850 rotate-45" />
            <p className="text-xs md:text-sm font-semibold text-emerald-100 leading-relaxed text-center" id="onboarding-mascot-speech">
              {getSpeechBubbleText()}
            </p>
          </motion.div>
        </div>

        {/* PROGRESS PINPOINTS */}
        {currentStep > 1 && (
          <div className="flex gap-2 mb-6 items-center justify-center">
            {[1, 2, 3, 4, 5].map((num) => {
              const completed = num < currentStep;
              const active = num === currentStep;
              return (
                <div
                  key={num}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active 
                      ? 'w-6 bg-emerald-400 shadow shadow-emerald-400/30' 
                      : completed 
                        ? 'w-3 bg-teal-500/40' 
                        : 'w-1.5 bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* WIZARD FORM PLATFORM */}
        <div className="w-full bg-[#080D15]/95 border border-slate-850 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          <AnimatePresence mode="wait">
            <div className="space-y-4">

              {/* STEP 1: Pixar-cut Greeting Introduction */}
              {currentStep === 1 && (
                <motion.div
                  key="step-welcome"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 text-center"
                >
                  <div className="pt-2">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10 inline-block">
                      YOUR ADORABLE BEST COMPANION
                    </span>
                    <h1 className="text-xl font-bold font-display text-white tracking-tight mt-2.5">
                      Hello Friend! 👋
                    </h1>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 px-1 font-medium">
                      Let\'s create a spectacular, healthy version of you. Together we\'ll track goals, explore food intelligence, and crush active walks! Quick setup ahead. 🌿
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-emerald-900/10 text-xs uppercase tracking-wider active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
                      id="onboarding-begin-btn"
                    >
                      <span>Let's Begin</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Name calibration */}
              {currentStep === 2 && (
                <motion.div
                  key="step-name"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                      STEP 2 OF 5
                    </span>
                    <h2 className="text-base font-black mt-2 text-slate-100">Tell Me Your Name</h2>
                  </div>

                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">My Full Name</label>
                    <div className="relative pt-1.5">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60 z-10">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="onboarding-username-input"
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Srinadh"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#04080E] border border-slate-800 focus:border-emerald-500 py-3 pl-11 pr-4 rounded-xl text-left text-xs font-bold text-slate-200 placeholder-slate-650 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Continuing triggers */}
                  <div className="pt-2.5 flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="py-2.5 px-3.5 border border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Age Calibration */}
              {currentStep === 3 && (
                <motion.div
                  key="step-age"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                      STEP 3 OF 5
                    </span>
                    <h2 className="text-base font-black mt-2 text-slate-100">How Old Are You?</h2>
                  </div>

                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">My Age</label>
                    <div className="relative pt-1.5 pb-1">
                      <div className="absolute left-4 top-[calc(50%-4px)] text-emerald-400/60 z-10">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        id="onboarding-userage-input"
                        type="number"
                        required
                        min="5"
                        max="115"
                        placeholder="e.g. 24"
                        value={age || ''}
                        onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#04080E] border border-slate-800 focus:border-emerald-500 py-3 pl-11 pr-4 rounded-xl text-left text-xs font-bold text-slate-200 placeholder-slate-650 focus:outline-none transition-colors search-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 block text-left pt-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">My Gender</label>
                    <div className="grid grid-cols-3 gap-2 pt-1.5">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGender(g);
                            playSound('calc');
                          }}
                          className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                            gender === g
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20'
                              : 'bg-[#04080E] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="py-2.5 px-3.5 border border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Choose Buddy Character Nickname */}
              {currentStep === 4 && (
                <motion.div
                  key="step-nickname"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                      OPTIONAL PERSONALIZATION
                    </span>
                    <h2 className="text-lg font-black mt-2 text-white font-display leading-tight flex items-center justify-center gap-2">
                      Meet Your HealthMate Companion 🌱
                    </h2>
                    <p className="text-[11px] text-slate-350 leading-relaxed mt-2.5 max-w-xs mx-auto">
                      Your HealthMate companion can have a fun nickname. This is completely optional. You can keep the default name or choose your own below!
                    </p>
                  </div>

                  {/* Cute suggestion chips */}
                  <div className="space-y-2 pt-1 block text-left">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Suggested Nicknames 🌱
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { name: 'Kiki', emoji: '❤️' },
                        { name: 'Sri', emoji: '✨' },
                        { name: 'Akki', emoji: '🌿' },
                        { name: 'Ryan', emoji: '🚀' },
                      ].map((item) => {
                        const isSelected = companionNicknameInput === item.name;
                        return (
                          <motion.button
                            key={item.name}
                            type="button"
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                              setCompanionNicknameInput(item.name);
                              setCompanionName(item.name);
                              playSound('next');
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-900/15'
                                : 'bg-[#04080E] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <span>{item.name}</span>
                            <span>{item.emoji}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom nickname entry options */}
                  <div className="space-y-1 block text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        Or enter custom nickname
                      </label>
                      {companionNicknameInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompanionNicknameInput('');
                            setCompanionName('HealthMate');
                            playSound('back');
                          }}
                          className="text-[9px] text-[#10b981] font-mono hover:underline cursor-pointer bg-transparent border-none"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                    <input
                      id="onboarding-buddy-nickname-input"
                      type="text"
                      maxLength={15}
                      placeholder="[ Enter nickname ]"
                      value={companionNicknameInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompanionNicknameInput(val);
                        setCompanionName(val || 'HealthMate');
                      }}
                      className="w-full mt-1.5 bg-[#04080E] border border-slate-800 focus:border-emerald-500 py-2.5 rounded-xl text-center text-xs font-bold text-slate-200 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Navigation controls */}
                  <div className="pt-3 flex flex-col gap-2">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2.5 px-3.5 border border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-slate-950 font-black rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none"
                      >
                        <span>{companionNicknameInput ? 'Apply Name' : 'Continue'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                      </button>
                    </div>

                    {/* Dedicated lightweight SKIP OPTION */}
                    <button
                      type="button"
                      onClick={() => {
                        setCompanionNicknameInput('');
                        setCompanionName('HealthMate');
                        localStorage.setItem('healthmate_mascot_name', 'HealthMate');
                        window.dispatchEvent(new CustomEvent('healthmate-name-changed', { detail: 'HealthMate' }));
                        playSound('bell');
                        setCurrentStep(5);
                      }}
                      className="w-full text-center py-2 text-[10px] text-slate-400 font-mono tracking-wider hover:text-emerald-400 transition-colors cursor-pointer bg-slate-950/20 border border-transparent rounded-lg hover:border-slate-850/60"
                    >
                      Skip this step & keep default name
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Height & Weight Calibration */}
              {currentStep === 5 && (
                <motion.div
                  key="step-metrics"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                      STEP 5 OF 5
                    </span>
                    <h2 className="text-base font-black mt-2 text-slate-100">Physical Calibration</h2>
                  </div>

                  {/* Standard Metric Toggle selector */}
                  <div className="flex justify-center">
                    <div className="bg-[#04080E] p-0.5 rounded-xl border border-slate-800 inline-flex w-full">
                      <button
                        type="button"
                        onClick={() => toggleHeightUnit('cm')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide transition-all cursor-pointer ${
                          heightUnit === 'cm'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        cm
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHeightUnit('ft-in')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide transition-all cursor-pointer ${
                          heightUnit === 'ft-in'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        ft & in
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Height calibrator */}
                    <div className="bg-[#04080E] p-3 rounded-xl border border-slate-850 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Ruler className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Height Calibrator</span>
                      </div>
                      
                      {heightUnit === 'cm' ? (
                        <div className="w-full flex flex-col items-center">
                          <span className="text-lg font-black font-mono text-emerald-400">{Math.round(height)} cm</span>
                          <input
                            type="range"
                            min="90"
                            max="245"
                            step="1"
                            value={height}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 168;
                              setHeight(val);
                              const totalInches = val / 2.54;
                              setFeetInput(Math.floor(totalInches / 12));
                              setInchesInput(Math.round(totalInches % 12));
                            }}
                            className="w-full mt-2 accent-emerald-500 h-1 bg-slate-900 rounded cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 py-1">
                          <div className="flex items-baseline gap-0.5">
                            <input
                              type="number"
                              min="3"
                              max="8"
                              value={feetInput}
                              onChange={(e) => {
                                const f = parseInt(e.target.value) || 5;
                                setFeetInput(f);
                                setHeight(Math.round((f * 12 + inchesInput) * 2.54));
                              }}
                              className="bg-transparent text-center font-mono text-lg font-black text-emerald-400 w-8 focus:outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-500 font-mono">ft</span>
                          </div>
                          <span className="text-slate-700 font-semibold">:</span>
                          <div className="flex items-baseline gap-0.5">
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={inchesInput}
                              onChange={(e) => {
                                const inc = parseInt(e.target.value) || 0;
                                setInchesInput(inc);
                                setHeight(Math.round((feetInput * 12 + inc) * 2.54));
                              }}
                              className="bg-transparent text-center font-mono text-lg font-black text-emerald-400 w-8 focus:outline-none"
                            />
                            <span className="text-[10px] font-bold text-slate-500 font-mono">in</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Weight calibrator */}
                    <div className="bg-[#04080E] p-3 rounded-xl border border-slate-850 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Scale className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Weight Calibrator</span>
                      </div>
                      <span className="text-lg font-black font-mono text-emerald-400">{Math.round(weight)} kg</span>
                      <input
                        type="range"
                        min="25"
                        max="200"
                        step="1"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value) || 64)}
                        className="w-full mt-2 accent-emerald-500 h-1 bg-slate-900 rounded cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-500 font-mono mt-1">
                        Imperial equivalent: {Math.round(weight * 2.20462)} lbs
                      </span>
                    </div>

                  </div>

                  {/* Calibration buttons */}
                  <div className="pt-2.5 flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="py-2.5 px-3.5 border border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-450 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-lg shadow-emerald-900/10 text-xs uppercase tracking-wider active:scale-95"
                      id="onboarding-enter-dashboard-btn"
                    >
                      <span>Enter Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[3.5]" />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
