/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, AlertCircle, Apple, Flame, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { FoodItem, BMIClassification } from '../types';
import { FOODS_DATABASE, getPersonalizedFoodIntelligence, getFoodRecommendation } from '../data/foods';
import FoodIntelCard from './FoodIntelCard';
import HealthMateMascot from './HealthMateMascot';
import { apiFetch } from '../lib/api';
// Removed Companion3D import to specialize on professional bio-analysis panels

interface FoodSearchProps {
  bmiClassification: BMIClassification;
  userAge: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  userGender?: 'male' | 'female' | 'other';
}

// Static synonym and regional food dictionaries for natural search expansion
const SYNONYMS_MAP: Record<string, string[]> = {
  keera: ['spinach', 'keera', 'keerai', 'greens', 'broccoli', 'palak', 'salad'],
  keerai: ['spinach', 'keera', 'keerai', 'greens', 'broccoli', 'palak', 'salad'],
  spinach: ['greens', 'keerai', 'palak', 'spinach', 'broccoli', 'salad'],
  tomato: ['tomato', 'gravy', 'rasam', 'soup', 'curry'],
  egg: ['egg', 'eggs', 'omelette', 'protein', 'boiled'],
  eggs: ['egg', 'eggs', 'omelette', 'protein', 'boiled'],
  milk: ['milk', 'dairy', 'shake', 'yogurt', 'cream', 'badam_milk_drink', 'lassi_sweet', 'buttermilk_spiced'],
  dairy: ['milk', 'yogurt', 'paneer', 'cheese'],
  rice: ['rice', 'biryani', 'masiyal', 'grain', 'white_rice', 'brown_rice', 'lemon_rice', 'curd_rice', 'pulihora', 'jeera_rice', 'fried_rice'],
  fruit: ['apple', 'banana', 'avocado', 'fruits', 'berry'],
  fruits: ['apple', 'banana', 'avocado', 'fruits', 'berry'],
  drink: ['tea', 'coffee', 'milk', 'soda', 'shake', 'juice', 'beverage', 'buttermilk', 'lassi', 'badam_milk', 'sugarcane_juice'],
  drinks: ['tea', 'coffee', 'milk', 'soda', 'shake', 'juice', 'beverage', 'buttermilk', 'lassi', 'badam_milk', 'sugarcane_juice'],
  veg: ['vegetable', 'veg', 'spinach', 'broccoli', 'paneer', 'salad'],
  veggies: ['vegetable', 'veg', 'spinach', 'broccoli', 'paneer', 'salad'],
  vegetables: ['vegetable', 'veg', 'spinach', 'broccoli', 'paneer', 'salad'],
  // Intelligent phonetic spell mappings
  idly: ['idli', 'steamed idli', 'mini idly', 'idly_plain', 'idly_mini', 'idly_rava', 'idli_mini'],
  idli: ['idli', 'steamed idli', 'mini idly', 'idly_plain', 'idly_mini', 'idly_rava', 'idli_mini'],
  biryni: ['chicken_biryani', 'veg_biryani', 'mutton_biryani', 'biryani'],
  biryani: ['chicken_biryani', 'veg_biryani', 'mutton_biryani', 'biryani'],
  dos: ['dosa', 'dosa_onion', 'masala dosa', 'plain masala dosa'],
  dosa: ['dosa', 'dosa_onion', 'masala dosa', 'plain masala dosa'],
  chapathi: ['chapati', 'roti', 'roti_plain', 'phulka'],
  chapati: ['chapati', 'roti', 'roti_plain', 'phulka'],
  roti: ['chapati', 'roti', 'roti_plain', 'phulka'],
  paneer: ['paneer_tikka', 'palak_paneer', 'paneer_paratha', 'paneer_butter_masala'],
  sambar: ['sambar', 'rasam', 'rasam_soup'],
  dal: ['dal_tadka', 'yellow dal tadka', 'khichdi'],
  chicken: ['chicken_biryani', 'butter_chicken', 'chicken_curry', 'chicken_breast', 'chicken_nuggets'],
  mutton: ['mutton_biryani'],
  fish: ['fish_curry', 'fish_fry', 'fish_fry_slice'],
  sweets: ['gulab_jamun', 'rasgulla_sweet', 'besan_laddu', 'jalebi_rings', 'kaju_katli', 'mysore_pak_ghee', 'payasam_kheer'],
  sweet: ['gulab_jamun', 'rasgulla_sweet', 'besan_laddu', 'jalebi_rings', 'kaju_katli', 'mysore_pak_ghee', 'payasam_kheer'],
  gulab: ['gulab_jamun'],
  rasgulla: ['rasgulla_sweet'],
  laddu: ['besan_laddu'],
  jalebi: ['jalebi_rings'],
  mysore: ['mysore_pak_ghee'],
  payasam: ['payasam_kheer'],
  buttermilk: ['buttermilk_spiced'],
  lassi: ['lassi_sweet'],
  badam: ['badam_milk_drink'],
  sugarcane: ['sugarcane_juice_fresh'],
  curry: ['chicken_curry', 'fish_curry', 'egg_curry', 'paneer_butter_masala', 'rajma_masala', 'chole_curry'],
  upma: ['upma', 'savory vegetable upma']
};

