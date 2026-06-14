import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, Shield, Mail, Key, CheckCircle } from 'lucide-react';
import HealthMateMascot from './HealthMateMascot';
import { apiFetch } from '../lib/api';

interface AuthProps {
  onSuccess: (user: any, isNewSignup: boolean) => void;
  onBack: () => void;
}

export default function Auth({ onSuccess, onBack }: AuthProps) {
  const [screen, setScreen] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [timerKey, setTimerKey] = useState<number>(0);

  React.useEffect(() => {
    if (screen !== 'otp') return;

    setTimeLeft(180);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, timerKey]);

  React.useEffect(() => {
    if (screen === 'otp' && timeLeft === 0) {
      setErrorMsg("Your verification code has expired. Please request a new code.");
    }
  }, [timeLeft, screen]);

  const elapsed = 180 - timeLeft;
  const resendCooldown = Math.max(0, 30 - elapsed);
  const isResendDisabled = resendCooldown > 0 && timeLeft > 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    playInteractiveSound(580, 0.08);

    try {
      const response = await apiFetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Unable to send verification email.");
      }

      setOtp('');
      setTimerKey((k) => k + 1);
      setSuccessMsg("We've sent a new verification code. Please check your inbox.");
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Play pleasant click/confirm UI feedback chime
  const playInteractiveSound = (frequency: number, duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency + 150, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch {}
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    playInteractiveSound(580, 0.08);

    try {
      const response = await apiFetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Unable to send verification email.");
      }

      setScreen('otp');
      setSuccessMsg("We've sent a secure verification code to your email. This code expires in 3 minutes.");
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setErrorMsg("Your verification code has expired. Please request a new code.");
      return;
    }
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    playInteractiveSound(780, 0.12);

    try {
      const response = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          otp: otp.trim(),
        }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Incorrect or expired verification code.");
      }

      onSuccess(resJson.data, resJson.isNewSignup);
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    playInteractiveSound(440, 0.08);
    setScreen('email');
    setOtp('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Determine Mascot guidance texts and mood animations based on current step
  const mascotText = screen === 'email' 
    ? "Hi 👋\nEnter your email and I'll send your secure login code."
    : "Check your inbox 📩\nWe've sent a secure verification code to your email.\nThis code expires in 3 minutes.";

  const mascotExpression = screen === 'email' ? 'happy' : 'excited';

  return (
    <div className="min-h-screen bg-bg-obsidian text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans select-none">
      {/* Decorative Ambiance Background Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#10b981]/5 blur-[120px] pointer-events-none" />

      {/* Auth Card Symmetrical Frame */}
      <motion.div 
        key={screen}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[360px] bg-card-obsidian border border-slate-900 rounded-3xl p-6 space-y-6 shadow-2xl relative"
      >
        {/* Symmetric Back Link */}
        <button 
          onClick={screen === 'email' ? onBack : handleBackToEmail}
          type="button"
          className="absolute top-5 left-5 text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Safe Badge indicator */}
        <div className="absolute top-5 right-5 text-[9px] font-mono select-none px-2 py-0.5 rounded bg-emerald-500/10 text-brand-green border border-emerald-500/10 font-bold uppercase tracking-wider flex items-center gap-1">
          <Shield className="w-2.5 h-2.5" />
          <span>Passwordless</span>
        </div>

        {/* Mascot bubble stage & text speech balloon */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="relative w-28 h-28 rounded-full bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-2 shadow-xl shadow-brand-green/5 overflow-visible">
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-brand-green/15 to-transparent blur-xs animate-pulse" />
            
            {/* HealthMate Mascot Character */}
            <div className="absolute -bottom-1">
              <HealthMateMascot size="xl" expression={mascotExpression} animate={true} />
            </div>
            {/* Ambient soft glow platform */}
            <div className="absolute bottom-1 w-16 h-2 bg-brand-green/30 rounded-full blur-sm pointer-events-none" />
          </div>

          {/* Symmetrical Speech balloon context */}
          <div className="bg-[#050F14]/70 border border-slate-900 py-3 px-4 rounded-2xl w-full max-w-[310px] relative">
            <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-900" />
            <p className="text-[11.5px] leading-relaxed text-slate-300 font-sans font-medium whitespace-pre-line">
              {mascotText}
            </p>
          </div>
        </div>

        {/* Notification Status boards */}
        {successMsg && (
          <div className="flex gap-2 items-start p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs animate-fadeIn whitespace-pre-line">
            <CheckCircle className="w-4.5 h-4.5 shrink-0 text-brand-green mt-0.5" />
            <span className="font-medium leading-normal text-slate-100">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex gap-2 items-start p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs animate-headShake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium leading-normal">{errorMsg}</span>
          </div>
        )}

        {/* Forms Rendering block based on Screen State */}
        {screen === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-[#050B14] border border-slate-900 focus:border-brand-green/50 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-sans"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 pt-0.5 leading-normal">
                If you don't have an account, one will be created for you automatically.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-green hover:bg-dark-green text-slate-950 rounded-2xl text-xs font-sans font-black uppercase tracking-widest transition-all shadow-md shadow-brand-green/10 cursor-pointer border-none mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending Code..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
                Enter Verification Code
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456" 
                  className="w-full bg-[#050B14] border border-slate-900 focus:border-brand-green/50 rounded-xl pl-10 pr-3.5 py-3 text-center tracking-[0.75em] font-mono text-sm text-brand-green placeholder-slate-700 focus:outline-none transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                  <Key className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Symmetrical Timer and Resend Actions Block */}
            <div className="flex justify-between items-center text-xs py-1 px-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expires in:</span>
                <span className={`font-mono font-black tracking-wide text-xs ${timeLeft === 0 ? 'text-red-500 animate-pulse' : 'text-brand-green'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                type="button"
                disabled={isResendDisabled || isLoading}
                onClick={handleResendOtp}
                className={`text-[10px] font-bold uppercase tracking-wider transition-all bg-transparent border-none cursor-pointer ${
                  isResendDisabled 
                    ? 'text-slate-600 cursor-not-allowed' 
                    : 'text-brand-green hover:text-emerald-300 font-sans'
                }`}
              >
                {isResendDisabled 
                  ? `Resend in ${resendCooldown}s` 
                  : "Resend Code"}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || timeLeft === 0}
              className={`w-full py-3.5 text-slate-950 rounded-2xl text-xs font-sans font-black uppercase tracking-widest transition-all shadow-md cursor-pointer border-none mt-2 ${
                timeLeft === 0 
                  ? 'bg-slate-800 text-slate-500 shadow-none cursor-not-allowed' 
                  : 'bg-brand-green hover:bg-dark-green shadow-[#10b981]/15'
              }`}
            >
              {isLoading ? "Validating Session..." : "Verify OTP"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-[11px] text-slate-500 hover:text-brand-green font-sans font-bold transition-colors bg-transparent border-none cursor-pointer"
              >
                Change Email Address
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
