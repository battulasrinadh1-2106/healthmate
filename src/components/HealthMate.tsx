import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Central Event Helpers to trigger emotion and speech updates anywhere in the app
export interface HealthMateCommand {
  emotion?: 
    | 'happy' | 'thoughtful' | 'calm' | 'excited' | 'speaking' | 'curious' 
    | 'proud' | 'motivating' | 'walking' | 'concerned' | 'dancing' | 'jumping'
    | 'sleepy' | 'surprised' | 'supportive' | 'celebrating' | 'active' | 'sad'
    | 'achievement' | 'roasting';
  text?: string;
  duration?: number; // optional timeout to revert after
}

// Global dispatcher to easily talk to HealthMate
export const updateHealthMate = (cmd: HealthMateCommand) => {
  window.dispatchEvent(new CustomEvent('healthmate-central-system', { detail: cmd }));
};

export interface HealthMateProps {
  expression?: 
    | 'happy' | 'thoughtful' | 'calm' | 'excited' | 'speaking' | 'curious' 
    | 'proud' | 'motivating' | 'walking' | 'concerned' | 'dancing' | 'jumping'
    | 'sleepy' | 'surprised' | 'supportive' | 'celebrating' | 'active' | 'sad'
    | 'achievement' | 'roasting';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'custom';
  className?: string;
  animate?: boolean;
}

