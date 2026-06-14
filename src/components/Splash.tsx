import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Brain, Heart, Star, Smile } from 'lucide-react';
import HealthMateMascot from './HealthMateMascot';

interface SplashProps {
  onGetStarted: (mode: 'login' | 'register') => void;
}

export default function Splash({ onGetStarted }: SplashProps) {
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'excited' | 'thoughtful' | 'motivating'>('happy');

  // Friendly audio chime
  const playSoundChime = (frequency: number, duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  useEffect(() => {
    playSoundChime(660, 0.3);
    const interval = setInterval(() => {
      const expressions: Array<'happy' | 'excited' | 'thoughtful' | 'motivating'> = ['happy', 'excited', 'thoughtful', 'motivating'];
      const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
      setMascotExpression(nextExp);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-obsidian text-slate-100 p-6 md:p-12 relative flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Decorative High-Key Ambient Glows matching design specs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-green/8 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#10b981]/5 blur-[140px] pointer-events-none" />

      {/* Outer master Grid container mimicking image layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 z-10">
        
        {/* LEFT COLUMN: About & Smart Health Companion Info (span 4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-center text-left">
          
          {/* Logo Brand Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
                HEALTH<span className="text-brand-green">MATE</span>
              </h1>
              <span className="text-2xl mt-1">🌿</span>
            </div>
            <p className="text-xs text-brand-green font-medium tracking-wider font-sans uppercase mt-1">
              Your Smart Health Companion
            </p>
          </div>

          {/* Master Title */}
          <div className="bg-[#111827]/30 border border-slate-900 rounded-2xl p-4">
            <span className="text-[10px] font-mono font-bold text-brand-green tracking-widest uppercase">
              MASTER UI + CHARACTER
            </span>
            <h2 className="text-lg font-black text-white mt-1 leading-snug">
              INTELLIGENT COMPANION EXPERIENCE
            </h2>
          </div>

          {/* About Section */}
          <div className="bg-card-obsidian/60 border border-slate-900/60 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              ABOUT HEALTHMATE
            </h3>
            <p className="text-xs text-text-second leading-relaxed font-sans">
              HealthMate is your cute, intelligent health companion that guides you every step of the way. From tracking your steps to analyzing your health, HealthMate is always with you!
            </p>
            
            {/* 4 Pillars Under About Box */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="flex flex-col items-center p-2 rounded-xl bg-bg-obsidian/80 border border-slate-900 text-center space-y-1">
                <Brain className="w-4 h-4 text-brand-green" />
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400">Smart</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-bg-obsidian/80 border border-slate-900 text-center space-y-1">
                <Smile className="w-4 h-4 text-brand-green" />
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400">Friendly</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-bg-obsidian/80 border border-slate-900 text-center space-y-1">
                <Star className="w-4 h-4 text-brand-green" />
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400">Motivating</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-bg-obsidian/80 border border-slate-900 text-center space-y-1">
                <Heart className="w-4 h-4 text-brand-green" />
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400">Supportive</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Giant 3D Hero stage for companion (span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative space-y-4">
          <div className="relative w-full aspect-square max-w-[340px] md:max-w-[400px] rounded-full bg-slate-950/60 border border-slate-800 flex items-center justify-center p-4 shadow-3xl overflow-visible">
            
            {/* Pulsating backlights */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-brand-green/10 via-transparent to-transparent blur-md animate-pulse" />
            <div className="absolute bottom-1 w-48 h-10 bg-brand-green/20 rounded-full blur-xl pointer-events-none" />

            {/* Giant central 3D scene representation */}
            <div className="absolute -bottom-4 z-10 cursor-pointer">
              <HealthMateMascot 
                size="xxl" 
                expression={mascotExpression} 
                animate={true} 
              />
            </div>
          </div>

          {/* Expressions list pill box matching image spec context */}
          <div className="bg-[#111827]/80 border border-slate-900 px-4 py-2 rounded-2xl flex flex-col items-center text-center space-y-1.5 w-full max-w-[320px]">
            <span className="text-[9px] font-mono tracking-widest text-brand-green font-bold uppercase">EXPRESSIONS</span>
            <p className="text-[10px] text-slate-400">Multiple expressive emotions based on context</p>
            <div className="flex items-center gap-1.5 pt-1">
              {['Happy', 'Thinking', 'Excited', 'Motivating', 'Celebrating'].map((exp) => (
                <span key={exp} className="text-[8.5px] font-mono font-bold bg-[#050F14] text-brand-green border border-slate-900 px-2 py-0.5 rounded-full">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Comes Alive! & Call to Start (span 3) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-center text-left">
          
          {/* Main Hero Promotion */}
          <div className="bg-[#111827]/40 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#6EE7B7] uppercase px-2.5 py-0.5 bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 rounded-full inline-block">
                ACTIVE COMPANION
              </span>
              <h2 className="text-xl font-display font-black text-white tracking-tight pt-1">
                HEALTHMATE COMES ALIVE!
              </h2>
            </div>
            
            <p className="text-xs text-text-second leading-relaxed">
              A fully animated 3D companion who interacts, motivates and makes your health journey fun and engaging.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[#6EE7B7]">
              <span className="text-[10px] font-mono">✦ Idle, walk, jump, wave modes</span>
            </div>
          </div>

          {/* Beautiful Main Onboarding Button matching Let's Get Started -> */}
          <div className="space-y-3 pb-2">
            <button
              onClick={() => {
                playSoundChime(880, 0.4);
                // Trigger onboarding flow
                onGetStarted('register');
              }}
              className="w-full py-4.5 bg-gradient-to-r from-brand-green to-dark-green hover:from-[#6EE787] hover:to-[#059669] text-[#050F14] font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-brand-green/20 flex items-center justify-center gap-2 cursor-pointer border-none"
              id="lets-get-started-main-btn"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

      {/* Symmetrical specification footer line */}
      <div className="text-center border-t border-slate-900/60 pt-4 font-mono text-[9px] text-slate-600 uppercase tracking-widest">
        HealthMate AI Studio Companion Edition • Fully Interactive 3D Avatar Engine • Responsive Master Screen Setup
      </div>
    </div>
  );
}
