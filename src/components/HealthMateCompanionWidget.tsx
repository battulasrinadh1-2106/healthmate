import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';
import HealthMateMascot from './HealthMateMascot';

export default function HealthMateCompanionWidget() {
  const [mascotName, setMascotName] = useState<string>(() => {
    return localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
  });
  
  const getCompanionNameLabel = (name: string): string => {
    const trimmed = (name || '').trim();
    if (!trimmed || trimmed === 'HealthMate') {
      return 'HealthMate 🌱';
    }
    return `${trimmed} the HealthMate 🌱`;
  };

  const [text, setText] = useState<string>(`Hi! I'm your ${getCompanionNameLabel(localStorage.getItem('healthmate_mascot_name') || 'HealthMate')}`);
  const [mood, setMood] = useState<'happy' | 'thoughtful' | 'active' | 'calm' | 'excited' | 'speaking'>("happy");
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [lastTab, setLastTab] = useState<string>('');

  // Monitor storage and custom changes to mascot name
  useEffect(() => {
    const handleNameChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setMascotName(customEvent.detail);
        setText(prev => prev.replace(/HealthMate/g, customEvent.detail).replace(/companion/g, customEvent.detail));
      }
    };
    window.addEventListener('healthmate-name-changed', handleNameChange);
    return () => window.removeEventListener('healthmate-name-changed', handleNameChange);
  }, []);

  // Monitor the global 'aura-buddy' event to synchronize messages and states dynamically
  useEffect(() => {
    const handleBuddyEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        let isNewTab = false;
        
        if (customEvent.detail.tab && customEvent.detail.tab !== lastTab) {
          isNewTab = true;
          setLastTab(customEvent.detail.tab);
          setIsDismissed(false); // Reset dismissal on transition to a completely new screen tab
        }

        if (customEvent.detail.text) {
          let cleanText = customEvent.detail.text;
          const currentMascotName = localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
          cleanText = cleanText.replace(/Aura/g, currentMascotName);
          cleanText = cleanText.replace(/Buddy/g, currentMascotName);
          cleanText = cleanText.replace(/HealthMate/g, currentMascotName);

          setText(cleanText);
          
          // Only automatically show the bubble if the tab changed, OR if they haven't closed it yet!
          // This avoids the system acting like a repetitive popup notification on every live state count update.
          if (isNewTab || !isDismissed) {
            setShowBubble(true);
          }
        }
        
        if (customEvent.detail.mood) {
          const m = customEvent.detail.mood;
          if (m === 'keep_going' || m === 'active') {
            setMood('active');
          } else if (m === 'thinking' || m === 'thoughtful') {
            setMood('thoughtful');
          } else if (m === 'calm') {
            setMood('calm');
          } else if (m === 'excited' || m === 'celebration') {
            setMood('excited');
          } else {
            setMood('speaking');
          }
        }
      }
    };

    window.addEventListener('aura-buddy', handleBuddyEvent);
    return () => {
      window.removeEventListener('aura-buddy', handleBuddyEvent);
    };
  }, [lastTab, isDismissed]);

  const handleCloseBubble = () => {
    setIsDismissed(true);
    setShowBubble(false);
  };

  const handleMascotClick = () => {
    const nextShow = !showBubble;
    setShowBubble(nextShow);
    if (nextShow) {
      setIsDismissed(false); // Re-engaging with mascot restores active bubble listening
    } else {
      setIsDismissed(true);
    }
    setMood(prev => prev === 'happy' ? 'excited' : 'happy');
  };

  return (
    <div className="fixed bottom-22 right-4 z-50 pointer-events-none select-none" id="healthmate-floating-wrapper">
      <div className="flex flex-col items-end gap-2.5 relative">
        {/* Animated Speech Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-slate-900/95 border border-slate-800/90 text-slate-100 p-3.5 rounded-2xl shadow-xl max-w-[220px] pointer-events-auto relative text-left whitespace-pre-line"
              id="healthmate-speech-bubble"
            >
              {/* Little triangle arrow point towards character */}
              <div className="absolute bottom-[-6px] right-7 w-3 h-3 bg-slate-900 border-r border-b border-slate-800/90 rotate-45" />
              
              <div className="flex justify-between items-start gap-1 pb-1 border-b border-slate-850/60 mb-1.5">
                <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">
                  {getCompanionNameLabel(mascotName)}
                </span>
                <button
                  onClick={handleCloseBubble}
                  className="p-0.5 rounded-md hover:bg-slate-850 text-slate-500 hover:text-slate-300 cursor-pointer"
                  title="Close tips"
                >
                  <X className="w-3" />
                </button>
              </div>

              <p className="text-[11.5px] font-sans leading-normal text-slate-200">
                {text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Draggable Draggable Character */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.15}
          whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
          whileHover={{ scale: 1.04 }}
          onClick={handleMascotClick}
          className="w-16 h-16 pointer-events-auto cursor-grab rounded-full flex items-center justify-center relative shadow-lg shadow-emerald-950/25 bg-slate-950/40"
          id="healthmate-floating-character"
          title="Drag me! Click to show advice."
        >
          {/* Subtle glowing ring background in idle status */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse pointer-events-none" />
          
          <HealthMateMascot size="sm" expression={mood} />
          
          {/* Floating tiny dialog trigger indicator when bubble starts closed */}
          {!showBubble && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-slate-950 text-slate-950 flex items-center justify-center shadow-md animate-bounce"
            >
              <MessageCircle className="w-3" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