// Low-overhead Levenshtein distance calculator for intelligent phonetic/spelling approximation
function getLevenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) {
    return getLevenshteinDistance(s2, s1);
  }
  if (s2.length === 0) {
    return s1.length;
  }
  let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const insertions = previousRow[j + 1] + 1;
      const deletions = currentRow[j] + 1;
      const substitutions = previousRow[j] + (s1[i] === s2[j] ? 0 : 1);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
}

export default function FoodSearch({ bmiClassification, userAge, activityLevel, userGender }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [unhealthyCount, setUnhealthyCount] = useState<number>(0);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Compute reactive 3D companion advice parameters on food selections
  const foodAdvice = useMemo(() => {
    if (!selectedFood) return null;
    return getPersonalizedFoodIntelligence(selectedFood, bmiClassification, userAge, activityLevel, userGender);
  }, [selectedFood, bmiClassification, userAge, activityLevel, userGender]);

  // Determine Aura's emotion based on selection type and unhealthy count guidelines
  const companionMood = useMemo(() => {
    if (!selectedFood) return 'calm';

    const lowercaseName = selectedFood.name.toLowerCase();
    const isHealthyKeyword = lowercaseName.includes('apple') || lowercaseName.includes('banana') || lowercaseName.includes('veg') || lowercaseName.includes('sprout');
    const isModerateKeyword = lowercaseName.includes('pizza') || lowercaseName.includes('ice cream');

    // Repeated unhealthy choices -> Think Again
    if (unhealthyCount >= 2 && (selectedFood.baseRecommendation === 'Avoid' || selectedFood.calories > 350)) {
      return 'think_again';
    }

    if (selectedFood.baseRecommendation === 'Can Eat' || isHealthyKeyword) {
      return 'great_choice';
    }

    if (selectedFood.baseRecommendation === 'Occasional' || isModerateKeyword) {
      return 'enjoy_moderate';
    }

    if (selectedFood.baseRecommendation === 'Avoid') {
      return 'eat_less';
    }

    return 'thinking';
  }, [selectedFood, unhealthyCount]);

  const companionCustomText = useMemo(() => {
    if (!selectedFood) {
      return selectedCategory === 'Curated' ? "These are recommended for you." : "Search any food and I'll help.";
    }
    if (companionMood === 'think_again') {
      return `Enjoying this in moderation is a great strategy! Try balancing this with a peaceful walk to feel refreshed and energized.`;
    }
    if (companionMood === 'great_choice') {
      return `Great choice for a healthy lifestyle! "${selectedFood.name}" is a wonderful nutrition champion.`;
    }
    if (companionMood === 'enjoy_moderate') {
      return `Enjoy "${selectedFood.name}" in moderation! Savoring each bite and balancing it with healthy selections is key.`;
    }
    if (companionMood === 'eat_less') {
      return `Try enjoying "${selectedFood.name}" in moderation and pairing it with a glass of water or a short stroll today!`;
    }
    return `Let's understand the nutrition of "${selectedFood.name}".`;
  }, [selectedFood, companionMood, selectedCategory]);

  // Synchronize dynamic search actions with our global persistent 3D companion
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('aura-buddy', {
      detail: {
        mood: selectedFood ? companionMood : 'calm',
        text: companionCustomText
      }
    }));
  }, [selectedFood, companionMood, companionCustomText]);

  // Live API-backed food states
  const [apiFoods, setApiFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch from our multi-user live backend food-search endpoint (powered by Gemini API)
  const triggerApiSearch = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) {
      setApiFoods([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await apiFetch('/api/food-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: trimmed })
      });
      if (!response.ok) {
        throw new Error('Server returned an error');
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setApiFoods(result.data);
      } else {
        setApiFoods([]);
      }
    } catch (err: any) {
      console.warn("API food search failed. Falling back to local static lookup database gracefully.", err);
      setApiError(err.message || 'Connection failure');
      setApiFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search trigger for high-frequency typing performance
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setApiFoods([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      triggerApiSearch(searchQuery);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Derive static categories list from BOTH local database and live loaded items
  const categories = useMemo(() => {
    const allItems = [...FOODS_DATABASE, ...apiFoods];
    const list = new Set(allItems.map(f => f.category));
    return ['All', ...Array.from(list)];
  }, [apiFoods]);

  // COMBINE AND ENHANCE SEARCH TO OPERATE COMPLETELY INSTANTLY (LOCALLY-FIRST)
  // Smart combined fuzzy priority-ranked foods
  const searchGroups = useMemo(() => {
    if (searchQuery.trim().length === 0) return null;
    const query = searchQuery.toLowerCase().trim();

    // Combine local catalog + live-fetched items
    const allCandidates = [...FOODS_DATABASE];
    apiFoods.forEach(af => {
      if (!allCandidates.some(c => c.id === af.id)) {
        allCandidates.push(af);
      }
    });

    const activeCandidates = selectedCategory === 'All'
      ? allCandidates
      : allCandidates.filter(f => f.category === selectedCategory);

    const matchedIds = new Set<string>();

    // Priority 1: Exact Match (exact name, exact ID, or exact synonyms mapping or spelling correction)
    const exactMatches = activeCandidates.filter(food => {
      const name = food.name.toLowerCase();
      const id = food.id.toLowerCase();

      // Check direct match
      if (name === query || id === query) return true;

      // Check synonyms maps
      const synonyms = SYNONYMS_MAP[query];
      if (synonyms && synonyms.some(syn => name === syn || id === syn || name.includes(syn) || id.includes(syn))) {
        return true;
      }

      // Check if any key in SYNONYMS_MAP corresponds to query containing that key
      for (const [key, val] of Object.entries(SYNONYMS_MAP)) {
        if (query === key || (query.length > 3 && (key.includes(query) || query.includes(key)))) {
          if (val.some(v => id === v || name === v || id.includes(v) || name.includes(v))) {
            return true;
          }
        }
      }

      // Hand-coded standard zesty spelling fallbacks
      if (query === 'idly' && (id === 'idli' || id.includes('idli') || name.includes('idli'))) return true;
      if (query === 'idli' && (id === 'idly' || id.includes('idly') || name.includes('idly'))) return true;
      if (query === 'chapathi' && (id === 'chapati' || id.includes('chapati') || name.includes('chapati') || name.includes('roti'))) return true;
      if (query === 'chapati' && (id === 'chapathi' || id.includes('chapathi') || name.includes('chapathi'))) return true;
      if (query === 'biryni' && (id === 'biryani' || id.includes('biryani') || name.includes('biryani'))) return true;
      if (query === 'biryani' && (id === 'biryni' || id.includes('biryni') || name.includes('biryni'))) return true;

      return false;
    });
    exactMatches.forEach(e => matchedIds.add(e.id));

    // Priority 2: Starts With Match (food name starts with query, or any word in name starts with query)
    const startsWithMatches = activeCandidates.filter(food => {
      if (matchedIds.has(food.id)) return false;
      const name = food.name.toLowerCase();
      const id = food.id.toLowerCase();

      const words = name.split(/\s+/);
      const isStartWord = words.some(w => w.startsWith(query));
      return name.startsWith(query) || id.startsWith(query) || isStartWord;
    });
    startsWithMatches.forEach(s => matchedIds.add(s.id));

    // Priority 3: Contains Match (food name, id, description, or category contains query, or multi-word tokens match)
    const queryTokens = query.split(/[\s_+,-]+/).filter(t => t.length > 2); // e.g. "dum", "veg", "biryani"
    const containsMatches = activeCandidates.filter(food => {
      if (matchedIds.has(food.id)) return false;
      const name = food.name.toLowerCase();
      const desc = food.description.toLowerCase();
      const id = food.id.toLowerCase();
      const cat = food.category.toLowerCase();

      // Check full query first
      if (name.includes(query) || id.includes(query) || desc.includes(query) || cat.includes(query)) {
        return true;
      }

      // Check multi-word tokens matching!
      if (queryTokens.length > 1) {
        // If query is "Hyderabadi Veg Dum Biryani", tokens are ['hyderabadi', 'veg', 'biryani'].
        // Check if the food name matches major tokens, for example if it has "veg" and "biryani"
        const matchedCount = queryTokens.filter(token => name.includes(token) || id.includes(token)).length;
        // If at least one major token (length > 2) matches, we count it as a contains/related fallback!
        if (matchedCount > 0) {
          return true;
        }
      }

      return false;
    });
    containsMatches.forEach(c => matchedIds.add(c.id));

    // Priority 4: Fuzzy Similar Match (using Fuse.js on remaining)
    const remainingCandidates = activeCandidates.filter(food => !matchedIds.has(food.id));
    const fuzzyMatches: FoodItem[] = [];

    if (remainingCandidates.length > 0) {
      const fuse = new Fuse(remainingCandidates, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'id', weight: 0.1 },
          { name: 'description', weight: 0.1 },
          { name: 'category', weight: 0.1 }
        ],
        threshold: 0.55,
        includeScore: true,
        ignoreLocation: true
      });

      const fuseResults = fuse.search(query);
      fuseResults.forEach(r => {
        if (r.score !== undefined && r.score < 0.65) {
          fuzzyMatches.push(r.item);
          matchedIds.add(r.item.id);
        }
      });
    }

    // Absolutely make sure we don't leave the user empty-handed!
    // If we have literally 0 matches across exact, startsWith, contains, and fuzzy for a specific query:
    // Let's do a loose fallback check. We show foods containing any single word from the query, or foods in the same category, or general popular items.
    if (matchedIds.size === 0 && queryTokens.length > 0) {
      // Find food items that contain any single token from the query (even if it's broad)
      activeCandidates.forEach(food => {
        const name = food.name.toLowerCase();
        const id = food.id.toLowerCase();
        if (queryTokens.some(token => name.includes(token) || id.includes(token))) {
          fuzzyMatches.push(food);
          matchedIds.add(food.id);
        }
      });
    }

    return {
      exact: exactMatches,
      startsWith: startsWithMatches,
      contains: containsMatches,
      fuzzy: fuzzyMatches
    };
  }, [searchQuery, selectedCategory, apiFoods]);

  const filteredFoods = useMemo(() => {
    let result = FOODS_DATABASE;

    if (selectedCategory !== 'All') {
      result = result.filter(f => f.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();

      // Check for macro queries (Keep existing functionality untouched!)
      if (query === 'protein' || query === 'high protein' || query === 'high-protein') {
        const localMatched = result.filter(f => f.macros.protein >= 12);
        const apiMatched = apiFoods.filter(f => f.macros.protein >= 12 && !localMatched.some(l => l.id === f.id));
        return [...localMatched, ...apiMatched];
      }
      if (query === 'low fat' || query === 'low-fat') {
        const localMatched = result.filter(f => f.macros.fat <= 3);
        const apiMatched = apiFoods.filter(f => f.macros.fat <= 3 && !localMatched.some(l => l.id === f.id));
        return [...localMatched, ...apiMatched];
      }
      if (query === 'low carb' || query === 'low-carb' || query === 'keto') {
        const localMatched = result.filter(f => f.macros.carbs <= 10);
        const apiMatched = apiFoods.filter(f => f.macros.carbs <= 10 && !localMatched.some(l => l.id === f.id));
        return [...localMatched, ...apiMatched];
      }
      if (query === 'high carb' || query === 'high-carb') {
        const localMatched = result.filter(f => f.macros.carbs >= 40);
        const apiMatched = apiFoods.filter(f => f.macros.carbs >= 40 && !localMatched.some(l => l.id === f.id));
        return [...localMatched, ...apiMatched];
      }
      if (query === 'fiber' || query === 'high fiber' || query === 'soluble fiber') {
        return result.filter(f => f.description.toLowerCase().includes('fiber') || f.description.toLowerCase().includes('beta-glucan'));
      }

      if (searchGroups) {
        return [
          ...searchGroups.exact,
          ...searchGroups.startsWith,
          ...searchGroups.contains,
          ...searchGroups.fuzzy
        ];
      }
    }

    return result;
  }, [searchQuery, selectedCategory, apiFoods, searchGroups]);

  // Compute fuzzy match recommendations when the active search yields 0 items (using Fuse.js)
  const spellingSuggestions = useMemo(() => {
    if (filteredFoods.length > 0 || !searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const fuse = new Fuse(FOODS_DATABASE, {
      keys: [
        { name: 'name', weight: 0.8 },
        { name: 'id', weight: 0.1 },
        { name: 'description', weight: 0.1 }
      ],
      threshold: 0.6,
      includeScore: true,
      ignoreLocation: true
    });

    const results = fuse.search(query);
    return results.slice(0, 3).map(r => r.item);
  }, [filteredFoods.length, searchQuery]);

  // Did you mean suggestions when no Exact Match exists, but we have partial or fuzzy similar matches
  const didYouMeanSuggestions = useMemo(() => {
    if (searchQuery.trim().length === 0 || !searchGroups) return [];
    if (searchGroups.exact.length > 0) return []; // Only suggest if no exact matches exist

    const candidates = [
      ...searchGroups.startsWith,
      ...searchGroups.contains,
      ...searchGroups.fuzzy
    ];

    const seen = new Set<string>();
    const unique: FoodItem[] = [];
    for (const f of candidates) {
      if (!seen.has(f.id)) {
        seen.add(f.id);
        unique.push(f);
      }
      if (unique.length >= 4) break;
    }
    return unique;
  }, [searchQuery, searchGroups]);

  // Dynamic filtered search output statistics (Realism metadata helper)
  const filterStats = useMemo(() => {
    if (filteredFoods.length === 0) return null;
    const totalCalories = filteredFoods.reduce((acc, f) => acc + f.calories, 0);
    const avgCalories = Math.round(totalCalories / filteredFoods.length);
    const avgProtein = parseFloat((filteredFoods.reduce((acc, f) => acc + f.macros.protein, 0) / filteredFoods.length).toFixed(1));
    return {
      avgCalories,
      avgProtein,
      count: filteredFoods.length,
    };
  }, [filteredFoods]);

  const renderFoodButton = (food: FoodItem) => {
    const isCurrentlySelected = selectedFood?.id === food.id;
    const rec = getFoodRecommendation(food);
    let badgeColor = 'bg-yellow-500/10 text-yellow-500';
    if (rec === 'RECOMMENDED') {
      badgeColor = 'bg-emerald-500/10 text-emerald-400';
    } else if (rec === 'LIMIT INTAKE') {
      badgeColor = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    } else if (rec === 'AVOID FREQUENTLY') {
      badgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }

    return (
      <button
        id={`food-result-item-${food.id}`}
        key={food.id}
        onClick={() => handleSelectFood(food)}
        className={`w-full text-left p-3.5 flex items-center justify-between transition-all cursor-pointer focus:outline-none ${
          isCurrentlySelected 
            ? 'bg-slate-900/85 border-l-2 border-emerald-500 pl-2.5' 
            : 'hover:bg-slate-900/30'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800">
            <img
              src={food.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80"}
              alt={food.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80";
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs md:text-sm font-semibold text-slate-200 tracking-tight flex items-center gap-1.5 truncate">
              {food.name}
              {isCurrentlySelected && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                {food.calories} kCal
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800 shrink-0" />
              <span className="text-[10px] font-mono text-slate-500 truncate max-w-full">
                P: {food.macros.protein}g • F: {food.macros.fat}g • C: {food.macros.carbs}g
              </span>
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md font-bold shrink-0 text-center ml-2 ${badgeColor}`}>
          {rec}
        </span>
      </button>
    );
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    const isUnhealthy = food.baseRecommendation === 'Avoid' || food.calories > 350;
    if (isUnhealthy) {
      setUnhealthyCount(prev => prev + 1);
    } else if (food.baseRecommendation === 'Can Eat') {
      setUnhealthyCount(prev => Math.max(0, prev - 1));
    }
    // Smooth scrolling to details card
    setTimeout(() => {
      document.getElementById('food-intel-card-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  // Profile-Adaptive popular suggestion directives (highly personalized depending on user's active BMI classification)
  const POPULAR_SUGGESTIONS = useMemo(() => {
    if (bmiClassification.startsWith('Obesity') || bmiClassification === 'Overweight') {
      return [
        { label: 'Organic Green Tea', id: 'green_tea' },
        { label: 'Low-Fat Greek Yogurt', id: 'greek_yogurt' },
        { label: 'Garlic Steamed Broccoli', id: 'broccoli' },
        { label: 'Yellow Dal Tadka', id: 'dal_tadka' },
        { label: 'Pan-Seared Salmon', id: 'salmon' },
        { label: 'Superfood Quinoa Bowl', id: 'quinoa_bowl' }
      ];
    } else if (bmiClassification.includes('Underweight')) {
      return [
        { label: 'Fresh Creamy Avocado', id: 'creamy_avocado' },
        { label: 'Classic Cheeseburger', id: 'burger' },
        { label: 'Spiced Paneer Tikka', id: 'paneer_tikka' },
        { label: 'Premium Whey Shake', id: 'whey_protein' },
        { label: 'Chicken Biryani', id: 'chicken_biryani' },
        { label: 'Boiled Eggs', id: 'boiled_eggs' }
      ];
    } else {
      return [
        { label: 'Steamed Idli', id: 'idli' },
        { label: 'Dynamic Oats Oatmeal', id: 'oatmeal' },
        { label: 'Fresh Creamy Avocado', id: 'creamy_avocado' },
        { label: 'Boiled Eggs', id: 'boiled_eggs' },
        { label: 'Delicate Palak Paneer', id: 'palak_paneer' },
        { label: 'Plain Masala Dosa', id: 'dosa' }
      ];
    }
  }, [bmiClassification]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-emerald-400 uppercase mb-2">
          <Sparkles className="w-4 h-4" />
          Intel search & dynamic spell assistance
        </div>
        <h3 id="search-title" className="font-display text-xl font-bold text-slate-100">
          Analyze Food Intelligence
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-normal max-w-lg mb-4">
          Type foods or try macro filters like <span className="text-emerald-400 font-mono font-semibold">"high protein"</span>, <span className="text-emerald-400 font-mono font-semibold">"low fat"</span>, or <span className="text-emerald-400 font-mono font-semibold">"keto"</span> to analyze live parameters parsed for your profile. 
        </p>

        {/* Search Input field */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="food-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            placeholder="Search noodles, avocado, eggs, shake, high protein..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-16 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans transition-all focus:ring-1 focus:ring-emerald-500/20"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-300 px-1 text-xs font-mono font-bold"
            >
              Clear
            </button>
          )}

          {/* Floated Autocomplete Suggestions dropdown */}
          {isInputFocused && searchQuery.trim().length > 0 && (
            <div 
              id="autocomplete-dropdown"
              className="absolute z-50 left-0 right-0 top-full mt-2 bg-[#080f1e]/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl py-2 max-h-[300px] overflow-y-auto divide-y divide-slate-900/60 transition-all duration-200"
            >
              <div className="px-3 py-1 bg-slate-900/40 text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between">
                <span>⚡ Smart Autocomplete Suggestions</span>
                <span className="text-emerald-500">Tap to Autofill & View</span>
              </div>
              
              {filteredFoods.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs font-sans">
                  No matching foods found.
                </div>
              ) : (
                filteredFoods.slice(0, 6).map((food) => {
                  const rec = getFoodRecommendation(food);
                  let badgeColor = 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
                  if (rec === 'RECOMMENDED') {
                    badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                  } else if (rec === 'LIMIT INTAKE') {
                    badgeColor = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
                  } else if (rec === 'AVOID FREQUENTLY') {
                    badgeColor = 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
                  }
                  
                  return (
                    <button
                      id={`autocomplete-item-${food.id}`}
                      key={food.id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevents input focus loss before select
                        setSearchQuery(food.name);
                        handleSelectFood(food);
                        setIsInputFocused(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-900/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                           <img
                            src={food.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80"}
                            alt={food.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                            {food.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">
                            {food.category} • {food.calories} kCal
                          </p>
                        </div>
                      </div>
                      
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded font-bold ${badgeColor}`}>
                        {rec}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Profile-Tailored Suggestions */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            DIRECTIVES TAILORED FOR YOUR {bmiClassification.toUpperCase()} PROFILE:
          </div>
          <div id="tailored-suggestion-container" className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((s) => {
              const item = FOODS_DATABASE.find(f => f.id === s.id);
              return (
                <button
                  id={`suggest-${s.id}`}
                  key={s.id}
                  onClick={() => item && handleSelectFood(item)}
                  className="px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-950/50 hover:bg-slate-900 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Apple className="w-3 h-3 text-emerald-500/80" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Search results on left, Food Intelligence card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Results & Category Filters (occupies 5 columns on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Category Filter Pills & Insights counter */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium border whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Smart stats display for food search realism */}
            {filterStats && (
              <div className="space-y-2">
                <div id="search-statistics-bar" className="flex items-center justify-between text-[10px] font-mono font-semibold bg-slate-900/20 border border-slate-900 rounded-xl px-3 py-1 text-slate-400">
                  <span>{filterStats.count} items matches found</span>
                  <span className="text-emerald-400/90">Avg: {filterStats.avgCalories} kCal • P: {filterStats.avgProtein}g</span>
                </div>
                
                {/* Visual Recommendation Banner */}
                <div className="p-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-405 text-xs font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-sans text-slate-300">
                    🌱 "I found some recommendations for you."
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-slate-950 px-2 py-0.5 rounded-md">
                    Curated
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive "Did you mean?" assistance bar */}
          {didYouMeanSuggestions.length > 0 && (
            <div id="did-you-mean-panel" className="p-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-left animate-fade-in relative overflow-hidden shadow-xl shadow-black/30">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/[0.03] blur-xl pointer-events-none" />
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                Did you mean?
              </span>
              <div className="flex flex-wrap gap-2">
                {didYouMeanSuggestions.map(food => (
                  <button
                    id={`dym-suggest-${food.id}`}
                    key={food.id}
                    onClick={() => {
                      setSearchQuery(food.name);
                      handleSelectFood(food);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-800/80 bg-slate-900/65 hover:bg-slate-900 hover:border-emerald-500/40 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-black/40"
                  >
                    <span>{food.name}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded leading-none">{food.calories} kCal</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List items holding foods */}
          <div className="bg-slate-905 border border-slate-850 rounded-3xl overflow-hidden max-h-[460px] overflow-y-auto pr-1">
            {isLoading ? (
              <div id="searching-loader-indicator" className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-4 bg-slate-900/5">
                <div className="relative w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-slate-800/40 animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-emerald-400/90 tracking-widest uppercase animate-pulse">Analyzing Nutrition Profile...</p>
                  <p className="text-[9px] text-slate-500 font-medium font-sans">Finding matching foods and checking portion recommendations...</p>
                </div>
              </div>
            ) : filteredFoods.length > 0 ? (
              <div id="food-results-list" className="divide-y divide-slate-900">
                {searchQuery.trim().length > 0 && searchGroups ? (
                  <div className="space-y-4 p-2 bg-slate-950/20">
                    {/* Priority 1: Exact Matches */}
                    {searchGroups.exact.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[9px] font-mono font-extrabold text-emerald-405 uppercase tracking-wider px-1.5 pt-1.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          🎯 Priority 1: Exact Match
                        </div>
                        <div className="bg-slate-900/65 rounded-2xl overflow-hidden border border-slate-800/80 divide-y divide-slate-900 shadow-lg">
                          {searchGroups.exact.map((food) => renderFoodButton(food))}
                        </div>
                      </div>
                    )}

                    {/* Priority 2: Starts With Matches */}
                    {searchGroups.startsWith.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[9px] font-mono font-extrabold text-teal-400 uppercase tracking-wider px-1.5 pt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          📌 Priority 2: Starts With Match
                        </div>
                        <div className="bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-800/50 divide-y divide-slate-900/60">
                          {searchGroups.startsWith.map((food) => renderFoodButton(food))}
                        </div>
                      </div>
                    )}

                    {/* Priority 3: Contains Matches */}
                    {searchGroups.contains.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[9px] font-mono font-extrabold text-indigo-400 uppercase tracking-wider px-1.5 pt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          🔍 Priority 3: Contains Match
                        </div>
                        <div className="bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-805 divide-y divide-slate-900/60">
                          {searchGroups.contains.map((food) => renderFoodButton(food))}
                        </div>
                      </div>
                    )}

                    {/* Priority 4: Fuzzy Similar Matches */}
                    {searchGroups.fuzzy.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[9px] font-mono font-extrabold text-amber-500/80 uppercase tracking-wider px-1.5 pt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                          🌀 Priority 4: Fuzzy Similar Match
                        </div>
                        <div className="bg-slate-900/45 rounded-2xl overflow-hidden border border-slate-800/40 divide-y divide-slate-900/50">
                          {searchGroups.fuzzy.map((food) => renderFoodButton(food))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredFoods.map((food) => renderFoodButton(food))
                )}
              </div>
            ) : (
              <div id="empty-search-state" className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-3 bg-slate-900/5">
                <AlertCircle className="w-7 h-7 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-400">No exact parameters located.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Try another keyword or search term.</p>
                </div>

                {/* Spell Assistance Heuristic rendering */}
                {spellingSuggestions.length > 0 && (
                  <div id="spellchecker-suggestions-panel" className="mt-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-900 w-full text-left space-y-2">
                    <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Did you mean?</p>
                    <div className="flex flex-col gap-1.5">
                      {spellingSuggestions.map(food => (
                        <button
                          id={`spellcheck-suggest-${food.id}`}
                          key={food.id}
                          onClick={() => {
                            setSearchQuery(food.name);
                            handleSelectFood(food);
                          }}
                          className="flex items-center justify-between text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-900/60 p-1.5 rounded-xl transition-colors w-full text-left cursor-pointer"
                        >
                          <span>{food.name}</span>
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{food.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  id="reset-search-btn"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-emerald-500 hover:text-emerald-400 underline font-mono text-[10px] mt-2 cursor-pointer"
                >
                  Reset all query filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: The details card anchor (occupies 7 columns on desktop) */}
        <div id="food-intel-card-anchor" className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedFood ? (
              <motion.div 
                key={selectedFood.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Premium Health Assistant Assessment banner */}
                <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-[20px] flex items-center gap-4 relative overflow-hidden backdrop-blur-md text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] to-transparent pointer-events-none" />
                  <div className="shrink-0 flex items-center justify-center">
                    <HealthMateMascot 
                      size="lg" 
                      expression={
                        companionMood === 'think_again' || companionMood === 'eat_less'
                          ? 'concerned'
                          : companionMood === 'great_choice'
                            ? 'excited'
                            : companionMood === 'enjoy_moderate' 
                              ? 'calm'
                              : 'thoughtful'
                      } 
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[9px] font-mono tracking-widest text-[#10b981] font-extrabold uppercase block">HEALTHMATE ASSESSMENT</span>
                    <p className="text-xs text-slate-250 font-sans leading-relaxed mt-1 text-slate-200 animate-fade-in">
                      "{companionCustomText}"
                    </p>
                  </div>
                </div>

                <FoodIntelCard
                  food={selectedFood as FoodItem}
                  bmiClassification={bmiClassification}
                  userAge={userAge}
                  activityLevel={activityLevel}
                  userGender={userGender}
                  onClose={() => setSelectedFood(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Highlight active dynamic suitabilities bar */}
                <div className="bg-slate-900/30 border border-dashed border-slate-800/80 p-5 rounded-[20px] flex gap-3.5 items-center">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-950 flex items-center justify-center text-slate-600 border border-slate-850">
                    <Apple className="w-5.5 h-5.5 text-slate-500 animate-pulse" />
                  </div>
                  <div className="flex-1 text-left space-y-0.5">
                    <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase block">Dietary Suitability Index</span>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed flex items-center gap-2">
                       Select or search for any item to calculate biochemical compatibility indicators and healthy recommendations.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-slate-800/80 p-8 text-center bg-slate-900/10 flex flex-col items-center justify-center">
                  <div className="mb-2 flex items-center justify-center">
                    <HealthMateMascot size="xl" expression="happy" />
                  </div>
                  <h4 className="font-display font-semibold text-slate-300 text-sm mt-1">HealthMate Food Intelligence</h4>
                  <p className="text-sm font-semibold text-emerald-400 mt-1.5 font-sans">
                     "Search any food and I'll help you make smarter choices."
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed font-sans">
                     I'm here to analyze your food choices! Tap any of the curated foods on the left or type search queries to test nutritional suitability against your blood pressure, BMI, and calorie levels.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
