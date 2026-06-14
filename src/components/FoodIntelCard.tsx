/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { FoodItem, BMIClassification } from '../types';
import { getPersonalizedFoodIntelligence } from '../data/foods';
import { 
  Flame, 
  Sparkles, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Moon, 
  Sun, 
  Coffee, 
  Cookie,
  Footprints,
  Bike
} from 'lucide-react';

interface FoodIntelCardProps {
  food: FoodItem;
  bmiClassification: BMIClassification;
  userAge: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  userGender?: 'male' | 'female' | 'other';
  onClose?: () => void;
}

export default function FoodIntelCard({ 
  food, 
  bmiClassification, 
  userAge, 
  activityLevel,
  userGender,
  onClose 
}: FoodIntelCardProps) {
  
  // Calculate dynamic personalized food feedback using rule-based decision logic
  const advice = getPersonalizedFoodIntelligence(food, bmiClassification, userAge, activityLevel, userGender);

  // Calculate fiber grams (either from DB or estimated based on healthy food keywords/categories)
  const fiberGrams = food.macros.fiber !== undefined 
    ? food.macros.fiber 
    : (food.category === 'Fruits' || food.category === 'Vegetables' || food.name.toLowerCase().includes('salad') || food.name.toLowerCase().includes('apple') || food.name.toLowerCase().includes('berries') || food.name.toLowerCase().includes('spinach') || food.name.toLowerCase().includes('broccoli')
      ? Math.max(1.5, Math.round(food.macros.carbs * 0.15 * 10) / 10) 
      : Math.max(0.2, Math.round(food.macros.carbs * 0.05 * 10) / 10));

  // Total macros calculation for percentage distribution (including prebiotic fiber)
  const totalMacrosGrams = food.macros.carbs + food.macros.protein + food.macros.fat + fiberGrams;
  const carbsPct = totalMacrosGrams ? Math.round((food.macros.carbs / totalMacrosGrams) * 100) : 0;
  const proteinPct = totalMacrosGrams ? Math.round((food.macros.protein / totalMacrosGrams) * 100) : 0;
  const fatPct = totalMacrosGrams ? Math.round((food.macros.fat / totalMacrosGrams) * 100) : 0;
  const fiberPct = totalMacrosGrams ? Math.round((fiberGrams / totalMacrosGrams) * 100) : 0;

  // Custom physical activity burns dynamically derived from the calorie content:
  // 1 kCal = approx. 22 walking steps
  const stepsRequired = Math.max(50, Math.round(food.calories * 22));
  // Brisk walking burns ~4.5 kcal/min
  const walkingDur = Math.max(2, Math.round(food.calories / 4.5));
  // Jogging burns ~9.0 kcal/min
  const joggingDur = Math.max(1, Math.round(food.calories / 9.0));
  // Cycling burns ~7.5 kcal/min
  const cyclingDur = Math.max(1, Math.round(food.calories / 7.5));

  // Icons mapping for custom advice workout suggests
  const workoutIconMap: Record<string, React.ReactNode> = {
    Flame: <Flame className="w-5 h-5 text-red-400" />,
    UserCheck: <Activity className="w-5 h-5 text-emerald-400" />,
    TrendingUp: <Activity className="w-5 h-5 text-purple-400" />,
    Zap: <Activity className="w-5 h-5 text-amber-500" />,
    Smile: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    Activity: <Activity className="w-5 h-5 text-emerald-400" />,
    Dumbbell: <DumbbellIcon className="w-5 h-5 text-teal-400" />
  };

  function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 6.5h11" />
        <path d="M6.5 17.5h11" />
        <path d="M3 10V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4" />
        <path d="M16 10V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4" />
        <path d="M3 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4" />
        <path d="M16 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4" />
        <path d="M8 10v4h8v-4z" />
      </svg>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
    >
      {/* Top action header for modal look (if onClose provided) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          title="Close details"
        >
          &times;
        </button>
      )}

      {/* Main Image Banner */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={food.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80"}
          alt={food.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80";
          }}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        
        {/* Float tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-xs text-slate-300 font-medium tracking-wide">
            {food.category}
          </span>
          <span className="px-3 py-1 bg-emerald-500/90 text-slate-950 rounded-full text-xs font-mono font-bold tracking-wide shadow-md shadow-emerald-500/20">
            {food.servingSize}
          </span>
        </div>

        {/* Floating Calories Badge */}
        <div className="absolute bottom-4 right-4 text-right">
          <div className="px-4 py-1.5 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase leading-none">ENERGY</span>
            <span className="font-display font-extrabold text-2xl text-emerald-400 font-mono leading-tight">{food.calories}</span>
            <span className="text-[10px] text-slate-400 font-mono leading-none">kCal</span>
          </div>
        </div>
      </div>

      {/* Card Contents */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-slate-100">{food.name}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
            {food.description}
          </p>
        </div>

        {/* Smart Personalized Verdict Badge */}
        <div className={`p-4 border rounded-2xl ${advice.colorClass} transition-all`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {advice.verdict === 'RECOMMENDED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : advice.verdict === 'MODERATION' ? (
                <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0" />
              ) : advice.verdict === 'LIMIT INTAKE' ? (
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                  HEALTHMATE VERDICT:
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-display uppercase tracking-wider ${advice.badgeColorClass}`}>
                  {advice.verdict}
                </span>
              </div>
              <p className={`text-sm leading-relaxed font-sans ${advice.textColorClass}`}>
                {advice.warningText}
              </p>
            </div>
          </div>
        </div>

        {/* Nutritional Macronutrients Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Nutritional Macros Composition
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {/* Calories Card */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">CALORIES</span>
              <span className="font-display font-bold text-base text-emerald-400 mt-1 font-mono">
                {food.calories} <span className="text-xs text-slate-400 font-normal">kCal</span>
              </span>
              <div className="w-full h-1 bg-slate-850 rounded-full mt-2" />
              <span className="text-[9px] text-slate-600 mt-1 font-mono">Energy fuel</span>
            </div>

            {/* Protein Card */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-teal-500/20 transition-all duration-300">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">PROTEIN</span>
              <span className="font-display font-bold text-base text-teal-400 mt-1 font-mono">
                {food.macros.protein}g
              </span>
              <div className="w-full h-1 bg-slate-850 rounded-full mt-2 overflow-hidden">
                <div style={{ width: `${proteinPct}%` }} className="bg-teal-400 h-full rounded-full" />
              </div>
              <span className="text-[9px] text-slate-600 mt-1 font-mono">{proteinPct}% of macros</span>
            </div>

            {/* Carbs Card */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">CARBS</span>
              <span className="font-display font-bold text-base text-amber-400 mt-1 font-mono">
                {food.macros.carbs}g
              </span>
              <div className="w-full h-1 bg-slate-850 rounded-full mt-2 overflow-hidden">
                <div style={{ width: `${carbsPct}%` }} className="bg-amber-400 h-full rounded-full" />
              </div>
              <span className="text-[9px] text-slate-600 mt-1 font-mono">{carbsPct}% of macros</span>
            </div>

            {/* Fats Card */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-rose-500/20 transition-all duration-300">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">FAT</span>
              <span className="font-display font-bold text-base text-rose-400 mt-1 font-mono">
                {food.macros.fat}g
              </span>
              <div className="w-full h-1 bg-slate-850 rounded-full mt-2 overflow-hidden">
                <div style={{ width: `${fatPct}%` }} className="bg-rose-400 h-full rounded-full" />
              </div>
              <span className="text-[9px] text-slate-600 mt-1 font-mono">{fatPct}% of macros</span>
            </div>

            {/* Fiber Card */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">FIBER</span>
              <span className="font-display font-bold text-base text-cyan-400 mt-1 font-mono">
                {fiberGrams}g
              </span>
              <div className="w-full h-1 bg-slate-850 rounded-full mt-2 overflow-hidden">
                <div style={{ width: `${fiberPct}%` }} className="bg-cyan-400 h-full rounded-full" />
              </div>
              <span className="text-[9px] text-slate-600 mt-1 font-mono">{fiberPct}% of macros</span>
            </div>
          </div>
        </div>

        {/* Dynamic Physical Burn Workout System */}
        <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400 animate-spin-slow" />
              Companion Calorie Burn Estimates
            </h4>
            <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-md font-mono text-emerald-400 font-bold">
              Supportive Estimates
            </span>
          </div>

          {/* New 4-column Bento layout for requested activity estimates */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* Steps required */}
            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col items-center text-center justify-center space-y-1 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block leading-none">STEPS REQUIRED</span>
              <span className="text-xs font-semibold text-slate-200 mt-1.5 font-mono">
                {stepsRequired.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-600 font-sans block">steps total</span>
            </div>

            {/* Walking duration */}
            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col items-center text-center justify-center space-y-1 hover:border-amber-500/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block leading-none">WALKING</span>
              <span className="text-xs font-semibold text-slate-200 mt-1.5 font-mono">
                {walkingDur} <span className="text-[10px] font-normal text-slate-400">mins</span>
              </span>
              <span className="text-[9px] text-slate-600 font-sans block">Brisk pace</span>
            </div>

            {/* Jogging duration */}
            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col items-center text-center justify-center space-y-1 hover:border-rose-500/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block leading-none">JOGGING</span>
              <span className="text-xs font-semibold text-slate-200 mt-1.5 font-mono">
                {joggingDur} <span className="text-[10px] font-normal text-slate-400">mins</span>
              </span>
              <span className="text-[9px] text-slate-600 font-sans block">Moderate pace</span>
            </div>

            {/* Cycling duration */}
            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex flex-col items-center text-center justify-center space-y-1 hover:border-teal-500/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-1">
                <Bike className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block leading-none">CYCLING</span>
              <span className="text-xs font-semibold text-slate-200 mt-1.5 font-mono">
                {cyclingDur} <span className="text-[10px] font-normal text-slate-400">mins</span>
              </span>
              <span className="text-[9px] text-slate-600 font-sans block">12-14 mph pace</span>
            </div>
          </div>
        </div>

        {/* Portion intake guidance */}
        <div className="space-y-1.5 font-sans">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            SUGGESTED PORTION & FREQUENCY
          </span>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-slate-850">
            {advice.intakeGuidance}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
