import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Flame, 
  ChevronRight, 
  RefreshCw, 
  Send,
  HelpCircle,
  Activity,
  Smile,
  Coffee,
  Moon,
  Droplet,
  Info,
  Mail,
  ShieldAlert,
  Award,
  Compass,
  Lock,
  Unlock,
  Archive,
  Calendar,
  Hourglass,
  BadgeAlert
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerCompanion, triggerCompanionQuote } from '../utils/companion';
import HealthMateMascot from './HealthMateMascot';
import { apiFetch } from '../lib/api';

interface FutureTabProps {
  profile: UserProfile;
  steps: number;
  bmiClassification: string;
  userId?: string;
}

interface ChatMessage {
  id: string;
  sender: 'mascot' | 'user';
  text: string;
  timestamp: string;
  type?: 'normal' | 'boost' | 'roast';
  imageUrl?: string;
}

export default function FutureTab({ profile, steps, bmiClassification, userId }: FutureTabProps) {
  // English / Telugu language selector state saved in localStorage
  const [labsLang, setLabsLang] = useState<'en' | 'te'>(() => {
    return (localStorage.getItem('healthmate_labs_lang') as 'en' | 'te') || 'en';
  });

  // Tabs for forecasting vs food roasting
  const [activeSegment, setActiveSegment] = useState<'projections' | 'roaster'>('projections');
  
  // Custom Time Interval Selector State (3M, 6M, 1Y, 5Y)
  const [selectedInterval, setSelectedInterval] = useState<'3M' | '6M' | '1Y' | '5Y'>('1Y');

  // Interactive Habit Modifiers
  const [waterIntake, setWaterIntake] = useState<number>(2.5); // Liters
  const [sleepHours, setSleepHours] = useState<number>(7); // Hours
  const [weeklySteps, setWeeklySteps] = useState<number>(steps > 100 ? steps : 6500);

  // Trigger contextual speech balloons when switching tabs/activities
  useEffect(() => {
    if (activeSegment === 'projections') {
      triggerCompanionQuote('trackerPreview', 'excited');
    } else if (activeSegment === 'roaster') {
      triggerCompanionQuote('aiChat', 'speaking');
    }
  }, [activeSegment]);

  // Trigger companion updates debounced on habit modification updates
  useEffect(() => {
    if (waterIntake === 2.5 && sleepHours === 7) return;
    const t = setTimeout(() => {
      triggerCompanionQuote('water', 'calm');
    }, 1200);
    return () => clearTimeout(t);
  }, [waterIntake, sleepHours, weeklySteps]);

  // ChatBot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isTe = (localStorage.getItem('healthmate_labs_lang') || 'en') === 'te';
    return [
      {
        id: 'initial',
        sender: 'mascot',
        text: isTe ? "Ee roju em thinnnav mama? 🍔🍕🥗 Healthy fruit thinnava leda heavy cheat meal stomach lo vesava, cheppu proper ga roast chesta! 😂🔥" : "Tell me what you are eating today! 🍔🍕🥗 Let me praise your healthy traits or roast your guilty cheat meals! 🔥✨",
        timestamp: timeStr,
        type: 'normal'
      }
    ];
  });
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync initial message if language changes
  useEffect(() => {
    localStorage.setItem('healthmate_labs_lang', labsLang);
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'initial') {
        return [
          {
            id: 'initial',
            sender: 'mascot',
            text: labsLang === 'te' ? "Ee roju em thinnnav mama? 🍔🍕🥗 Healthy fruit thinnava leda heavy cheat meal stomach lo vesava, cheppu proper ga roast chesta! 😂🔥" : "Tell me what you are eating today! 🍔🍕🥗 Let me praise your healthy traits or roast your guilty cheat meals! 🔥✨",
            timestamp: prev[0].timestamp,
            type: 'normal'
          }
        ];
      }
      return prev;
    });
  }, [labsLang]);

  // Scroll logic
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Derived user base metrics
  const calculatedBmi = useMemo(() => {
    if (!profile.height || !profile.weight) return 22.4;
    return Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10;
  }, [profile]);

  // Dynamic Multi-variable Forecasting simulation
  const predictionsMap = useMemo(() => {
    const isWOver = bmiClassification.toLowerCase().includes('overweight') || bmiClassification.toLowerCase().includes('obese') || bmiClassification.toLowerCase().includes('obesity') || calculatedBmi >= 25.0;
    const isWUnder = bmiClassification.toLowerCase().includes('underweight') || bmiClassification.toLowerCase().includes('thinness') || calculatedBmi < 18.5;

    const intervals = [
      { key: '3M', name: 'After 3 Months', label: 'Short Term Projection', monthsCount: 3 },
      { key: '6M', name: 'After 6 Months', label: 'Medium Term Horizon', monthsCount: 6 },
      { key: '1Y', name: 'After 1 Year', label: 'Healthy Lifestyle Horizon', monthsCount: 12 },
      { key: '5Y', name: 'After 5 Years', label: 'Lifelong Transformation Journey', monthsCount: 60 }
    ];

    const mapped: Record<string, any> = {};

    intervals.forEach((interval) => {
      // Base natural adjustment from weight
      let predictedWeight = profile.weight || 72;
      
      // Calculate habit factors
      // 1. Step factors: base sedentary is 7000 steps. 
      // Steps over 7000 leads to slow calorie burning / weight reduction
      const stepFactor = (weeklySteps - 7000) / 4000; // negative or positive
      const stepImpactPerMonth = -0.15 * stepFactor;

      // 2. Water factors: optimal is 3L.
      const waterFactor = 3.0 - waterIntake; // positive is bad/insufficient water
      const waterImpactPerMonth = 0.08 * waterFactor;

      // 3. Sleep factors: optimal is 8 Hours.
      const sleepFactor = 7.5 - sleepHours; // positive is sleep deprivation
      const sleepImpactPerMonth = 0.1 * sleepFactor;

      // Net month factor
      const monthlyDecline = stepImpactPerMonth + waterImpactPerMonth + sleepImpactPerMonth;
      
      predictedWeight = parseFloat((predictedWeight + (monthlyDecline * interval.monthsCount)).toFixed(1));
      
      // Bound logical extremes
      if (predictedWeight < 40) predictedWeight = 40;
      if (predictedWeight > 180) predictedWeight = 180;

      const predictedBmi = Math.round((predictedWeight / Math.pow((profile.height || 172) / 100, 2)) * 10) / 10;
      
      let statusText = 'Normal Weight 🟢';
      let mascotExpression: 'happy' | 'proud' | 'excited' | 'motivating' | 'calm' | 'concerned' = 'happy';
      let quote = '';

      if (predictedBmi < 18.5) {
        statusText = 'Underweight Zone ⚠️';
        mascotExpression = 'concerned';
        quote = "Let's add some more nutritional foods and protein to feel stronger and keep our energy high!";
      } else if (predictedBmi >= 25 && predictedBmi < 29.9) {
        statusText = 'Overweight Zone ⚠️';
        mascotExpression = 'motivating';
        quote = "Eating slightly smaller portions and adding a few extra steps will keep you in great shape!";
      } else if (predictedBmi >= 30) {
        statusText = 'Obesity Zone 🔴';
        mascotExpression = 'concerned';
        quote = "Going for brief daily walks and cutting back on processed snacks will make a huge difference.";
      } else {
        statusText = 'Optimal Healthy Zone 🟢';
        mascotExpression = 'excited';
        quote = "Your body is doing great! Keep up the daily movements to maintain this healthy progress.";
      }

      mapped[interval.key] = {
        name: interval.name,
        label: interval.label,
        weight: predictedWeight,
        bmi: predictedBmi,
        status: statusText,
        mascotExpression,
        quote
      };
    });

    return mapped;
  }, [profile, calculatedBmi, bmiClassification, waterIntake, sleepHours, weeklySteps]);

  const currentProjection = useMemo(() => {
    return predictionsMap[selectedInterval] || predictionsMap['1Y'];
  }, [predictionsMap, selectedInterval]);

  // Mascot personalized introduction text
  const projectionIntroduction = useMemo(() => {
    const customName = localStorage.getItem('healthmate_mascot_name') || 'HealthMate';
    const trimmed = customName.trim();
    const displayName = (!trimmed || trimmed === 'HealthMate') ? 'HealthMate 🌱' : `${trimmed} the HealthMate 🌱`;
    return `Hey ${profile.fullName || 'friend'}! I'm your ${displayName} 🙋‍♂️ Here you can see a preview of how you will feel and your health progress in 3 months, 6 months, or years if you follow your current diet & habits! Select a time below and adjust your sliders:`;
  }, [profile]);

  // AI Chat bot input scanner
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const normText = userText.toLowerCase();
    
    const unhealthyKeywords = [
      "pizza", "burger", "samosa", "chips", "fries", "biryani", "birany", "briyani", "ghee",
      "ice cream", "icecream", "cake", "chocolate", "sweet", "candy", "donut", "doughnut", "pastry",
      "soda", "coke", "pepsi", "cola", "fanta", "sprite", "milkshake", "syrup", "fried chicken",
      "noodle", "ramen", "maggi", "pasta", "puris", "poori", "vada", "samosas", "jalebi", "gulab jamun",
      "laddu", "kaju katli", "mysore pak", "payasam", "puff", "mixture", "murukku", "pakoda", "vada"
    ];

    const foundUnhealthy = unhealthyKeywords.some(k => normText.includes(k));
    const localRoastLevel = foundUnhealthy ? 'savage' : 'mild';
    const type = foundUnhealthy ? 'roast' : 'boost';

    // Snappy status indicator
    const loadingText = labsLang === 'te' 
      ? `Cooking up a ${foundUnhealthy ? 'Savage' : 'Playful'} Roman Telugu roast... 🌶️` 
      : `Formulating a ${foundUnhealthy ? 'Savage' : 'Playful'} English roast... 🔥`;
    triggerCompanion(loadingText, "thoughtful");

    try {
      const response = await apiFetch('/api/food-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food: userText,
          weight: profile.weight || 72,
          height: profile.height || 172,
          age: profile.age || 26,
          bmi: calculatedBmi,
          lang: labsLang
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Bring instant closure feedback
          setChatMessages(prev => [
            ...prev,
            {
              id: `mascot-${Date.now()}`,
              sender: 'mascot',
              text: result.roast,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: result.type,
              imageUrl: result.imageUrl
            }
          ]);
          setIsTyping(false);
          const feedbackEmoji = result.type === 'roast' ? '🔥' : '✨';
          triggerCompanion(labsLang === 'te' ? `Roast ready! ${feedbackEmoji}` : `Feedback ready! ${feedbackEmoji}`, "excited");
          return;
        }
      }
    } catch (e) {
      console.error("API food-roast query failed, falling back to local simulation rules...", e);
    }

    // LOCAL OFFLINE FALLBACK - Snap instantly in 150ms
    setTimeout(() => {
      let mascotReply = "";

      // Advanced multi-dimensional local dictionary supporting Language AND Roast Levels (Mild, Moderate, Savage)
      const localDatabase: Array<{
        keys: string[];
        en: { mild: string; moderate: string; savage: string };
        te: { mild: string; moderate: string; savage: string };
      }> = [
        {
          keys: ["pizza"],
          en: {
            mild: "A cozy warm slice of cheesy cheese pizza 🍕\nJust go keep walking to level keys, partner!",
            moderate: "Pizza is great when you are with a group 🍕\nBut eating alone puts your health in a loop!",
            savage: "You ordered a pizza but skipped on gym class 🍕\nYour fitness progress is cracking like glass!"
          },
          te: {
            mild: "Pizza slice looks hot and nice 🍕\nKonchem walk cheste body untundi cool and wise!",
            moderate: "Cheesy pizza order chesi, sofa lo dhoorav enti mama? 🍕\nRepu gym ki vellaka gunde aagi poddi ra chinnama!",
            savage: "Double cheese pizza ni normal tiffin anukunnavra babu? 🍕\nSofa nunchi lechi walk cheyakapothe scale pagilipoddi chudu!"
          }
        },
        {
          keys: ["biryani", "briyani", "biryni"],
          en: {
            mild: "A lovely mountain of Biryani so fine 🍗\nDouble up your walking to balance the line!",
            moderate: "Biryani aroma has filled up your head 🍗\nAre those calories a guest you want to be fed?",
            savage: "You treat Biryani like a casual light snack 🍗\nBut your fitness goals are completely off track!"
          },
          te: {
            mild: "Biryani hot plate super heavy treat 🍗\nWalking konchem chey, balance avtundi sweet!",
            moderate: "Biryani paina unna pranam, plate khali chesav mama 🍗\nRepu scale meeda weight chusi modalupetaku drama!",
            savage: "Biryani ni salad la thintu pothaventi asalu babu? 🍗\nWalking name chepthe body motham lazy vanuku babu!"
          }
        },
        {
          keys: ["burger"],
          en: {
            mild: "A tall loaded burger with onions and sauce 🍔\nDon't let this quick cheat be a heavy weight loss!",
            moderate: "Double patty burger is so tall and slick 🍔\nBut burning those carbs is an extreme hard trick!",
            savage: "That fat burger bun is a calorie dump 🍔\nYour fitness motivation got lost in the swamp!"
          },
          te: {
            mild: "Burger direct and taste values are high 🍔\nKonchem physical activity unte clean energy slide by!",
            moderate: "Burger padilla heavy cream bites tho lagesav ra 🍔\nPortion limits thagginchakapothe heavy shape model ra!",
            savage: "Burger ni healthy protein option anukuni thinnava mama? 🍔\nEe fat and oil speed thoti weight loop motham drama!"
          }
        },
        {
          keys: ["salad"],
          en: {
            mild: "Fresh green salad with cucumber and greens 🥗\nSimple clean nutrition directly in your teens!",
            moderate: "Healthy raw salad leaves on your fancy plate 🥗\nHighly active character, what an organic trait!",
            savage: "Wow, raw actual vegetables instead of junk dessert 🥗\nYou deserve a double premium fitness gold expert!"
          },
          te: {
            mild: "Pachhi salad thini focus organic ga set chesave 🥗\nDynamic lifestyle score solid range lo thosesave!",
            moderate: "Salad select chesav junk food ni dooram dooram ga petti 🥗\nNee health confidence levels looking direct and gatti!",
            savage: "Salad plate thini andhariki shock ichhavu kadhara mama 🥗\nUnhealthy snacks bypass chesi direct health and clean drama!"
          }
        },
        {
          keys: ["apple", "fruit"],
          en: {
            mild: "Unpeeled crisp apple is sweet and neat 🍎\nPerfect standard metabolic action habit treat!",
            moderate: "An apple a day keeps the sick doctor away 🍎\nSplendid dynamic focus on your daily fitness way!",
            savage: "Pristine fruit choice while everyone is eating pastries 🍎\nYou are officially the leader of the healthy life league!"
          },
          te: {
            mild: "Oka clean apple sweet crunch organic energy 🍎\nZero fat and vitamins standard dynamic synergy!",
            moderate: "Apple select chesav baked sweet cakes badulu 🍎\nWeight control target lines dynamic ga andhuko babu!",
            savage: "Mee healthy option and apple selection super hit ra 🍎\nCalorie balance regular ga follow avthe king ra!"
          }
        },
        {
          keys: ["dosa", "masala dosa", "rava dosa"],
          en: {
            mild: "Crispy golden Dosa on a hot morning pan 🥞\nWholesome fuel to start your dynamic plan!",
            moderate: "Masala dosa crispy but watch ghee amount 🥞\nKeep that butter light before calorie count!",
            savage: "Butter masala dosa with potato curry inside 🥞\nYou say it's weight-loss but you can't even hide!"
          },
          te: {
            mild: "Crispy plain dosa with chutney hit 🥞\nBalanced carbs values to keep you fully fit!",
            moderate: "Crispy dosa super choice ra andhra chinnode 🥞\nWalking direct limit maintain cheyi high mood lone!",
            savage: "Masala dosa lo ghee and butter over ga vesav mama 🥞\nCalories dynamic ga peak ki vellipothunnayi chusko syma!"
          }
        },
        {
          keys: ["idli", "idly", "pongal", "upma", "vada"],
          en: {
            mild: "Steamed breakfast item so simple and clean 🍢\nPerfect fuel to keep you active and lean!",
            moderate: "Light traditional tiffin sits light on your plate 🍢\nYour body says thanks for this fabulous trait!",
            savage: "Oil-free steamed tiffin is extremely light 🍢\nEven the scale is smiling at your choice today!"
          },
          te: {
            mild: "Steamed tiffin options with sambar side 🍢\nPure andhra style breakfast complete with pride!",
            moderate: "Vedi vedi idly pongal zero percent oil 🍢\nBody fitness score automatic ga tops level lines!",
            savage: "Steam breakfast thini manchi health focus chupinchav ra 🍢\nEppudu samosa logic tho kakunda track line thopu ra!"
          }
        },
        {
          keys: ["samosa", "pakoda", "chips", "fries", "pani puri", "snacks"],
          en: {
            mild: "Crunchy hot samosa or spicy pani puri bite 🥟\nKeep it strictly occasional to prevent weight flight!",
            moderate: "Double oil fried snacks during evening tea time 🥟\nLet's get up and walk to make your health climb!",
            savage: "Deep fried samosa and oil dripping pakodi block 🥟\nYour weight scale is screaming 'Please no more shock!'"
          },
          te: {
            mild: "Crispy hot samosa matching with your hot tea ☕\nOka piece ok ra mama, limit maintain chesi poye!",
            moderate: "Oily pakoda mixtures and samosas heavy thinte emayya 🥟\nWalking steps asalu zero, scale weight pagulthundi ra ayya!",
            savage: "Double fried pakodi, samosa directly cholesterol pump ra 🥟\nBody parameters clear ga weight status red-line bump ra!"
          }
        },
        {
          keys: ["sweet", "jamun", "gulab jamun", "laddu", "jalebi", "mysore pak", "chocolate", "cake", "donut"],
          en: {
            mild: "A tiny bite of sweet tastes like pure bliss 🍩\nBut stop right there, the calories are hard to miss!",
            moderate: "Sugary sweet sweets and chocolate are a cozy trap 🍩\nThey spike your blood glucose in one short map!",
            savage: "You wolfed down gulab jamun and laddu in a sweet sweep 🍩\nYour insulin levels are preparing a double massive leap!"
          },
          te: {
            mild: "Gulab jamun sweet soft bite super delicious flat 🍩\nLimit safe lo petti control standard parameters chat!",
            moderate: "Laddu, Jalebi are super sweet high sugar direct dump 🍩\nNee running and walking effort automatic ga chesthadi pump!",
            savage: "Gulab Jamun and Mysore Pak thintu sofa lo padukunnav entra babu? 🍩\nExtra weight fast track lo body lo cheri crash chesthadhi chudu!"
          }
        },
        {
          keys: ["tea", "coffee", "lassi", "buttermilk"],
          en: {
            mild: "A cozy warm brewing cup of tea and coffee line ☕\nKeep sugar minimal to keep your system fine!",
            moderate: "Hot milky tea or sweet lassi with lots of cream 🥛\nToo many hidden carbs in your favorite lazy dream!",
            savage: "Lassi full of thick sugar cream or double-sweet chai ☕\nYour blood sugar metrics are officially waving goodbye!"
          },
          te: {
            mild: "Hot tea, coffee summer buttermilk sweet and cold 🥛\nSugar levels limit chesthe automatic health and pure gold!",
            moderate: "Sweet thick lassi and double sugar milk chai lagesava ☕\nHidden liquid calories balance tracking chesthava ra mava?",
            savage: "Gunde ninda sugar tho tea continuous cups thagesthunnav enti babu? ☕\nPhysical walk completely nil, fitness status dhummu lesipoddi chudu!"
          }
        }
      ];

      // Matching algorithm
      const match = localDatabase.find(item => item.keys.some(k => normText.includes(k)));
      if (match) {
        const lp = labsLang === 'te' ? match.te : match.en;
        mascotReply = lp[localRoastLevel] || lp.moderate;
      } else {
        // Universal catch-all matching the requested level and language
        if (labsLang === 'te') {
          if (localRoastLevel === 'mild') {
            mascotReply = `Ee food parvaledu chala simple ra mama 🥗\nLimit lo tinte asalu undadu emi lazy drama!`;
          } else {
            mascotReply = `Ee cheat food non-stop ga thinte ela babu? 🍟\nSofa dhummedanki constant ga lazy padukunte weight scale pagilipoddi chudu!`;
          }
        } else {
          if (localRoastLevel === 'mild') {
            mascotReply = `This selection looks simple and cozy to eat 🥗\nJust walk a tiny bit to balance your sweet habit treat!`;
          } else {
            mascotReply = `You call this a diet? That's a calorie bomb! 🍟\nYour fitness journey just got dragged down to the swamp!`;
          }
        }
      }

      const mascotMsg: ChatMessage = {
        id: `mascot-${Date.now()}`,
        sender: 'mascot',
        text: mascotReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type
      };

      setChatMessages(prev => [...prev, mascotMsg]);
      setIsTyping(false);
      triggerCompanion(labsLang === 'te' ? "Roast ready! 🔥 Chusko mama." : "Roast ready! 🔥 Go ahead and check.", "happy");
    }, 150);
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-[500px]" id="labs-root-container">
      
      {/* SECTION NAVIGATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="font-display text-2.5xl font-extrabold text-white flex items-center gap-2">
            <span className="text-emerald-400">🧬</span> NextYou
          </h2>
          <p className="text-xs text-slate-450 mt-0.5 font-semibold">
            What will happen to you in the future? Explore the simulator, custom AI roaster, and experimental features.
          </p>
        </div>

        {/* Language & Segment Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start sm:self-center">
          
          {/* Dynamic selector segments */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-900 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveSegment('projections')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display tracking-wide transition-all cursor-pointer ${
                activeSegment === 'projections'
                  ? 'bg-slate-900 text-emerald-400 font-black border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-tab-projections"
            >
              Future Forecasting 🔮
            </button>
            <button
              onClick={() => setActiveSegment('roaster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display tracking-wide transition-all cursor-pointer ${
                activeSegment === 'roaster'
                  ? 'bg-slate-900 text-emerald-400 font-black border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-tab-roaster"
            >
              AI Food Roaster 🔥
            </button>
          </div>

        </div>
      </div>

      {/* RENDER ACTIVE LAB INTERFACES */}
      <div className="space-y-6">

        {/* TAB 1: FUTURE HEALTH FORECASTING PORTAL */}
        {activeSegment === 'projections' && (
          <div className="space-y-6 text-left">
            
            {/* Mascot advice intro board */}
            <div className="bg-slate-900/30 border border-emerald-550/15 p-5 rounded-[24px] flex flex-col md:flex-row items-center gap-5 bg-gradient-to-r from-emerald-500/[0.02] to-transparent text-left relative overflow-hidden">
              <div className="shrink-0 relative">
                <div className="w-20 h-5 bg-[#2E8B57]/60 rounded-full absolute bottom-[-4px] left-1/2 -translate-x-1/2 filter blur-sm" />
                <div className="relative z-10">
                  <HealthMateMascot size="lg" expression={currentProjection.mascotExpression} animate={true} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-[#10b981] font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 inline-block uppercase">
                  Your Healthy Projections
                </span>
                <h4 className="text-sm font-black text-slate-100 font-display">
                  "Map your future health outcome!"
                </h4>
                <p className="text-xs text-slate-450 leading-normal max-w-2xl">
                  {projectionIntroduction}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* HABIT MODIFIERS (Left panel) */}
              <div className="lg:col-span-5 bg-slate-950/60 border border-slate-850 p-6 rounded-3xl space-y-5">
                <div className="space-y-1 text-left">
                  <span className="text-[8.5px] font-mono uppercase text-emerald-400 font-black tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded inline-block border border-emerald-500/10">Habits Modifier</span>
                  <h3 className="font-display font-extrabold text-sm text-slate-200">Customize Activity & Habits</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Drag the sliders to see all future models update in real-time.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  
                  {/* Water Input Slider */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-blue-400" /> Water Intake</span>
                      <span className="text-emerald-400 font-bold">{waterIntake} Liters / Day</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" 
                      max="5.0" 
                      step="0.5"
                      value={waterIntake}
                      onChange={(e) => setWaterIntake(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Sleep Hours Slider */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Duration</span>
                      <span className="text-emerald-400 font-bold">{sleepHours} Hours / Night</span>
                    </div>
                    <input 
                      type="range" 
                      min="4.0" 
                      max="10.0" 
                      step="1"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Daily Walking Steps */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Daily Steps</span>
                      <span className="text-emerald-400 font-bold">{weeklySteps.toLocaleString()} Steps</span>
                    </div>
                    <input 
                      type="range" 
                      min="2000" 
                      max="16000" 
                      step="1000"
                      value={weeklySteps}
                      onChange={(e) => setWeeklySteps(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                </div>

                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-850 text-[10.5px] text-slate-500 flex items-start gap-2 text-left">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>These estimations are customized for your age ({profile.age || 26} yrs), height ({profile.height || 172} cm), and weight.</p>
                </div>
              </div>

              {/* TIMELINE CARDS GRID (Right panel) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[8.5px] font-mono uppercase text-slate-500 font-black tracking-widest">Future Projections</span>
                    <h3 className="font-display font-extrabold text-sm text-slate-200">Future Horizons</h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">Click a card to deep-dive</span>
                </div>

                {/* 2x2 Grid of Timeline Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { key: '3M', name: 'Me After 3 Months', label: 'Short Term', icon: '📆' },
                    { key: '6M', name: 'Me After 6 Months', label: 'Medium Term', icon: '🗓️' },
                    { key: '1Y', name: 'Me After 1 Year', label: 'Healthy Horizon', icon: '⏳' },
                    { key: '5Y', name: 'Me After 5 Years', label: 'Transformation', icon: '🪐' }
                  ] as const).map((opt) => {
                    const isSelected = selectedInterval === opt.key;
                    const val = predictionsMap[opt.key];
                    const weightDiff = val.weight - (profile.weight || 72);

                    return (
                      <div
                        key={opt.key}
                        onClick={() => setSelectedInterval(opt.key)}
                        className={`p-4.5 rounded-[22px] border transition-all duration-300 cursor-pointer text-left relative overflow-hidden select-none flex flex-col justify-between h-42 group ${
                          isSelected 
                            ? 'border-[#10b981] bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.08)]' 
                            : 'border-slate-850 bg-slate-950/40 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                              {opt.label}
                            </span>
                            <h4 className="font-display font-black text-xs text-slate-200 mt-0.5 group-hover:text-emerald-400 transition-colors">
                              {opt.name}
                            </h4>
                          </div>
                          <span className="text-xl">{opt.icon}</span>
                        </div>

                        <div className="mt-4 space-y-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-mono font-black text-slate-50">
                              {val.weight}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-black">kg</span>
                            <span className={`text-[10px] font-mono font-bold ${
                              weightDiff < 0 
                                ? 'text-emerald-400' 
                                : weightDiff > 0 
                                  ? 'text-rose-450' 
                                  : 'text-slate-400'
                            }`}>
                              {weightDiff < 0 ? '↓' : weightDiff > 0 ? '↑' : ''} {Math.abs(weightDiff).toFixed(1)} kg
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-900/60">
                            <span>BMI: {val.bmi}</span>
                            <span className="text-[9px] text-[#10b981] font-bold uppercase">{val.status.replace(' Zone', '').replace(' zone', '').replace('🔴', '').replace('🟢', '').replace('⚠️', '').trim()}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

                {/* RESULTS PANEL */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedInterval}-${waterIntake}-${sleepHours}-${weeklySteps}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-slate-900/60 rounded-3xl border border-emerald-500/10 p-5 grid grid-cols-1 md:grid-cols-12 gap-5"
                  >
                    
                    {/* Metrics Left column */}
                    <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-850/60 flex flex-col justify-center space-y-4 text-center md:text-left">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black block tracking-wider">Estimated Weight</span>
                        <div className="flex items-baseline justify-center md:justify-start gap-1">
                          <span className="text-3xl font-mono font-black text-[#10b981]">{currentProjection.weight}</span>
                          <span className="text-xs text-slate-400 font-bold">kg</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {profile.weight > currentProjection.weight 
                            ? `-${(profile.weight - currentProjection.weight).toFixed(1)} kg lighter` 
                            : profile.weight < currentProjection.weight 
                              ? `+${(currentProjection.weight - profile.weight).toFixed(1)} kg heavier`
                              : 'Stable mass'
                          }
                        </p>
                      </div>

                      <div className="border-t border-slate-900 pt-3 space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black block tracking-wider">Predicted BMI Score</span>
                        <div className="flex items-baseline justify-center md:justify-start gap-1">
                          <span className="text-2xl font-mono font-black text-[#10b981]">{currentProjection.bmi}</span>
                          <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-400 font-mono font-bold uppercase">{currentProjection.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Statement explanation right column */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[8px] font-mono text-[#10b981] uppercase font-black bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 inline-block">
                          Habit Projection Outcome
                        </span>
                        <h4 className="text-sm font-display font-extrabold text-white mt-1.5">
                          If you continue your current habits...
                        </h4>
                        <p className="text-[11.5px] text-slate-400 leading-normal mt-1">
                          By keeping your water intake at {waterIntake}L, sleep patterns at {sleepHours} hrs, and pacing average steps of {weeklySteps.toLocaleString()} daily, here is your simulated healthy condition {currentIntervalLabel(selectedInterval)}.
                        </p>
                      </div>

                      <div className="bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl">
                        <p className="text-xs text-slate-300 italic">
                          " {currentProjection.quote} "
                        </p>
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>

          </div>
        )}

        {/* TAB 2: AI HABIT CHATBOT FOOD ROASTER */}
        {activeSegment === 'roaster' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto space-y-6 text-left"
            id="segment-chatbot-roaster"
          >
            {/* Visual Chat Screen Container */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/15 rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative h-[500px]" id="chatbot-roaster-window">
              
              {/* Header */}
              <div className="bg-slate-950 px-5 py-4 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <HealthMateMascot size="xs" expression={isTyping ? 'thoughtful' : 'speaking'} animate={true} />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black font-display text-white uppercase tracking-wider">Food Roaster Friend</h4>
                      <span className="text-[7.5px] font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15 text-emerald-400 font-black">ACTIVE</span>
                    </div>
                    <p className="text-[9.5px] text-slate-500 font-mono">Your hilarious food-roasting buddy 🔥</p>
                  </div>
                </div>

                {/* LANGUAGE TOGGLE INSIDE ROASTER CHAT ONLY */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-0.5" id="roaster-language-select-pod">
                  <button
                    type="button"
                    onClick={() => setLabsLang('en')}
                    className={`px-2.5 py-1 text-[9px] font-mono rounded-full font-black transition-all cursor-pointer ${
                      labsLang === 'en'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLabsLang('te')}
                    className={`px-2.5 py-1 text-[9px] font-mono rounded-full font-black transition-all cursor-pointer ${
                      labsLang === 'te'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Telugu
                  </button>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/20" id="chat-messages-box">
                <AnimatePresence>
                  {chatMessages.map((msg) => {
                    const isMascot = msg.sender === 'mascot';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex items-start gap-2.5 max-w-[85%] ${isMascot ? 'self-start' : 'self-end text-right ml-auto flex-row-reverse'}`}
                      >
                        {isMascot && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center mt-1 select-none">
                            <HealthMateMascot size="xs" expression={msg.type === 'roast' ? 'surprised' : msg.type === 'boost' ? 'excited' : 'happy'} />
                          </div>
                        )}
                        
                        <div className="space-y-0.5">
                          <div
                            className={`p-3.5 rounded-2xl relative text-xs leading-relaxed ${
                              isMascot
                                ? msg.type === 'roast'
                                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                                  : msg.type === 'boost'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100'
                                    : 'bg-slate-900 border border-slate-850 text-slate-100'
                                : 'bg-emerald-500 text-slate-950 font-bold'
                            }`}
                          >
                            {msg.text}
                          </div>
                          {/* Image rendering completely removed for text-first roaster view */}
                          <span className="text-[8px] font-mono text-slate-500 px-1 block">{msg.timestamp}</span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-slate-500 text-[10px] font-mono py-1 pl-10"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                      <span>{labsLang === 'te' ? "Savage Telugu roast loading... 🌶️" : "Drafting real-time roast... 🔥"}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="bg-slate-950 p-3.5 border-t border-slate-900 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex gap-2.5 items-center"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type any food item..."
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-100 transition-colors placeholder:text-slate-500"
                    id="lab-chat-input"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 rounded-xl cursor-pointer transition-all"
                    id="lab-chat-submit"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 mt-2 pl-1 font-mono">
                  Almost any food is supported 🍛
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </div>

      

    </div>
  );
}

// Simple label helper
function currentIntervalLabel(interval: string) {
  if (interval === '3M') return 'after 3 months';
  if (interval === '6M') return 'after 6 months';
  if (interval === '1Y') return 'after 1 year';
  return 'after 5 years';
}