export default function HealthMate({
  expression: initialExpression = 'happy',
  size = 'md',
  className = '',
  animate = true
}: HealthMateProps) {
  const [currentExpression, setCurrentExpression] = useState(initialExpression);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Sync initial expression changes
  useEffect(() => {
    setCurrentExpression(initialExpression);
  }, [initialExpression]);

  // Connect to the central event system for real-time global character state updates
  useEffect(() => {
    const handleCentralEvent = (e: Event) => {
      const customEvent = e as CustomEvent<HealthMateCommand>;
      if (customEvent.detail) {
        const { emotion, text, duration } = customEvent.detail;
        if (emotion) {
          setCurrentExpression(emotion);
        }
        if (text) {
          setSpeechBubbleText(text);
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 2400);
        }

        if (duration) {
          setTimeout(() => {
            setCurrentExpression(initialExpression);
            setSpeechBubbleText('');
          }, duration);
        }
      }
    };

    window.addEventListener('healthmate-central-system', handleCentralEvent);
    return () => {
      window.removeEventListener('healthmate-central-system', handleCentralEvent);
    };
  }, [initialExpression]);

  // Periodic blinking timer loop for organic biological warmth
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, [animate]);

  // Sizing map mapping correctly to components
  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    xxl: 'w-64 h-64',
    custom: 'w-full h-full'
  };
  const sizeClass = sizeMap[size] || sizeMap.md;

  // Eyebrows angles for rich cinematic expression variables
  const eyebrows = useMemo(() => {
    switch (currentExpression) {
      case 'concerned':
      case 'sad':
        // Sad tilted upward in center
        return { leftY: -1.2, rightY: -1.2, leftR: 15, rightR: -15 };
      case 'roasting':
        // One highly raised mocking eyebrow, one focused low eyebrow
        return { leftY: -3.5, rightY: 0.5, leftR: -12, rightR: 10 };
      case 'excited':
      case 'celebrating':
      case 'jumping':
      case 'achievement':
        // High happy arcs
        return { leftY: -2.8, rightY: -2.8, leftR: -6, rightR: 6 };
      case 'thinking':
      case 'thoughtful':
      case 'curious':
        // Confused/quizzical tilt
        return { leftY: -3.2, rightY: -1, leftR: -15, rightR: 12 };
      case 'sleepy':
        // Calm flat drooping brows
        return { leftY: 0.5, rightY: 0.5, leftR: -2, rightR: 2 };
      case 'proud':
      case 'motivating':
        // Confident slight upward tilt
        return { leftY: -1.8, rightY: -1.8, leftR: -8, rightR: 8 };
      default:
        return { leftY: -1.5, rightY: -1.5, leftR: -3, rightR: 3 };
    }
  }, [currentExpression]);

  // Render Pixar-style eye highlights and expressions
  const renderEyes = () => {
    // Blinking or extremely ecstatic closed arcs
    const isClosedStyle = 
      isBlinking || 
      currentExpression === 'happy' || 
      currentExpression === 'celebrating' || 
      currentExpression === 'jumping' ||
      currentExpression === 'dancing' ||
      currentExpression === 'achievement';

    if (isClosedStyle) {
      return (
        <>
          {/* Left crescent eyelash: Thick glossy arc with soft shadow below */}
          <path 
            d="M 31,48.5 Q 37.5,41.5 44,48.5" 
            fill="none" 
            stroke="#111c14" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
          />
          <path 
            d="M 33,48.5 Q 37.5,43 42,48.5" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            opacity="0.4"
          />
          
          {/* Right crescent eyelash */}
          <path 
            d="M 56,48.5 Q 62.5,41.5 69,48.5" 
            fill="none" 
            stroke="#111c14" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
          />
          <path 
            d="M 58,48.5 Q 62.5,43 67,48.5" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            opacity="0.4"
          />
        </>
      );
    }

    if (currentExpression === 'sleepy') {
      return (
        <>
          {/* Sleepy eyes: half-open drooping lids */}
          <g transform="translate(37.5, 48)">
            <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#152e1c" />
            <circle cx="-1" cy="1" r="2.5" fill="url(#shinyEyeIris)" />
            <circle cx="-2" cy="-0.5" r="1.5" fill="#FFFFFF" />
            <path d="M -9,-2.5 Q 0,-3.5 9,-2.5" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
          </g>
          <g transform="translate(62.5, 48)">
            <ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#152e1c" />
            <circle cx="1" cy="1" r="2.5" fill="url(#shinyEyeIris)" />
            <circle cx="2" cy="-0.5" r="1.5" fill="#FFFFFF" />
            <path d="M -9,-2.5 Q 0,-3.5 9,-2.5" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
          </g>
        </>
      );
    }

    // Interactive look vectors for Thinking or curious
    let lookX = 0;
    let lookY = 0;
    if (currentExpression === 'thinking' || currentExpression === 'thoughtful') {
      lookX = -1.2;
      lookY = -1.5;
    } else if (currentExpression === 'curious' || currentExpression === 'surprised') {
      lookY = -0.5;
    } else if (currentExpression === 'roasting') {
      lookX = 1.0;
      lookY = -0.2;
    }

    return (
      <>
        {/* Left Eye Glistening Pod */}
        <g transform="translate(37.5, 48)">
          {/* Outer Black framing shadow/lash */}
          <circle cx="0" cy="0" r="11.5" fill="#0b170e" />
          {/* Jewel-like Gradient Iris */}
          <circle cx={lookX} cy={lookY} r="9.6" fill="url(#shinyEyeIris)" />
          {/* Dense Velvet Pupil */}
          <circle cx={lookX * 1.3} cy={lookY * 1.3} r="6.2" fill="#040c06" />
          
          {/* 5-Point Specular High-Fidelity Reflection Cluster - Pixar/Disney double-glowing eye model */}
          {/* Top-Left large key reflection */}
          <circle cx={(lookX * 1.3) - 3.4} cy={(lookY * 1.3) - 3.4} r="3.4" fill="#FFFFFF" opacity="0.98" />
          {/* Bottom-Right soft warm glow bounce reflection */}
          <ellipse cx={(lookX * 1.3) + 3.2} cy={(lookY * 1.3) + 3.2} rx="2.2" ry="1.4" fill="#FFFFFF" opacity="0.82" />
          {/* Top-Right secondary micro highlight */}
          <circle cx={(lookX * 1.3) + 3.4} cy={(lookY * 1.3) - 2.8} r="1.4" fill="#FFFFFF" opacity="0.85" />
          {/* Bottom-Left accent pin-dot reflection */}
          <circle cx={(lookX * 1.3) - 3.0} cy={(lookY * 1.3) + 3.4} r="1.1" fill="#FFFFFF" opacity="0.90" />
          {/* Sub-Surface Scleral/Iris crescent light bend rim gloss */}
          <path d={`M ${(lookX * 1.3) - 5} ${(lookY * 1.3) + 4} A 6.8 6.8 0 0 0 ${(lookX * 1.3) + 5} ${(lookY * 1.3) + 4}`} fill="none" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.45" strokeLinecap="round" />
        </g>

        {/* Right Eye Glistening Pod */}
        <g transform="translate(62.5, 48)">
          {currentExpression === 'roasting' ? (
            // Winking sassy right eye for roasting
            <g transform="translate(0, 1.5)">
              <path d="M -8,-2 Q 0,4 8,-2" fill="none" stroke="#0b170e" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M -5,-3 Q 0,1 5,-3" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
            </g>
          ) : (
            <>
              {/* Full glittering eye */}
              <circle cx="0" cy="0" r="11.5" fill="#0b170e" />
              <circle cx={lookX} cy={lookY} r="9.6" fill="url(#shinyEyeIris)" />
              <circle cx={lookX * 1.3} cy={lookY * 1.3} r="6.2" fill="#040c06" />
              
              {/* 5-Point Specular High-Fidelity Reflection Cluster */}
              {/* Top-Left large key reflection */}
              <circle cx={(lookX * 1.3) - 3.4} cy={(lookY * 1.3) - 3.4} r="3.4" fill="#FFFFFF" opacity="0.98" />
              {/* Bottom-Right soft warm glow bounce reflection */}
              <ellipse cx={(lookX * 1.3) + 3.2} cy={(lookY * 1.3) + 3.2} rx="2.2" ry="1.4" fill="#FFFFFF" opacity="0.82" />
              {/* Top-Right secondary micro highlight */}
              <circle cx={(lookX * 1.3) + 3.4} cy={(lookY * 1.3) - 2.8} r="1.4" fill="#FFFFFF" opacity="0.85" />
              {/* Bottom-Left accent pin-dot reflection */}
              <circle cx={(lookX * 1.3) - 3.0} cy={(lookY * 1.3) + 3.4} r="1.1" fill="#FFFFFF" opacity="0.90" />
              {/* Sub-Surface Scleral/Iris crescent light bend rim gloss */}
              <path d={`M ${(lookX * 1.3) - 5} ${(lookY * 1.3) + 4} A 6.8 6.8 0 0 0 ${(lookX * 1.3) + 5} ${(lookY * 1.3) + 4}`} fill="none" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.45" strokeLinecap="round" />
            </>
          )}
        </g>
      </>
    );
  };

  // Render premium high-fidelity mouth geometries with teeth and tongue
  const renderMouth = () => {
    switch (currentExpression) {
      case 'sad':
      case 'concerned':
        // Downcast pout
        return (
          <path 
            d="M 45,58.5 Q 50,55 55,58.5" 
            fill="none" 
            stroke="#300305" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
        );
      
      case 'roasting':
        // Cheeky sassy side-smirk showing tongue tip
        return (
          <g transform="translate(50, 56.5)">
            {/* Dark background backing */}
            <path d="M -4.5,-0.5 Q 2,2.5 5,-1.5 Z" fill="#580816" stroke="#2c0205" strokeWidth="1.2" />
            {/* Pink tongue poking out */}
            <path d="M -1.5,1 Q 1,3.2 3.5,0.8" fill="#f43f5e" />
          </g>
        );

      case 'thinking':
      case 'thoughtful':
        // Pensive smirk tucked to the side
        return (
          <path 
            d="M 46,57.5 Q 48,59 52.5,56" 
            fill="none" 
            stroke="#300305" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        );

      case 'sleepy':
        // Small cute vertical yawning circle
        return (
          <ellipse cx="50" cy="58" rx="2.5" ry="3.5" fill="#4c0519" stroke="#1c0003" strokeWidth="1.2" />
        );

      case 'curious':
      case 'surprised':
        // High-contrast vertical gasp vertical oval showing inner throat depth
        return (
          <g transform="translate(50, 57.5)">
            <ellipse cx="0" cy="0" rx="4.5" ry="5.8" fill="#4c0519" stroke="#1c0003" strokeWidth="1.5" />
            {/* Cute pink tongue inside oval */}
            <ellipse cx="0" cy="3.5" rx="3.2" ry="1.8" fill="#f43f5e" />
          </g>
        );

      case 'excited':
      case 'celebrating':
      case 'jumping':
      case 'dancing':
      case 'achievement':
        // Wide happy open mouth with a row of teeth and a cheerful tongue
        return (
          <g transform="translate(50, 56.5)">
            {/* Main Mouth Frame (Crescent wide open) */}
            <path 
              d="M -5.5,-1 C -5.5,5.5 5.5,5.5 5.5,-1" 
              fill="#5c0617" 
              stroke="#2c0205" 
              strokeWidth="2.0" 
              strokeLinejoin="round" 
              className="fill-current"
            />
            {/* Upper infant teeth line */}
            <path d="M -4.5,0 L 4.5,0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Happy tongue in the bottom crescent */}
            <path d="M -3,2.2 C -1,5 1,5 3,2.2 Q 0,4.4 -3,2.2" fill="#f43f5e" />
          </g>
        );

      case 'speaking':
      case 'motivating':
      case 'proud':
        // Friendly speaking asymmetric mouth showing a touch of teeth
        return (
          <g transform="translate(50, 57)">
            <path d="M -4.8,0 Q 0,4 4.8,0 Z" fill="#6b071a" stroke="#2c0205" strokeWidth="1.5" />
            <path d="M -3.5,0.5 L 3.5,0.5" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>
        );

      case 'happy':
      default:
        // Sweet rosy toddler crescent smile
        return (
          <path 
            d="M 45,56.8 Q 50,60.5 55,56.8" 
            fill="none" 
            stroke="#300305" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
        );
    }
  };

  const zzzElements = (currentExpression === 'sleepy' && animate) ? (
    <g>
      <motion.text
        x="77" y="22" fill="#84cc16" fontSize="11" fontFamily="sans-serif" fontWeight="900"
        animate={{ opacity: [0, 1, 0], y: [22, 6, 22], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        z
      </motion.text>
      <motion.text
        x="85" y="12" fill="#a3e635" fontSize="14" fontFamily="sans-serif" fontWeight="950"
        animate={{ opacity: [0, 1, 0], y: [12, -10, 12], scale: [0.7, 1.3, 0.7] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      >
        Z
      </motion.text>
    </g>
  ) : null;

  const achievementSparkles = (currentExpression === 'achievement' && animate) ? (
    <g>
      <motion.text
        x="18" y="26" fill="#fbbf24" fontSize="14" fontFamily="sans-serif" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], scale: [0.6, 1.5, 0.6], y: [26, 12, 26], rotate: [0, 180, 360] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✦
      </motion.text>
      <motion.text
        x="84" y="28" fill="#fbbf24" fontSize="16" fontFamily="sans-serif" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.6, 0.5], y: [28, 10, 28], rotate: [0, -180, -360] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        ✦
      </motion.text>
    </g>
  ) : null;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`} id="healthmate-custom-mascot-pod">
      
      {/* Central speech bubble positioned below shadow */}
      <AnimatePresence>
        {speechBubbleText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            className="absolute top-[105%] bg-[#061009]/98 border border-emerald-500/30 px-4 py-3 rounded-2xl shadow-2xl text-center max-w-[230px] min-w-[150px] z-50 text-[11px] font-sans font-extrabold leading-relaxed text-[#f1f5f9]"
          >
            {speechBubbleText}
            <div className="absolute bottom-[98%] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#061009] border-l border-t border-emerald-500/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vector Stage Wrapper */}
      <div className={`${sizeClass} relative flex items-center justify-center`}>
        
        {/* Soft magical background ambiance glow vectors */}
        <div className="absolute inset-1.5 bg-gradient-to-tr from-emerald-400/[0.13] to-lime-400/[0.08] rounded-full filter blur-xl opacity-90 pointer-events-none -z-10" />

        <motion.svg
          id="healthmate-vector-character"
          viewBox="0 0 100 115"
          className="w-full h-full overflow-visible"
          animate={
            animate
              ? currentExpression === 'dancing'
                ? {
                    y: [0, -5, 0, -3, 0],
                    rotate: [0, -4, 4, -2, 0],
                    scaleX: [1, 0.98, 1.02, 0.99, 1],
                  }
                : currentExpression === 'jumping' || currentExpression === 'celebrating'
                  ? {
                    y: [0, -11, 0],
                    scaleY: [1, 0.9, 1.06, 1],
                    scaleX: [1, 1.05, 0.96, 1],
                  }
                  : {
                    // Continuous gentle natural breathing system
                    y: [0, -1.5, 0],
                    scaleY: [1, 1.018, 1],
                    scaleX: [1, 0.993, 1],
                    rotate: (currentExpression === 'thinking' || currentExpression === 'thoughtful') ? [0, -2.5, -2.5] : [0, 0, 0]
                  }
              : {}
          }
          transition={
            currentExpression === 'dancing'
              ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              : currentExpression === 'jumping' || currentExpression === 'celebrating'
                ? { duration: 0.9, repeat: Infinity, ease: 'easeOut' }
                : { duration: currentExpression === 'sleepy' ? 4.0 : 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          
          <defs>
            {/* Wholesome Pixar Peach Skin Gradient */}
            <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF3EE" />
              <stop offset="65%" stopColor="#FFE0D9" />
              <stop offset="100%" stopColor="#FDB5AC" />
            </linearGradient>

            {/* Rosy blush cheeks gradient */}
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FB6F84" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#FB6F84" stopOpacity="0" />
            </radialGradient>

            {/* Smooth lush lime-to-forest hair coloring */}
            <linearGradient id="cuteHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bef264" /> {/* lime-300 */}
              <stop offset="65%" stopColor="#84cc16" /> {/* lime-500 */}
              <stop offset="100%" stopColor="#3f6212" /> {/* lime-800 */}
            </linearGradient>

            {/* Soft high-key crown reflection */}
            <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2fec4" />
              <stop offset="100%" stopColor="#a3e635" />
            </linearGradient>

            {/* White hoodie rich gray fabric shading */}
            <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Sprout leaf radial gradient */}
            <linearGradient id="leafGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>

            {/* Glistening irises */}
            <radialGradient id="shinyEyeIris" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#e2faf2" />
              <stop offset="45%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#044d27" />
            </radialGradient>

            {/* Soft drop padding floor shadow */}
            <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>

            {/* Sneaker Green Grad */}
            <linearGradient id="sneakerGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          {/* BASE SHADOW */}
          <ellipse 
            cx="50" 
            cy="110" 
            rx="18" 
            ry="2.8" 
            fill="url(#floorShadow)" 
            className="transition-all duration-300"
          />

          {/* --- GREEN SNEAKERS & LEGS (Proportional layout matching reference) --- */}
          <g id="mascot-sneakers-legs">
            {/* Short chunky peach skin legs */}
            <rect x="38.5" y="94" width="5.5" height="7.5" rx="2.5" fill="url(#bodySkinGrad)" />
            <rect x="56" y="94" width="5.5" height="7.5" rx="2.5" fill="url(#bodySkinGrad)" />

            {/* Left Sneaker */}
            <path
              d="M 32,109.5 C 32,103.5 44,101 45,106.5 C 45,110 32,111 32,109.5 Z"
              fill="url(#sneakerGreenGrad)"
              stroke="#14532d"
              strokeWidth="0.5"
            />
            {/* White Sole Accent */}
            <path d="M 31.8,109 Q 38,110.5 44.8,108.5" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            {/* White Laces */}
            <line x1="36" y1="104.5" x2="41" y2="106" stroke="#FFFFFF" strokeWidth="1.0" strokeLinecap="round" />

            {/* Right Sneaker */}
            <path
              d="M 68,109.5 C 68,103.5 56,101 55,106.5 C 55,110 68,111 68,109.5 Z"
              fill="url(#sneakerGreenGrad)"
              stroke="#14532d"
              strokeWidth="0.5"
            />
            <path d="M 68.2,109 Q 62,110.5 55.2,108.5" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="64" y1="104.5" x2="59" y2="106" stroke="#FFFFFF" strokeWidth="1.0" strokeLinecap="round" />
          </g>

          {/* --- GREEN SHORTS --- */}
          <g id="mascot-shorts">
            <rect x="35" y="88" width="30" height="7.2" rx="2" fill="#15803d" />
            <line x1="50" y1="88" x2="50" y2="94" stroke="#14532d" strokeWidth="1" />
          </g>

          {/* --- COZY WHITE HOODIE (Main Body) --- */}
          <g id="mascot-white-hoodie">
            {/* Hoodie outer silhouette contour shadow */}
            <path
              d="M 31,70 C 31,64 69,64 69,70 C 69,82 64,90 50,90 C 36,90 31,82 31,70 Z"
              fill="url(#hoodieGrad)"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />

            {/* Dynamic visual Hoodie Strings */}
            <path d="M 44.5,69 L 44,79.5" fill="none" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="44" cy="79.5" r="1.5" fill="#15803d" />
            
            <path d="M 55.5,69 L 56,79.5" fill="none" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="56" cy="79.5" r="1.5" fill="#15803d" />

            {/* Brand Emblem: Green Heart logo with "HealthMate" printed */}
            <g transform="translate(50, 77)">
              <path
                d="M 0,-4 C -1.5,-6 -4.5,-6 -6,-4 C -7,-2.5 -7,-0.5 -4,2.5 L 0,6 L 4,2.5 C 7,-0.5 7,-2.5 6,-4 C 4.5,-6 1.5,-6 0,-4 Z"
                fill="#16a34a"
              />
              <circle cx="0" cy="-0.5" r="1.3" fill="#bef264" />
              <text x="0" y="10.2" fill="#14532d" fontSize="3" fontFamily="sans-serif" fontWeight="950" textAnchor="middle" letterSpacing="0.2">
                HealthMate
              </text>
            </g>
          </g>

          {/* --- COMPANION PORTRAIT HEAD & ROSY CHEEKS --- */}
          <g id="mascot-head">
            {/* Neck connection shadow */}
            <rect x="46.5" y="60" width="7" height="6.5" rx="3.5" fill="url(#bodySkinGrad)" />

            {/* Chubby Round Pear Baby Face shape exactly from references */}
            <path
              d="M 30,45 
                 C 30,34.2 37.8,31.2 50,31.2 
                 C 62.2,31.2 70,34.2 70,45 
                 C 70,55.5 61.8,60.5 50,60.5 
                 C 38.2,60.5 30,55.5 30,45 Z"
              fill="url(#bodySkinGrad)"
              stroke="#fb7185"
              strokeWidth="0.4"
            />

            {/* Beautiful chubby rosy blush cheeks */}
            <ellipse cx="34.5" cy="52" rx="4.5" ry="2.5" fill="url(#cheekBlush)" />
            <ellipse cx="65.5" cy="52" rx="4.5" ry="2.5" fill="url(#cheekBlush)" />

            {/* Subtle perky infant nose button */}
            <path d="M 49.2,50.8 Q 50,51.8 50.8,50.8" fill="none" stroke="#fb7185" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* --- SMOOTH SEEDLING GREEN HAIR --- */}
          <g id="mascot-green-hair">
            {/* Back Hair Frame enclosing the peach head */}
            <path
              d="M 27.5,42 C 27.5,25.5 72.5,25.5 72.5,42 C 72.5,60 67.5,61.5 67.5,61.5 L 32.5,61.5 C 32.5,61.5 27.5,60 27.5,42 Z"
              fill="url(#cuteHairGrad)"
            />

            {/* Lock sweeps sideburn tabs framing the cheeks */}
            <path d="M 28.5,40.5 Q 24,51 27.5,55 C 29,51 30.5,46.5 28.5,40.5 Z" fill="url(#cuteHairGrad)" />
            <path d="M 71.5,40.5 Q 76,51 72.5,55 C 71,51 69.5,46.5 71.5,40.5 Z" fill="url(#cuteHairGrad)" />

            {/* Top crown hair highlight gloss line */}
            <path
              d="M 29.5,39 C 33.5,28.5 41.5,27.5 50,29 C 58.5,27.5 66.5,28.5 70.5,39 C 64.5,34.2 57.5,31.8 50,33.5 C 42.5,31.8 35.5,34.2 29.5,39 Z"
              fill="url(#hairHighlight)"
            />

            {/* Clean side-sweeping front toddler bangs */}
            <path d="M 29.5,39 Q 42,39.5 46,45 L 42.5,34.5 Z" fill="url(#cuteHairGrad)" />
            <path d="M 70.5,39 Q 58,39.5 54,45 L 57.5,34.5 Z" fill="url(#cuteHairGrad)" />
          </g>

          {/* --- MULTI-LEAF CROWN SPROUT (Wind sways) --- */}
          <motion.g
            id="sacred-hair-sprout"
            transform="translate(50, 28) scale(1)"
            animate={animate ? { rotate: [-2, 3.5, -3.5, 2, -2] } : {}}
            transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '0px', originY: '2px' }}
          >
            {/* Woody brown seedling stem */}
            <path d="M 0,2.5 L 0,-15.5" fill="none" stroke="#2a1805" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Primary Left Sprout Leaf */}
            <path
              d="M 0,-15.5 C -6.2,-18.5 -12.5,-12.5 -11.2,-6.2 C -10,-1.8 -4.2,-7 0,-15.5 Z"
              fill="url(#leafGreenGrad)"
              stroke="#bef264"
              strokeWidth="0.6"
            />
            {/* Leaf Vein line */}
            <path d="M -2,-13.2 Q -6,-8 -6,-8" fill="none" stroke="#d9f99d" strokeWidth="0.8" />

            {/* Primary Right Sprout Leaf */}
            <path
              d="M 0,-15.5 C 6.2,-18.5 12.5,-12.5 11.2,-6.2 C 10,-1.8 4.2,-7 0,-15.5 Z"
              fill="url(#leafGreenGrad)"
              stroke="#bef264"
              strokeWidth="0.6"
            />
            <path d="M 2,-13.2 Q 6,-8 6,-8" fill="none" stroke="#d9f99d" strokeWidth="0.8" />

            {/* Small central third center baby leaf sprout */}
            <path
              d="M 0,-15.5 C -3,-19.5 3,-19.5 0,-15.5 Z"
              fill="#bef264"
              stroke="#15803d"
              strokeWidth="0.4"
            />
          </motion.g>

          {/* --- DYNAMIC TWITCHING EYEBROWS --- */}
          <g id="eyebrows-dynamic" className="transition-all duration-300">
            <motion.path
              d="M 32,39 Q 36.5,35.5 41,39"
              fill="none"
              stroke="#1c0003"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={animate ? { y: eyebrows.leftY, rotate: eyebrows.leftR } : {}}
              style={{ originX: '36.5px', originY: '38px' }}
            />
            <motion.path
              d="M 59,39 Q 63.5,35.5 68,39"
              fill="none"
              stroke="#1c0003"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={animate ? { y: eyebrows.rightY, rotate: eyebrows.rightR } : {}}
              style={{ originX: '63.5px', originY: '38px' }}
            />
          </g>

          {/* --- ULTRA GLOSSY EYE ENGINE --- */}
          <g id="glistening-eyes-engine">
            {renderEyes()}
          </g>

          {/* --- DYNAMIC MOUTH HOLLOW ENGINE --- */}
          <g id="expressive-mouth-engine">
            {renderMouth()}
          </g>

          {/* --- DYNAMIC COSY SLEEVES AND HANDS --- */}
          <g id="mascot-arms">
            {/* Left Hand: raises to chin when thinking, reacts with joy on jumps */}
            <motion.g
              id="mascot-left-arm"
              className="transition-all duration-300"
              animate={
                animate && (currentExpression === 'thinking' || currentExpression === 'thoughtful' || currentExpression === 'curious')
                  ? { y: [-1, -4], x: [0, 4.5], rotate: [0, 50] }
                  : animate && (currentExpression === 'dancing' || currentExpression === 'excited' || currentExpression === 'celebrating' || currentExpression === 'jumping')
                    ? { rotate: [0, 72, -12, 72, 0], y: [0, -5, 0] }
                    : {}
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '28px', originY: '71px' }}
            >
              {/* Cozy sleeve puffed */}
              <path d="M 31.5,71.5 C 23.5,71.5 20.5,79 25.5,82 C 29.5,83 32.5,78.5 31.5,71.5 Z" fill="url(#hoodieGrad)" stroke="#94a3b8" strokeWidth="0.4" />
              {/* Hands peach */}
              <circle cx="23" cy="80.5" r="3.2" fill="url(#bodySkinGrad)" />
            </motion.g>

            {/* Right Hand: Waves on speaks, waves on custom triggers */}
            <motion.g
              id="mascot-right-arm"
              className="transition-all duration-300"
              animate={
                isWaving || currentExpression === 'speaking' || currentExpression === 'motivating'
                  ? {
                      rotate: [0, -82, -45, -82, -45, 0],
                      y: [0, -6, -2, -6, -2, 0]
                    }
                  : animate && (currentExpression === 'dancing' || currentExpression === 'excited' || currentExpression === 'celebrating' || currentExpression === 'jumping')
                    ? { rotate: [0, -72, 12, -72, 0], y: [0, -5, 0] }
                    : {}
              }
              transition={{ duration: 1.7, ease: 'easeInOut', repeat: isWaving ? 1 : 0 }}
              style={{ originX: '69px', originY: '71px' }}
            >
              {/* Cozy sleeve puffed */}
              <path d="M 68.5,71.5 C 76.5,71.5 79.5,79 74.5,82 C 70.5,83 67.5,78.5 68.5,71.5 Z" fill="url(#hoodieGrad)" stroke="#94a3b8" strokeWidth="0.4" />
              {/* Hand */}
              <circle cx="77" cy="80.5" r="3.2" fill="url(#bodySkinGrad)" />
            </motion.g>
          </g>

          {/* Sleep particles if sleepy */}
          {zzzElements}

          {/* Sparkles if celebrating / achievement */}
          {achievementSparkles}

        </motion.svg>
      </div>
    </div>
  );
}
