/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodItem, BMIClassification, PersonalizedAdvice } from '../types';

export const FOODS_DATABASE: FoodItem[] = [
  // --- INDIAN FOODS (18 Items) ---
  {
    id: 'idli',
    name: 'Steamed Idli',
    category: 'Indian Foods',
    calories: 120,
    macros: { carbs: 24, protein: 4, fat: 0.5 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Fermented lentil and rice steamed cakes. Extremely easy to digest, gut-friendly due to natural fermentation, and virtually fat-free.',
    baseRecommendation: 'Can Eat',
    servingSize: '2 medium pieces (100g)',
    burnMetrics: { walking: 34, running: 15, cardio: 13 }
  },
  {
    id: 'rava_idly',
    name: 'Rava Idly',
    category: 'Indian Foods',
    calories: 140,
    macros: { carbs: 28, protein: 4.5, fat: 1.5 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Steamed semolina cakes tempered with mustard seeds and curry leaves. Healthy and comforting breakfast Choice.',
    baseRecommendation: 'Can Eat',
    servingSize: '2 pieces (120g)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'mini_idly',
    name: 'Mini Idly',
    category: 'Indian Foods',
    calories: 110,
    macros: { carbs: 22, protein: 3.5, fat: 0.4 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Delectable bite-sized idlis steamed lightly and served with coconut chutney and hot vegetables sambar.',
    baseRecommendation: 'Can Eat',
    servingSize: '10 mini pieces (100g)',
    burnMetrics: { walking: 31, running: 14, cardio: 12 }
  },
  {
    id: 'dosa',
    name: 'Plain Masala Dosa',
    category: 'Indian Foods',
    calories: 250,
    macros: { carbs: 38, protein: 5, fat: 8 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'A thin, crispy fermented crepe cooked with oil or butter and stuffed with a mildly spiced, mashed potato mixture.',
    baseRecommendation: 'Occasional',
    servingSize: '1 standard dosa (150g)',
    burnMetrics: { walking: 72, running: 32, cardio: 27 }
  },
  {
    id: 'steamed_rice',
    name: 'Steamed Basmati Rice',
    category: 'Indian Foods',
    calories: 200,
    macros: { carbs: 45, protein: 4, fat: 0.5 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Fluffy, cooked long-grain inheritance white rice. Provides quick, clean carbohydrates for cellular energy recovery.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 57, running: 26, cardio: 22 }
  },
  {
    id: 'chicken_biryani',
    name: 'Basmati Chicken Biryani',
    category: 'Indian Foods',
    calories: 490,
    macros: { carbs: 54, protein: 26, fat: 18 },
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    description: 'A highly aromatic rice dish layered with chicken, spices, and premium clarified butter (ghee). Delicious but packed with dense calories.',
    baseRecommendation: 'Occasional',
    servingSize: '1 medium plate (350g)',
    burnMetrics: { walking: 140, running: 63, cardio: 52 }
  },
  {
    id: 'upma',
    name: 'Savory Vegetable Upma',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 32, protein: 4, fat: 4 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Thick, wholesome semolina porridge cooked with roasted mustard seeds, curry leaves, ginger, and diced vegetables.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 51, running: 23, cardio: 19 }
  },
  {
    id: 'chapati',
    name: 'Plain Whole Wheat Chapati',
    category: 'Indian Foods',
    calories: 85,
    macros: { carbs: 18, protein: 3, fat: 0.5 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Unleavened flatbread cooked on an open tawa without oil. A pristine staple of complex carbohydrates and essential minerals.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 standard roti (30g)',
    burnMetrics: { walking: 24, running: 11, cardio: 9 }
  },
  {
    id: 'paneer_tikka',
    name: 'Spiced Paneer Tikka',
    category: 'Indian Foods',
    calories: 270,
    macros: { carbs: 8, protein: 15, fat: 20 },
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    description: 'Marinated cottage cheese blocks grilled with spiced bell peppers and onions. Rich in calcium and dairy proteins with zero trans-fats.',
    baseRecommendation: 'Occasional',
    servingSize: '1 portion (150g)',
    burnMetrics: { walking: 77, running: 35, cardio: 29 }
  },
  {
    id: 'garlic_naan',
    name: 'Butter Garlic Naan',
    category: 'Indian Foods',
    calories: 310,
    macros: { carbs: 50, protein: 8, fat: 9 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Leavened refined white flour bread brushed with heavy clarified butter (ghee) and chopped garlic. Very quick carbohydrate load with low fiber.',
    baseRecommendation: 'Avoid',
    servingSize: '1 piece (90g)',
    burnMetrics: { walking: 89, running: 40, cardio: 33 }
  },
  {
    id: 'dal_tadka',
    name: 'Yellow Dal Tadka',
    category: 'Indian Foods',
    calories: 150,
    macros: { carbs: 20, protein: 8, fat: 4 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Split yellow lentils tempered with ghee, cumin seeds, garlic, and fresh green chilies. Excellent source of plant protein and prebiotic fibers.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'samosa',
    name: 'Fried Vegetable Samosa',
    category: 'Indian Foods',
    calories: 260,
    macros: { carbs: 32, protein: 4, fat: 13 },
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    description: 'Crispy deep-fried pastry triangles stuffed with heavily spiced potatoes and peas. High in trans-fats and oil density.',
    baseRecommendation: 'Avoid',
    servingSize: '1 standard piece (90g)',
    burnMetrics: { walking: 74, running: 33, cardio: 28 }
  },
  {
    id: 'butter_chicken',
    name: 'Rich Butter Chicken Makhani',
    category: 'Indian Foods',
    calories: 380,
    macros: { carbs: 12, protein: 22, fat: 26 },
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
    description: 'Tender tandoori chicken cooked in a luxurious spiced gravy of thick butter, heavy cream, and cashew nut paste. Extremely high in saturated fats.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium cup (180g)',
    burnMetrics: { walking: 109, running: 49, cardio: 40 }
  },
  {
    id: 'chole_bhature',
    name: 'Chole Bhature Extra Premium',
    category: 'Indian Foods',
    calories: 450,
    macros: { carbs: 55, protein: 12, fat: 22 },
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    description: 'Spicy stewed garbanzo beans paired with deep-fried leavened puffed breads. Heavy carbohydrate, fat, and sodium load.',
    baseRecommendation: 'Avoid',
    servingSize: '1 plate (1 bhatura + subzi)',
    burnMetrics: { walking: 129, running: 58, cardio: 48 }
  },
  {
    id: 'medu_vada',
    name: 'Crispy Medu Vada',
    category: 'Indian Foods',
    calories: 200,
    macros: { carbs: 24, protein: 5, fat: 12 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Deep-fried savory doughnut cakes made from black lentil batter. Extremely crispy outside, yielding dynamic proteins with high oil density.',
    baseRecommendation: 'Occasional',
    servingSize: '2 warm pieces (90g)',
    burnMetrics: { walking: 57, running: 26, cardio: 22 }
  },
  {
    id: 'aloo_paratha',
    name: 'Spiced Aloo Paratha',
    category: 'Indian Foods',
    calories: 290,
    macros: { carbs: 44, protein: 6, fat: 10 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Whole wheat flatbread stuffed with a savory spiced potato mash and fried on a hot griddle. High glycemic load if prepared with ghee or butter.',
    baseRecommendation: 'Occasional',
    servingSize: '1 large piece (140g)',
    burnMetrics: { walking: 83, running: 37, cardio: 31 }
  },
  {
    id: 'palak_paneer',
    name: 'Delicate Palak Paneer',
    category: 'Indian Foods',
    calories: 220,
    macros: { carbs: 10, protein: 11, fat: 16 },
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh paneer cubes cooked in a thick, savory purée of fresh seasoned spinach. Exceptionally high in iron, calcium, and vitamin A.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (180g)',
    burnMetrics: { walking: 63, running: 28, cardio: 23 }
  },
  {
    id: 'fish_curry',
    name: 'Traditional Fish Curry',
    category: 'Indian Foods',
    calories: 240,
    macros: { carbs: 8, protein: 20, fat: 14 },
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    description: 'White fish cooked in a spiced tomato-coconut gravy. Yields dynamic complete proteins and heart-friendly unsaturated lipids.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 cup portion (200g)',
    burnMetrics: { walking: 69, running: 31, cardio: 26 }
  },
  {
    id: 'dhokla',
    name: 'Spongy Steamed Dhokla',
    category: 'Indian Foods',
    calories: 140,
    macros: { carbs: 22, protein: 5, fat: 3 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Fermented chickpea flour steamed savory cakes. Light, low-calorie, rich in gut-healthy organic acids and perfect for afternoon satiety.',
    baseRecommendation: 'Can Eat',
    servingSize: '3 small pieces (100g)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'khichdi',
    name: 'Moong Vegetable Khichdi',
    category: 'Indian Foods',
    calories: 190,
    macros: { carbs: 34, protein: 6, fat: 3 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'A comforting, slow-cooked porridge of yellow lentils and whole basmati rice laced with light dynamic vegetables and delicate turmeric.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 large bowl (250g)',
    burnMetrics: { walking: 54, running: 25, cardio: 20 }
  },

  // --- FAST FOOD (11 Items) ---
  {
    id: 'burger',
    name: 'Classic Cheeseburger',
    category: 'Fast Food',
    calories: 535,
    macros: { carbs: 40, protein: 30, fat: 28 },
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'High in energy density, modern burgers combine processed red meats, refined white flour buns, and calorie-heavy sauces. High in sodium and saturated fats.',
    baseRecommendation: 'Avoid',
    servingSize: '1 standard burger (220g)',
    burnMetrics: { walking: 153, running: 69, cardio: 57 }
  },
  {
    id: 'pizza_slice',
    name: 'Pepperoni Pizza Slice',
    category: 'Fast Food',
    calories: 290,
    macros: { carbs: 32, protein: 12, fat: 12 },
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    description: 'A combination of refined white grain, high-fat processed pepperoni meat, and full-fat mozzarella. Generates substantial systemic glycemic load.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium slice (107g)',
    burnMetrics: { walking: 83, running: 37, cardio: 31 }
  },
  {
    id: 'fried_chicken',
    name: 'Crispy Fried Chicken',
    category: 'Fast Food',
    calories: 320,
    macros: { carbs: 15, protein: 20, fat: 21 },
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
    description: 'Breaded skin-on chicken portions deep fried in industrial hydrogenated oil. Generates elevated arterial inflammation parameters.',
    baseRecommendation: 'Avoid',
    servingSize: '1 large leg piece (120g)',
    burnMetrics: { walking: 91, running: 41, cardio: 34 }
  },
  {
    id: 'ramen_noodles',
    name: 'Instant Noodles / Ramen',
    category: 'Fast Food',
    calories: 420,
    macros: { carbs: 64, protein: 9, fat: 14 },
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    description: 'Highly processed flash-fried wheat noodles containing extreme sodium preservatives and bad frying fats. Completely lacks significant dietary fiber.',
    baseRecommendation: 'Avoid',
    servingSize: '1 package (100g dry)',
    burnMetrics: { walking: 120, running: 54, cardio: 45 }
  },
  {
    id: 'french_fries',
    name: 'Crispy Salted French Fries',
    category: 'Fast Food',
    calories: 365,
    macros: { carbs: 48, protein: 4, fat: 17 },
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    description: 'Deep-fried white potato skinless sticks loaded with frying oil, salts, and glucose stimulants. Leads to immediate vascular pressure peaks.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium portion (117g)',
    burnMetrics: { walking: 104, running: 47, cardio: 39 }
  },
  {
    id: 'veg_momos',
    name: 'Steamed Vegetable Momos',
    category: 'Fast Food',
    calories: 180,
    macros: { carbs: 35, protein: 4, fat: 2 },
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    description: 'Dough wrappers packed with chopped mixed vegetables and steamed. Healthy style of cooking, but made with starch-heavy refined flour wrapper.',
    baseRecommendation: 'Occasional',
    servingSize: '6 standard pieces (150g)',
    burnMetrics: { walking: 51, running: 23, cardio: 19 }
  },
  {
    id: 'hot_dog',
    name: 'Classic Beef Hot Dog',
    category: 'Fast Food',
    calories: 290,
    macros: { carbs: 24, protein: 11, fat: 16 },
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=500&auto=format&fit=crop&q=80',
    description: 'Highly processed sausage loaded with sodium nitrites, placed inside an ultra-refined white bun and drizzled with sugary toppings.',
    baseRecommendation: 'Avoid',
    servingSize: '1 standard hot dog (100g)',
    burnMetrics: { walking: 83, running: 37, cardio: 31 }
  },
  {
    id: 'beef_taco',
    name: 'Crispy Beef Taco',
    category: 'Fast Food',
    calories: 220,
    macros: { carbs: 18, protein: 12, fat: 11 },
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
    description: 'A folded crunchy corn tortilla filled with seasoned ground beef, shredded cheddar cheese, lettuce, and diced tomatoes.',
    baseRecommendation: 'Occasional',
    servingSize: '1 large taco (110g)',
    burnMetrics: { walking: 63, running: 28, cardio: 23 }
  },
  {
    id: 'glazed_donut',
    name: 'Glazed Yeast Donut',
    category: 'Fast Food',
    calories: 269,
    macros: { carbs: 31, protein: 3, fat: 15 },
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80',
    description: 'Deep-fried white flour dough glazed in sugar. Possesses extremely high glycemic load with rapid crash parameters.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium donut (60g)',
    burnMetrics: { walking: 77, running: 34, cardio: 29 }
  },
  {
    id: 'chicken_nuggets',
    name: 'Crispy Chicken Nuggets',
    category: 'Fast Food',
    calories: 280,
    macros: { carbs: 18, protein: 14, fat: 16 },
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    description: 'Reconstituted breaded chicken skin and breast meat shapes, deep fried in processed trans-fat shortening layers.',
    baseRecommendation: 'Avoid',
    servingSize: '6 golden pieces (100g)',
    burnMetrics: { walking: 80, running: 36, cardio: 30 }
  },
  {
    id: 'brownie',
    name: 'Dark Chocolate Brownie',
    category: 'Fast Food',
    calories: 340,
    macros: { carbs: 48, protein: 4, fat: 16 },
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    description: 'Extensely dense chocolate cake square filled with massive quantities of caster sugar, baking butter, and cocoa liquor.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium square (80g)',
    burnMetrics: { walking: 97, running: 44, cardio: 36 }
  },

  // --- HEALTHY (19 Items) ---
  {
    id: 'creamy_avocado',
    name: 'Fresh Creamy Avocado',
    category: 'Healthy',
    calories: 160,
    macros: { carbs: 8.5, protein: 2, fat: 14.7 },
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=80',
    description: 'Loaded with oleic acid (monounsaturated heart-healthy fat), potassium, and dietary fibers. Promotes long satiety and cellular recovery.',
    baseRecommendation: 'Can Eat',
    servingSize: '1/2 medium avocado (100g)',
    burnMetrics: { walking: 46, running: 21, cardio: 17 }
  },
  {
    id: 'fruit_salad',
    name: 'Harvest Fruit Salad',
    category: 'Healthy',
    calories: 85,
    macros: { carbs: 21, protein: 1.2, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=500&auto=format&fit=crop&q=80',
    description: 'A glowing mixture of raw melons, apples, berries, and oranges. High in vitamin C, potassium, and active digestive enzymes.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 24, running: 11, cardio: 9 }
  },
  {
    id: 'chicken_breast',
    name: 'Herb Grilled Chicken Breast',
    category: 'Healthy',
    calories: 165,
    macros: { carbs: 0, protein: 31, fat: 3.6 },
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    description: 'The global gold standard of clean lean protein. Vital for tissue rebuilding, muscle protection, and strong appetite satiety.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 cooked breast skinless (100g)',
    burnMetrics: { walking: 47, running: 21, cardio: 18 }
  },
  {
    id: 'broccoli',
    name: 'Garlic Steamed Broccoli',
    category: 'Healthy',
    calories: 35,
    macros: { carbs: 7, protein: 2.8, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80',
    description: 'Packed with Sulforaphane, a natural compound that unlocks cellular defense layers. Extremely high fiber with negligible calories.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 large portion cup (100g)',
    burnMetrics: { walking: 10, running: 5, cardio: 4 }
  },
  {
    id: 'almonds',
    name: 'Raw Premium Almonds',
    category: 'Healthy',
    calories: 164,
    macros: { carbs: 6, protein: 6, fat: 14 },
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=500&auto=format&fit=crop&q=80',
    description: 'Dense nutrition pods featuring monounsaturated organic lipids, fibers, and rich reservoirs of antioxidant Vitamin E.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 handful (28g / about 23 nuts)',
    burnMetrics: { walking: 47, running: 21, cardio: 17 }
  },
  {
    id: 'salmon',
    name: 'Pan-Seared Salmon Fillet',
    category: 'Healthy',
    calories: 206,
    macros: { carbs: 0, protein: 22, fat: 12 },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    description: 'Superb source of EPA / DHA marine Omega-3 fatty acids. Combats vascular inflammatory tags, fortifying blood vessels.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 grilled fillet (115g)',
    burnMetrics: { walking: 59, running: 26, cardio: 22 }
  },
  {
    id: 'oatmeal',
    name: 'Dynamic Oats Oatmeal',
    category: 'Healthy',
    calories: 160,
    macros: { carbs: 28, protein: 6, fat: 3 },
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=500&auto=format&fit=crop&q=80',
    description: 'Rich in Beta-Glucan, a unique prebiotic fiber that helps slow starch breakdown and lower circulating bad cholesterol.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl cooked in water (150g)',
    burnMetrics: { walking: 46, running: 20, cardio: 17 }
  },
  {
    id: 'greek_yogurt',
    name: 'Low-Fat Greek Yogurt',
    category: 'Healthy',
    calories: 100,
    macros: { carbs: 3.6, protein: 10, fat: 2 },
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
    description: 'Thick strained yogurt packed with twice the protein of normal yogurt. Generates active probiotic support for optimal digestive microbiota.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 container cup (155g)',
    burnMetrics: { walking: 28, running: 13, cardio: 11 }
  },
  {
    id: 'whey_protein',
    name: 'Premium Whey Protein Shake',
    category: 'Healthy',
    calories: 120,
    macros: { carbs: 3, protein: 24, fat: 1.5 },
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500&auto=format&fit=crop&q=80',
    description: 'High-biological value ultrafiltered whey isolate. Delivers direct BCAAs to rapidly fire up skeletal muscle fiber repair.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 scoop in pure water (30g powder)',
    burnMetrics: { walking: 34, running: 15, cardio: 13 }
  },
  {
    id: 'boiled_eggs',
    name: 'Boiled Chicken Eggs',
    category: 'Healthy',
    calories: 155,
    macros: { carbs: 1.1, protein: 12.6, fat: 10.6 },
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=80',
    description: 'The golden biological constant of complete protein. Packed with essential lecithin, lutein, and brain-friendly choline.',
    baseRecommendation: 'Can Eat',
    servingSize: '2 large eggs (100g)',
    burnMetrics: { walking: 44, running: 20, cardio: 16 }
  },
  {
    id: 'apple',
    name: 'Organic Red Apple',
    category: 'Healthy',
    calories: 95,
    macros: { carbs: 25, protein: 0.5, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    description: 'A crisp apple packed with prebiotic soluble fiber pectin and quercetin antioxidants, supporting digestive speed and immune health.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium apple (182g)',
    burnMetrics: { walking: 27, running: 12, cardio: 10 }
  },
  {
    id: 'spinach_salad',
    name: 'Organic Fresh Baby Spinach',
    category: 'Healthy',
    calories: 23,
    macros: { carbs: 3.6, protein: 2.9, fat: 0.4 },
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    description: 'Vibrant green leaves packing abundant non-heme iron, lutein, vitamin K, and magnesium. Supports visual and vascular health.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 huge bowl salad (100g)',
    burnMetrics: { walking: 7, running: 3, cardio: 2 }
  },
  {
    id: 'chia_pudding',
    name: 'Organic Chia Seed Pudding',
    category: 'Healthy',
    calories: 140,
    macros: { carbs: 15, protein: 4, fat: 8 },
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
    description: 'Mucilaginous chia seeds soaked in almond milk. Offers dense plant-based alpha-linolenic acid (Omega-3) and massive soluble fiber.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 small cup (130g)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'quinoa_bowl',
    name: 'Superfood Quinoa Salad Bowl',
    category: 'Healthy',
    calories: 320,
    macros: { carbs: 46, protein: 10, fat: 11 },
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    description: 'An ancient whole grain bowl supplying all nine essential amino acids alongside generous magnesium, zinc, and prebiotics.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 massive bowl (300g)',
    burnMetrics: { walking: 91, running: 41, cardio: 34 }
  },
  {
    id: 'walnuts',
    name: 'Unsalted Raw Walnuts',
    category: 'Healthy',
    calories: 185,
    macros: { carbs: 4, protein: 4, fat: 18 },
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=500&auto=format&fit=crop&q=80',
    description: 'Brain-shaped raw nuts exceptionally rich in polyphenols and healthy essential fats mapping directly to improved cognitive preservation.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 small oz handful (28g)',
    burnMetrics: { walking: 53, running: 24, cardio: 20 }
  },
  {
    id: 'tofu_mushrooms',
    name: 'Pan-Sautéed Tofu & Mushrooms',
    category: 'Healthy',
    calories: 150,
    macros: { carbs: 5, protein: 12, fat: 9 },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    description: 'Firmed soybean curd and brown button mushrooms sautéed in a splash of olive oil. Excellent low-calorie source of zinc and plant protein.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'sweet_potato',
    name: 'Oven Oven-Baked Sweet Potato',
    category: 'Healthy',
    calories: 105,
    macros: { carbs: 24, protein: 2, fat: 0.2 },
    image: 'https://images.unsplash.com/photo-1596097480979-a202bf10243d?w=500&auto=format&fit=crop&q=80',
    description: 'Baked tuber dense in beta-carotene (provitamin A) and minerals. Provides soft, slow-burning complex energy perfect for stamina.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium baked potato (114g)',
    burnMetrics: { walking: 30, running: 14, cardio: 11 }
  },
  {
    id: 'mixed_berries',
    name: 'Antioxidant Mixed Berries',
    category: 'Healthy',
    calories: 60,
    macros: { carbs: 14, protein: 1, fat: 0.4 },
    image: 'https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=500&auto=format&fit=crop&q=80',
    description: 'Medley of raw blueberries, raspberries, and blackberries. Teeming with youth-fortifying anthocyanins and delicate organic soluble fiber.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 portion cup (100g)',
    burnMetrics: { walking: 17, running: 8, cardio: 6 }
  },
  {
    id: 'brown_rice_beans',
    name: 'Brown Rice & Red Beans',
    category: 'Healthy',
    calories: 310,
    macros: { carbs: 58, protein: 11, fat: 1.5 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Complete essential plant amino protein footprint achieved by combining high-fiber whole grain brown rice with mineral lag-free beans.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 hearty bowl (250g)',
    burnMetrics: { walking: 89, running: 40, cardio: 33 }
  },

  // --- SNACKS & DRINKS (12 Items) ---
  {
    id: 'potato_chips',
    name: 'Salty Potato Chips',
    category: 'Snacks & Drinks',
    calories: 152,
    macros: { carbs: 15, protein: 2, fat: 10 },
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    description: 'Thin potato skins crisped in industrial palm oils and thoroughly salted. Extremely high sodium value with zero nutrient density.',
    baseRecommendation: 'Avoid',
    servingSize: '1 small individual packet (28g)',
    burnMetrics: { walking: 43, running: 20, cardio: 16 }
  },
  {
    id: 'tortilla_chips_salsa',
    name: 'Wheat Tortilla Chips & Salsa',
    category: 'Snacks & Drinks',
    calories: 210,
    macros: { carbs: 32, protein: 4, fat: 7 },
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=80',
    description: 'Baked corn tortilla triangles paired with active fresh tomato salsa. Satisfying crunch with nice potassium, but salt-heavy.',
    baseRecommendation: 'Occasional',
    servingSize: '1 starter plate (60g + dip)',
    burnMetrics: { walking: 60, running: 27, cardio: 22 }
  },
  {
    id: 'diet_soda',
    name: 'Zero-Sugar Diet Cola',
    category: 'Snacks & Drinks',
    calories: 0,
    macros: { carbs: 0, protein: 0, fat: 0 },
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    description: 'Artificially sweetened zero-calorie carbonated soda. Does not trigger a calorie spike, though phosphoric acid levels affect bone enamel.',
    baseRecommendation: 'Occasional',
    servingSize: '1 aluminum can (355ml)',
    burnMetrics: { walking: 0, running: 0, cardio: 0 }
  },
  {
    id: 'regular_soda',
    name: 'Classic Sweet Sugar Cola',
    category: 'Snacks & Drinks',
    calories: 140,
    macros: { carbs: 39, protein: 0, fat: 0 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Industrial syrup water, packed with high fructose corn sugar fractions. Triggers extreme metabolic load and quick adiposity conversion.',
    baseRecommendation: 'Avoid',
    servingSize: '1 standard can (355ml)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'orange_juice',
    name: 'Orange Juice (Fresh)',
    category: 'Snacks & Drinks',
    calories: 112,
    macros: { carbs: 26, protein: 1.7, fat: 0.2 },
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh citrus squeezing. Rich in natural bioactive vitamin C and clean water, though the process concentrates sweet fructose and strips healthy fiber.',
    baseRecommendation: 'Occasional',
    servingSize: '1 glass cup (240ml)',
    burnMetrics: { walking: 32, running: 14, cardio: 12 }
  },
  {
    id: 'apple_juice',
    name: 'Packaged Clear Apple Juice',
    category: 'Snacks & Drinks',
    calories: 120,
    macros: { carbs: 29, protein: 0.2, fat: 0.1 },
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=80',
    description: 'Processed industrial apple juice pasteurized and filtered. Devoid of fiber and dense in fast-assimilating free sugars.',
    baseRecommendation: 'Avoid',
    servingSize: '1 box carton (250ml)',
    burnMetrics: { walking: 34, running: 15, cardio: 13 }
  },
  {
    id: 'green_tea',
    name: 'Organic Hot Green Tea',
    category: 'Snacks & Drinks',
    calories: 2,
    macros: { carbs: 0.5, protein: 0, fat: 0 },
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&auto=format&fit=crop&q=80',
    description: 'Infused leaves bursting with antioxidant EGCG catechins. Stimulates healthy thermogenesis, brain focus, and blood lipid protection.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 heated cup (240ml)',
    burnMetrics: { walking: 1, running: 0, cardio: 0 }
  },
  {
    id: 'black_coffee',
    name: 'Unsweetened Black Espresso',
    category: 'Snacks & Drinks',
    calories: 2,
    macros: { carbs: 0, protein: 0.3, fat: 0 },
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    description: 'Pure roasted coffee bean extraction. Delivers potent chlorogenic acid antioxidants and clean central nervous system activation benefits.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 espresso shot (60ml)',
    burnMetrics: { walking: 1, running: 0, cardio: 0 }
  },
  {
    id: 'masala_chai',
    name: 'Spiced Indian Masala Chai',
    category: 'Snacks & Drinks',
    calories: 90,
    macros: { carbs: 15, protein: 2, fat: 2.5 },
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&auto=format&fit=crop&q=80',
    description: 'Brewed black tea with aromatic spices, boiled with whole milk and refined table sugars. Hearty and warming, but yields moderate carbs.',
    baseRecommendation: 'Occasional',
    servingSize: '1 clay cup (150ml)',
    burnMetrics: { walking: 26, running: 12, cardio: 10 }
  },
  {
    id: 'chocolate_cookies',
    name: 'Double Chocolate Chip Cookies',
    category: 'Snacks & Drinks',
    calories: 140,
    macros: { carbs: 19, protein: 1.5, fat: 7 },
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80',
    description: 'Sweet bakery bites baked with refined wheat, hydrogenated bakery fat, chocolate syrup drops, and powdered cane sugar.',
    baseRecommendation: 'Avoid',
    servingSize: '1 large double cookie (30g)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'salted_popcorn',
    name: 'Salted Air-Popped Popcorn',
    category: 'Snacks & Drinks',
    calories: 110,
    macros: { carbs: 20, protein: 3, fat: 2 },
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&auto=format&fit=crop&q=80',
    description: 'Whole corn kernels puffed with dynamic warm hot air, seasoned with trace butter oil and kitchen salts. Very nice dietary fiber volume.',
    baseRecommendation: 'Occasional',
    servingSize: '2 generous cups (30g)',
    burnMetrics: { walking: 31, running: 14, cardio: 12 }
  },
  {
    id: 'cafe_latte',
    name: 'Hot Caffè Latte (Whole Milk)',
    category: 'Snacks & Drinks',
    calories: 120,
    macros: { carbs: 11, protein: 7, fat: 6 },
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80',
    description: 'Smooth espresso pulls paired with steamed dense farm whole milk. Rich in calcium and dairy proteins; watch out for dairy fat load.',
    baseRecommendation: 'Occasional',
    servingSize: '1 medium mug standard (240ml)',
    burnMetrics: { walking: 34, running: 15, cardio: 13 }
  },
  {
    id: 'banana',
    name: 'Fresh Yellow Banana',
    category: 'Healthy',
    calories: 105,
    macros: { carbs: 27, protein: 1.3, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    description: 'Perfect natural source of potassium, vitamins, and fast-digesting carbohydrates. Boosts dynamic cellular energy levels instantly.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium banana (118g)',
    burnMetrics: { walking: 30, running: 14, cardio: 12 }
  },
  {
    id: 'mango',
    name: 'Sweet Alphonso Mango',
    category: 'Healthy',
    calories: 150,
    macros: { carbs: 36, protein: 1.4, fat: 0.6 },
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    description: 'Delectable, sweet tropical fruit rich in Vitamin A, Vitamin C, and soluble prebiotic fiber.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium mango (200g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'orange',
    name: 'Juicy Fresh Orange',
    category: 'Healthy',
    calories: 62,
    macros: { carbs: 15, protein: 1.2, fat: 0.2 },
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=80',
    description: 'Vibrant citrus fruit teeming with dynamic Vitamin C antioxidants, healthy organic acids, and fluid hydration.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 large orange (130g)',
    burnMetrics: { walking: 18, running: 8, cardio: 7 }
  },
  {
    id: 'grapes',
    name: 'Fresh Sweet Grapes',
    category: 'Healthy',
    calories: 69,
    macros: { carbs: 18, protein: 0.7, fat: 0.2 },
    image: 'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=500&auto=format&fit=crop&q=80',
    description: 'Plump and juicy table grapes containing resveratrol, a highly potent anti-aging polyphenol antioxidant.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 cup of grapes (100g)',
    burnMetrics: { walking: 20, running: 9, cardio: 8 }
  },
  {
    id: 'sambar',
    name: 'Traditional Mixed Sambar',
    category: 'Indian Foods',
    calories: 90,
    macros: { carbs: 14, protein: 3.5, fat: 2.2 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Wholesome lentil-based vegetable stew flavored with tamarind and South Indian spice blend.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium bowl (150g)',
    burnMetrics: { walking: 26, running: 12, cardio: 10 }
  },
  {
    id: 'milk',
    name: 'Fresh Cow Milk (Semi-Skimmed)',
    category: 'Snacks & Drinks',
    calories: 122,
    macros: { carbs: 11.5, protein: 8.0, fat: 4.8 },
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    description: 'Wholesome fresh cow milk providing calcium, vitamin D, and dairy proteins for musculoskeletal bone strength.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 glass (240ml)',
    burnMetrics: { walking: 35, running: 16, cardio: 13 }
  },
  {
    id: 'tea',
    name: 'Hot Brewed Tea (Chai with Milk)',
    category: 'Snacks & Drinks',
    calories: 60,
    macros: { carbs: 9.0, protein: 1.5, fat: 1.2 },
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&auto=format&fit=crop&q=80',
    description: 'Warming brewed black tea leaves with a splash of milk and light sugar.',
    baseRecommendation: 'Occasional',
    servingSize: '1 cup (150ml)',
    burnMetrics: { walking: 17, running: 8, cardio: 7 }
  },
  {
    id: 'coffee',
    name: 'Freshly Brewed Hot Coffee',
    category: 'Snacks & Drinks',
    calories: 45,
    macros: { carbs: 6.0, protein: 1.0, fat: 0.8 },
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    description: 'Potent freshly ground coffee beans brewed hot with milk and a touch of organic sugar.',
    baseRecommendation: 'Occasional',
    servingSize: '1 cup (150ml)',
    burnMetrics: { walking: 13, running: 6, cardio: 5 }
  },
  {
    id: 'keerai',
    name: 'Keerai (Spinach Greens)',
    category: 'Healthy',
    calories: 23,
    macros: { carbs: 3, protein: 3, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh regional amaranth / spinach leafy greens. Extremely rich in active folate, iron, and fibers.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (100g)',
    burnMetrics: { walking: 7, running: 3, cardio: 2 }
  },
  {
    id: 'keera_masiyal',
    name: 'Keera Masiyal (Mashed Greens)',
    category: 'Indian Foods',
    calories: 90,
    macros: { carbs: 8, protein: 4, fat: 5 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional slow-cooked mashed spinach seasoned with cumin, mustard seeds, and clean lentils.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium cup (150g)',
    burnMetrics: { walking: 26, running: 12, cardio: 10 }
  },
  {
    id: 'tomato',
    name: 'Fresh Lycopene Tomato',
    category: 'Healthy',
    calories: 18,
    macros: { carbs: 4, protein: 0.9, fat: 0.2 },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh organic ripe tomato. Packed with dietary fiber, vitamin C, potassium, and heart-healthy lycopene.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 medium raw tomato (120g)',
    burnMetrics: { walking: 5, running: 2, cardio: 2 }
  },
  {
    id: 'tomato_soup',
    name: 'Zesty Tomato Soup',
    category: 'Healthy',
    calories: 110,
    macros: { carbs: 18, protein: 2, fat: 3.5 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Smooth, comforting soup prepared from ripe crushed tomatoes, fresh pepper, and culinary herbs.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 large bowl (250g)',
    burnMetrics: { walking: 31, running: 14, cardio: 12 }
  },
  {
    id: 'tomato_rice',
    name: 'Flavored Tomato Rice',
    category: 'Indian Foods',
    calories: 220,
    macros: { carbs: 42, protein: 4, fat: 4 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional spiced rice dish cooked with whole tomatoes, bay leaf, mustard seed, and curry leaves.',
    baseRecommendation: 'Occasional',
    servingSize: '1 medium plate (200g)',
    burnMetrics: { walking: 63, running: 28, cardio: 24 }
  },
  {
    id: 'tomato_curry',
    name: 'Tangy Tomato Curry',
    category: 'Indian Foods',
    calories: 130,
    macros: { carbs: 12, protein: 2.5, fat: 8 },
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    description: 'A rich simmered onion-tomato gravy with Indian whole spices. Easy to digest and light.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 small bowl (150g)',
    burnMetrics: { walking: 37, running: 17, cardio: 14 }
  },
  {
    id: 'egg_omelette',
    name: 'Classic Herb Omelette',
    category: 'Healthy',
    calories: 180,
    macros: { carbs: 1.5, protein: 12, fat: 14 },
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=80',
    description: 'Fluffy whole eggs pan-whisked with green chilies, cilantro, and finely chopped red onions.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 large omelette (2 eggs)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'egg_curry',
    name: 'Savory Traditional Egg Curry',
    category: 'Indian Foods',
    calories: 240,
    macros: { carbs: 8, protein: 13, fat: 17 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Hard-boiled chicken eggs cooked inside a mildly spiced, herb-infused tomato and whole onion gravy.',
    baseRecommendation: 'Occasional',
    servingSize: '1 bowl (180g / 2 eggs)',
    burnMetrics: { walking: 68, running: 31, cardio: 26 }
  },
  {
    id: 'flavored_milk',
    name: 'Flavored Badam Milk',
    category: 'Snacks & Drinks',
    calories: 195,
    macros: { carbs: 24, protein: 7.2, fat: 7.5 },
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    description: 'Organic whole milk brewed with real saffron extract, ground raw almonds, and sweet organic cardamom.',
    baseRecommendation: 'Occasional',
    servingSize: '1 glass cup (240ml)',
    burnMetrics: { walking: 56, running: 25, cardio: 21 }
  },
  {
    id: 'milkshake',
    name: 'Rich Strawberry Milkshake',
    category: 'Snacks & Drinks',
    calories: 315,
    macros: { carbs: 46, protein: 6.5, fat: 12 },
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    description: 'Thick dairy beverage blended with sugary fruit purees, added refined sugar, and ice cream creams.',
    baseRecommendation: 'Avoid',
    servingSize: '1 large glass (300ml)',
    burnMetrics: { walking: 90, running: 41, cardio: 35 }
  },
  {
    id: 'idly_plain',
    name: 'Idly (Plain Soft)',
    category: 'Indian Foods',
    calories: 120,
    macros: { carbs: 24, protein: 4, fat: 0.5 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Soft and spongy steamed rice cake. Perfect for light breakfast or high-quality easily-digestible carbs.',
    baseRecommendation: 'Can Eat',
    servingSize: '2 items (100g)',
    burnMetrics: { walking: 34, running: 15, cardio: 13 }
  },
  {
    id: 'idly_rava',
    name: 'Rava Idly',
    category: 'Indian Foods',
    calories: 140,
    macros: { carbs: 26, protein: 5, fat: 1.5 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Steamed semolina cakes tempered with mustard seeds, cashews, and carrots. A flavorful and hearty breakfast option.',
    baseRecommendation: 'Can Eat',
    servingSize: '2 items (100g)',
    burnMetrics: { walking: 40, running: 18, cardio: 15 }
  },
  {
    id: 'idly_mini',
    name: 'Mini Idly',
    category: 'Indian Foods',
    calories: 110,
    macros: { carbs: 22, protein: 3.5, fat: 0.4 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Bite-sized soft steamed idlis served submerged in hot, flavorful sambar or paired with spicy gun powder.',
    baseRecommendation: 'Can Eat',
    servingSize: '10 mini pieces (100g)',
    burnMetrics: { walking: 31, running: 14, cardio: 11 }
  },
  {
    id: 'dosa_onion',
    name: 'Onion Dosa',
    category: 'Indian Foods',
    calories: 270,
    macros: { carbs: 41, protein: 5.5, fat: 9 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp, savory fermented rice and lentil crepe sprinkled generously with sweet finely chopped raw onions.',
    baseRecommendation: 'Occasional',
    servingSize: '1 standard item (160g)',
    burnMetrics: { walking: 77, running: 35, cardio: 29 }
  },
  {
    id: 'veg_biryani',
    name: 'Veg Biryani',
    category: 'Indian Foods',
    calories: 390,
    macros: { carbs: 55, protein: 10, fat: 12 },
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    description: 'Aromatic layered basmati rice cooked with fresh seasonal vegetables, herbs, cardamoms, and saffron.',
    baseRecommendation: 'Occasional',
    servingSize: '1 medium plate (300g)',
    burnMetrics: { walking: 112, running: 50, cardio: 42 }
  },
  {
    id: 'white_rice',
    name: 'Steamed White Rice',
    category: 'Indian Foods',
    calories: 195,
    macros: { carbs: 43, protein: 3.5, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Freshly steamed polished long-grain rice. Excellent simple carbohydrate source for quick physical energy.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 55, running: 25, cardio: 21 }
  },
  {
    id: 'brown_rice',
    name: 'Cooked Brown Rice',
    category: 'Indian Foods',
    calories: 165,
    macros: { carbs: 35, protein: 4, fat: 1.2 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Wholesome unpolished whole grain brown rice containing protective husk fibers and essential minerals.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 47, running: 21, cardio: 18 }
  },
  {
    id: 'lemon_rice',
    name: 'Zesty Lemon Rice',
    category: 'Indian Foods',
    calories: 240,
    macros: { carbs: 45, protein: 4.5, fat: 5 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Basmati rice cooked in refreshing citrus lemon extract and seasoned with crunchy peanuts, curry leaves, and ginger.',
    baseRecommendation: 'Occasional',
    servingSize: '1 plate (180g)',
    burnMetrics: { walking: 68, running: 31, cardio: 26 }
  },
  {
    id: 'curd_rice',
    name: 'Soothing Curd Rice',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 29, protein: 5, fat: 4.5 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional mashed rice blended with cooling probiotic-rich thick yogurt and seasoned with black mustard seeds.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (180g)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'pulihora',
    name: 'Tamarind Pulihora',
    category: 'Indian Foods',
    calories: 290,
    macros: { carbs: 54, protein: 4.8, fat: 6.2 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Festive yellow rice flavored with a tangy, spicy tamarind pulp concentrate and tempered with roasted split chickpea lentils.',
    baseRecommendation: 'Occasional',
    servingSize: '1 portion (200g)',
    burnMetrics: { walking: 83, running: 38, cardio: 32 }
  },
  {
    id: 'jeera_rice',
    name: 'Jeera Cumin Rice',
    category: 'Indian Foods',
    calories: 230,
    macros: { carbs: 44, protein: 4.2, fat: 4 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Fragrant Basmati grains pan-tossed in melted ghee with plenty of digestive whole cumin seeds.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (160g)',
    burnMetrics: { walking: 65, running: 30, cardio: 25 }
  },
  {
    id: 'fried_rice',
    name: 'Wok-Tossed Fried Rice',
    category: 'Indian Foods',
    calories: 340,
    macros: { carbs: 58, protein: 7, fat: 9 },
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    description: 'White rice stir-fried in a hot wok with chopped bell peppers, green peas, carrots, cabbage, and soy seasonings.',
    baseRecommendation: 'Occasional',
    servingSize: '1 plate (250g)',
    burnMetrics: { walking: 97, running: 44, cardio: 37 }
  },
  {
    id: 'pesarattu',
    name: 'Greengram Pesarattu',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 26, protein: 11, fat: 3.5 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Highly nutritious Andhra flat pancake prepared from fresh green moong beans and green chilies. Rich in vegetarian fibers.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 thin crepe (150g)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'pongal',
    name: 'Ven Pongal',
    category: 'Indian Foods',
    calories: 220,
    macros: { carbs: 34, protein: 5.5, fat: 7 },
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    description: 'Cozy mashed porridge cooked with raw rice, split yellow moong lentils, dynamic black pepper, ginger, and ghee.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 63, running: 28, cardio: 24 }
  },
  {
    id: 'uttapam',
    name: 'Onion Uttapam',
    category: 'Indian Foods',
    calories: 210,
    macros: { carbs: 36, protein: 5.2, fat: 4.8 },
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    description: 'Thick fermented savory pancake cooked with rice and black urad bean batter, smothered with chopped sweet onions and chilies.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 thick pancake (150g)',
    burnMetrics: { walking: 60, running: 27, cardio: 23 }
  },
  {
    id: 'roti_plain',
    name: 'Soft Plain Roti',
    category: 'Indian Foods',
    calories: 80,
    macros: { carbs: 17, protein: 2.8, fat: 0.4 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Soft Indian wheat round bread baked dry on a hot iron tawa without butter or additional fat. Excellent daily staple.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 piece (30g)',
    burnMetrics: { walking: 23, running: 10, cardio: 9 }
  },
  {
    id: 'phulka',
    name: 'Puffed Phulka Roti',
    category: 'Indian Foods',
    calories: 70,
    macros: { carbs: 15, protein: 2.5, fat: 0.3 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Light whole wheat puffed bread cooked directly on flame without oil, very light on stomach and rich in grain fiber.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 piece (25g)',
    burnMetrics: { walking: 20, running: 9, cardio: 8 }
  },
  {
    id: 'paratha_plain',
    name: 'Layered Plain Paratha',
    category: 'Indian Foods',
    calories: 220,
    macros: { carbs: 34, protein: 4.2, fat: 7.5 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Pan-fried golden wheat flatbread folded in circular or triangular layers with a splash of oil or ghee.',
    baseRecommendation: 'Occasional',
    servingSize: '1 piece (75g)',
    burnMetrics: { walking: 63, running: 28, cardio: 24 }
  },
  {
    id: 'paneer_paratha',
    name: 'Spiced Paneer Paratha',
    category: 'Indian Foods',
    calories: 290,
    macros: { carbs: 35, protein: 11, fat: 12 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Healthy wheat paratha filled generously with fresh high-calcium spiced scrambled paneer cottage cheese.',
    baseRecommendation: 'Occasional',
    servingSize: '1 standard piece (110g)',
    burnMetrics: { walking: 83, running: 38, cardio: 32 }
  },
  {
    id: 'rasam_soup',
    name: 'Tangy Rasam Soup',
    category: 'Indian Foods',
    calories: 60,
    macros: { carbs: 9, protein: 1.5, fat: 2 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'South Indian golden soup brewed with sour tamarind water, tomatoes, spicy black pepper, cumin seeds, and lentils.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (180g)',
    burnMetrics: { walking: 17, running: 8, cardio: 7 }
  },
  {
    id: 'rajma_masala',
    name: 'Rajma Masala Curry',
    category: 'Indian Foods',
    calories: 190,
    macros: { carbs: 24, protein: 8.5, fat: 7 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Red kidney beans simmered gently inside a robust spicy ginger-onion-tomato paste. Plentiful dietary fiber and iron.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 54, running: 25, cardio: 21 }
  },
  {
    id: 'chole_curry',
    name: 'Spiced Kabuli Chole',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 22, protein: 7.8, fat: 6.5 },
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=80',
    description: 'Protein-heavy garbanzo chickpeas boiled and simmered in a seasoned garlic, clove, and dried mango masala.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'paneer_butter_masala',
    name: 'Paneer Butter Masala',
    category: 'Indian Foods',
    calories: 360,
    macros: { carbs: 12, protein: 13, fat: 29 },
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    description: 'Juicy milk cottage cheese blocks bathed inside a heavy satin gravy cooked with tomato paste, butter, cream, and cashews.',
    baseRecommendation: 'Avoid',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 103, running: 47, cardio: 40 }
  },
  {
    id: 'chicken_curry',
    name: 'Homestyle Chicken Curry',
    category: 'Indian Foods',
    calories: 240,
    macros: { carbs: 8, protein: 22, fat: 13 },
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
    description: 'Moist chicken blocks braised inside a comforting pan gravy consisting of caramelized onions, garlic, and red chili spices.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 bowl (150g)',
    burnMetrics: { walking: 68, running: 31, cardio: 26 }
  },
  {
    id: 'mutton_biryani',
    name: 'Royal Mutton Biryani',
    category: 'Indian Foods',
    calories: 540,
    macros: { carbs: 56, protein: 29, fat: 22 },
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    description: 'Rich festive long-grain basmati rice steamed with marinated goat meat, cardamoms, cinnamon, and plenty of pure ghee.',
    baseRecommendation: 'Avoid',
    servingSize: '1 plate (350g)',
    burnMetrics: { walking: 154, running: 70, cardio: 60 }
  },
  {
    id: 'fish_fry_slice',
    name: 'Spiced Fish Fry',
    category: 'Indian Foods',
    calories: 280,
    macros: { carbs: 6, protein: 20, fat: 19 },
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    description: 'Fish fillets coated in aromatic spices and shallow pan-fried till gold and crispy. Loaded with omega-3 fatty acids.',
    baseRecommendation: 'Occasional',
    servingSize: '1 piece (120g)',
    burnMetrics: { walking: 80, running: 36, cardio: 31 }
  },
  {
    id: 'pakoda_onion',
    name: 'Onion Pakoda',
    category: 'Indian Foods',
    calories: 240,
    macros: { carbs: 22, protein: 4, fat: 15 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Delectfully crispy, deep-fried sliced onions mixed inside a savory spiced chickpea flour (besan) batter.',
    baseRecommendation: 'Avoid',
    servingSize: '1 small plate (80g)',
    burnMetrics: { walking: 68, running: 31, cardio: 26 }
  },
  {
    id: 'veg_puff',
    name: 'Savory Veg Puff',
    category: 'Indian Foods',
    calories: 280,
    macros: { carbs: 32, protein: 4.5, fat: 16 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Puff pastry sheets folded over spiced smashed potatoes and green peas, baked with generous butter for crispiness.',
    baseRecommendation: 'Avoid',
    servingSize: '1 pastry (90g)',
    burnMetrics: { walking: 80, running: 36, cardio: 31 }
  },
  {
    id: 'murukku_crisp',
    name: 'Savory Fried Murukku',
    category: 'Indian Foods',
    calories: 150,
    macros: { carbs: 18, protein: 2.2, fat: 8 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp spiral shaped fried snack prepared with rice flour and black gram flour, seasoned with sesame and carom seeds.',
    baseRecommendation: 'Avoid',
    servingSize: '3 small pieces (30g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'mixture_snack',
    name: 'South Indian Mixture',
    category: 'Indian Foods',
    calories: 160,
    macros: { carbs: 15, protein: 3, fat: 10 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Addictive snack mix of salted gram flour sev, peanuts, boondi, and curry leaves deep fried to crunchiness.',
    baseRecommendation: 'Avoid',
    servingSize: '1 portion (30g)',
    burnMetrics: { walking: 46, running: 21, cardio: 18 }
  },
  {
    id: 'gulab_jamun',
    name: 'Sweet Gulab Jamun',
    category: 'Indian Foods',
    calories: 150,
    macros: { carbs: 24, protein: 2.5, fat: 5 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Spun milk-solid balls deep fried in clean oil and fully saturated with sugar syrup and sweet saffron extracts.',
    baseRecommendation: 'Avoid',
    servingSize: '1 medium piece (45g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'rasgulla_sweet',
    name: 'Sweet Rasgulla',
    category: 'Indian Foods',
    calories: 125,
    macros: { carbs: 26, protein: 3, fat: 1 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Spongy soft white cottage cheese chhena balls kneaded and simmered inside hot light sugar syrup.',
    baseRecommendation: 'Avoid',
    servingSize: '1 cottage sweet (50g)',
    burnMetrics: { walking: 36, running: 16, cardio: 14 }
  },
  {
    id: 'besan_laddu',
    name: 'Rava Besan Laddu',
    category: 'Indian Foods',
    calories: 185,
    macros: { carbs: 25, protein: 3.2, fat: 8 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Roasted split chickpea semolina ball bound together with clarified sugar, warm ghee, and chopped cashew nuts.',
    baseRecommendation: 'Avoid',
    servingSize: '1 piece (45g)',
    burnMetrics: { walking: 53, running: 24, cardio: 21 }
  },
  {
    id: 'jalebi_rings',
    name: 'Sweet Crispy Jalebi',
    category: 'Indian Foods',
    calories: 150,
    macros: { carbs: 28, protein: 1, fat: 4 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp coiled rings of fermented flour batter deep-fried, then immediately steeped inside boiled sugar solution.',
    baseRecommendation: 'Avoid',
    servingSize: '2 small rings (50g)',
    burnMetrics: { walking: 43, running: 19, cardio: 16 }
  },
  {
    id: 'kaju_katli',
    name: 'Cashew Kaju Katli',
    category: 'Indian Foods',
    calories: 120,
    macros: { carbs: 14, protein: 2.8, fat: 6 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Cashew paste confectioners diamonds sweetened gently with fine sugar crystals and flavored with rose silver foil tags.',
    baseRecommendation: 'Avoid',
    servingSize: '1 sweet diamond (30g)',
    burnMetrics: { walking: 34, running: 16, cardio: 13 }
  },
  {
    id: 'mysore_pak_ghee',
    name: 'Rich Mysore Pak',
    category: 'Indian Foods',
    calories: 190,
    macros: { carbs: 22, protein: 2, fat: 11 },
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    description: 'Delectable sweet prepared from golden chickpea flour simmered inside boiling ghee butter fat and thick sugar syrup.',
    baseRecommendation: 'Avoid',
    servingSize: '1 block (40g)',
    burnMetrics: { walking: 54, running: 25, cardio: 21 }
  },
  {
    id: 'payasam_kheer',
    name: 'Sweet Milk Payasam',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 32, protein: 4.8, fat: 3.5 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Boiled milk pudding studded with sweet vermicelli or rice grains, cardamoms, fried raisins, and cashews.',
    baseRecommendation: 'Avoid',
    servingSize: '1 bowl (155g)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'buttermilk_spiced',
    name: 'Probiotic Buttermilk',
    category: 'Snacks & Drinks',
    calories: 45,
    macros: { carbs: 4.8, protein: 3.2, fat: 1.5 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Refreshing churned sour yogurt water infused with black salt, cumin seeds powder, dynamic ginger, and cilantro flakes.',
    baseRecommendation: 'Can Eat',
    servingSize: '1 glass (200ml)',
    burnMetrics: { walking: 13, running: 6, cardio: 5 }
  },
  {
    id: 'lassi_sweet',
    name: 'Creamy Sweet Lassi',
    category: 'Snacks & Drinks',
    calories: 190,
    macros: { carbs: 28, protein: 5.5, fat: 6 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Creamy sweet whipped yogurt drink made with fresh thick milk curds and customized sugar syrup swirls.',
    baseRecommendation: 'Occasional',
    servingSize: '1 glass (220ml)',
    burnMetrics: { walking: 54, running: 25, cardio: 21 }
  },
  {
    id: 'badam_milk_drink',
    name: 'Warm Badam Milk',
    category: 'Snacks & Drinks',
    calories: 180,
    macros: { carbs: 24, protein: 6.8, fat: 6.5 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Milk simmered slow with toasted almond powder, saffron, vanilla cardamoms, and healthy sugar crystals.',
    baseRecommendation: 'Occasional',
    servingSize: '1 glass (200ml)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  },
  {
    id: 'sugarcane_juice_fresh',
    name: 'Sugarcane Juice',
    category: 'Snacks & Drinks',
    calories: 130,
    macros: { carbs: 32, protein: 0.5, fat: 0 },
    image: 'https://images.unsplash.com/photo-1534050359345-422179b50d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Squeezed sweet nectar of raw sugarcane stalks infused lightly with zesty lime extract and fresh ginger juice.',
    baseRecommendation: 'Avoid',
    servingSize: '1 glass (250ml)',
    burnMetrics: { walking: 37, running: 17, cardio: 14 }
  },
  {
    id: 'pani_puri',
    name: 'Pani Puri / Golgappa',
    category: 'Indian Foods',
    calories: 180,
    macros: { carbs: 30, protein: 3, fat: 6 },
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=80',
    description: 'Crispy fried hollow dough balls stuffed with spiced potatoes, sprouts, and filled with highly seasoned flavored water.',
    baseRecommendation: 'AVOID FREQUENTLY',
    servingSize: '1 plate (6 pieces)',
    burnMetrics: { walking: 51, running: 23, cardio: 20 }
  }
];

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

export function classifyBMI(bmi: number): BMIClassification {
  if (bmi < 16) return 'Critical Zone';
  if (bmi >= 16 && bmi < 18.5) return 'Recovery Zone';
  if (bmi >= 18.5 && bmi < 20) return 'Beginner Fit';
  if (bmi >= 20 && bmi < 23) return 'Fit';
  if (bmi >= 23 && bmi < 25) return 'Strong Fit';
  if (bmi >= 25 && bmi < 27.5) return 'Fitness Warning';
  if (bmi >= 27.5 && bmi < 30) return 'High Risk Fit';
  return 'Critical Risk';
}

export function normalizeBMICategory(cat: string): BMIClassification {
  const norm = cat ? cat.trim() : '';
  if (norm === 'Critical Zone' || norm === 'Severe Underweight' || norm === 'Severe Thinness') return 'Severe Underweight' as any;
  if (norm === 'Recovery Zone' || norm === 'Underweight' || norm === 'Moderate Underweight' || norm === 'Moderate Thinness') return 'Moderate Underweight' as any;
  if (norm === 'Beginner Fit' || norm === 'Near Healthy') return 'Healthy' as any;
  if (norm === 'Fit' || norm === 'Healthy' || norm === 'Healthy Weight' || norm === 'Normal') return 'Healthy' as any;
  if (norm === 'Strong Fit' || norm === 'Optimal Healthy') return 'Healthy' as any;
  if (norm === 'Fitness Warning' || norm === 'Overweight Risk' || norm === 'Overweight') return 'Overweight' as any;
  if (norm === 'High Risk Fit' || norm === 'Obesity Risk' || norm === 'Obesity I') return 'Obesity I' as any;
  if (norm === 'Critical Risk' || norm === 'Obese' || norm.includes('Class') || norm.includes('Obese') || norm.includes('Obesity')) return 'Obesity II' as any;
  return cat as BMIClassification;
}

export function getMotivationalMessage(classification: BMIClassification): string {
  const norm = normalizeBMICategory(classification);
  switch (norm) {
    case 'Severe Underweight':
      return 'Essential health boost: Focus on high-quality carbohydrate energy and healthy nutrient-dense fats. Gentle walks support metabolic rates.';
    case 'Moderate Underweight':
      return 'Strength in progress: Gradual complex calorie increments coupled with muscle loading will guide you securely to your fitness peak.';
    case 'Mild Underweight':
      return 'A slight swap towards pure proteins and whole healthy fats like almonds and avocados can bring you to optimal balance.';
    case 'Healthy':
      return 'Exceptional balance! You are in the optimal health zone. Maintain this vibrant vitality with active daily walking and fiber.';
    case 'Overweight':
      return 'Excellent start! Swapping dense processed carbs for whole raw veggies and meeting your daily steps preserves your metabolic edge.';
    case 'Obesity I':
      return 'Steady joint-safe progress: Aim for consistent low-impact steps. Every block walked is a phenomenal victory for cardiovascular tissue.';
    case 'Obesity II':
      return 'HealthMate guide: Focus on joint protection, hydration, and organic green vegetable-centered nutrition to accelerate your goals.';
    case 'Obesity III':
      return 'Outstanding commitment: Small steady habits build life-changing, durable results. We walk calmly and fuel mindfully.';
    default:
      return 'Maintain active wellness with consistent daily steps, high hydration, and organic fibers.';
  }
}

const baseRecommendationsMap: Record<
  'Severe Underweight' | 'Moderate Underweight' | 'Mild Underweight' | 'Healthy' | 'Overweight' | 'Obesity I' | 'Obesity II' | 'Obesity III', 
  { Breakfast: string[]; Lunch: string[]; Snacks: string[]; Dinner: string[]; }
> = {
  'Severe Underweight': {
    Breakfast: ['Water or milk cooked Oats with sliced Banana and honey', '2 whole boiled Eggs with warm dynamic multi-grain toast', 'Warm loaded Upma with a handful of raw almonds'],
    Lunch: ['Thick steamed Rice with Ghee, yellow Dal and cooked potato Curry', '2 wheat Chapatis with creamy Paneer Sabzi and green cucumber salad', 'Shredded Chicken with butter rice and carrots'],
    Snacks: ['Handful of raw cashews, walnuts or almonds', 'Banana peanut butter sandwich', 'Fresh fruit milkshakes'],
    Dinner: ['Thick mixed Dal with 2 buttered wheat Chapatis', 'Rice with nutritious black bean curry and mixed green stir-fry', 'Hot chicken clear soup with extra olive oil and soft roti']
  },
  'Moderate Underweight': {
    Breakfast: ['Oats cooked with standard cow milk and sliced Banana', '2 whole boiled Eggs with a side of apple slices', 'Nutritious Upma loaded with roasted cashews and carrots'],
    Lunch: ['Wholesome bowl of steamed Rice, thick yellow Dal, and potato curry', '2 soft wheat Chapatis with nutritious Paneer Curry and fresh green salad', 'Cooked Roti with loaded chicken stew'],
    Snacks: ['Handful of raw almonds and green tea', 'Banana peanut butter toast', '1 boiled egg with black coffee'],
    Dinner: ['2 soft wheat Chapatis with ghee and yellow Dal', 'Plain steamed Rice with mixed vegetable curry and simple salad', 'Light chicken soup with a soft Chapati piece']
  },
  'Mild Underweight': {
    Breakfast: ['Oats with milk, honey, and half a sliced Banana', '2 boiled Eggs with warm dynamic wheat toast', 'Soft vegetable Upma with cucumber slices'],
    Lunch: ['Steamed Rice with yellow Dal Tadka and non-starchy vegetable Curry', '2 warm wheat Chapatis with Paneer Curry and fresh salad', 'Mild Chicken Biryani with cucumber raita'],
    Snacks: ['Handful of raw almonds or walnuts', 'Nutrient-rich peanut butter toast', 'Boiled egg white with unsweetened coffee'],
    Dinner: ['2 soft wheat Chapatis with thick lentil Dal', 'Steamed Rice with mixed vegetable curry and simple salad', 'Warm chicken clear broth with roti']
  },
  'Healthy': {
    Breakfast: ['2 steamed Idlis with coconut chutney and hot Sambar', 'Wholesome hot Oats with a whole Banana and milk', 'Savory vegetable Upma or 2 boiled Eggs with warm tea'],
    Lunch: ['Wholesome bowl of plain Rice, yellow Dal, and fresh Salad', '2 soft wheat Chapatis with mixed vegetable Curry and cucumber', 'Grilled Paneer with steamed veggies and light rice'],
    Snacks: ['Fresh raw Apple or orange slices', 'Low-fat Greek yogurt with sliced Banana', 'Green tea with roasted almonds'],
    Dinner: ['2 light wheat Chapatis with herbed yellow Dal', 'Light vegetable Soup with low-oil vegetable Rice', 'Curry bowl with soft Roti and fresh salad pieces']
  },
  'Overweight': {
    Breakfast: ['Hot Oats prepared in water with minor apple chunks', '2 Boiled egg whites with warm lemon water or tea', 'One steamed Idli with zero-oil vegetable Sambar'],
    Lunch: ['Small bowl of brown or steamed Rice with thick Dal and hot vegetable Curry', '2 small wheat Chapatis with green salad and paneer/lentil curry', 'Large mixed green fresh Salad with herbed dal soup'],
    Snacks: ['Fresh sliced cucumber and carrot sticks', 'Warm organic Green Tea with 5 almonds', 'Fresh Orange or raw Apple slices'],
    Dinner: ['1 plain wheat Chapati with clear vegetable Soup', 'Sautéed vegetable salad with light herbed Dal', 'Light veggie meals (steamed cauliflower and peas, no rice)']
  },
  'Obesity I': {
    Breakfast: ['Plain Oats cooked in hot water (no sugar) with half a Banana', '2 hard boiled egg whites with Green Tea', 'Warm lemon water with a small plate of raw cucumber slices'],
    Lunch: ['Generous portion of green garden Salad with a small cup of herbed Dal', '1 small dry Chapati with non-starchy vegetable Curry', 'Steam-cooked tofu cube salad with clear vegetable soup'],
    Snacks: ['A few raw almond nuts and cucumber slices', 'Warm green tea with no added sugar', 'Light fresh Apple and celery sticks'],
    Dinner: ['Warm clear Soup (tomato, lentil, or chicken broth) with steamed broccoli', '1 soft Chapati (no ghee/oil) served with light boiled Dal', 'Stewed mixed vegetables (carrots, green beans, peas)']
  },
  'Obesity II': {
    Breakfast: ['Water-cooked Oats (no cream/sugar) with cardamom sprinkles', '2 hard boiled egg whites with Warm Lemon Water', 'A cup of light papaya or melon slices with green tea'],
    Lunch: ['Cucumber, tomato, and spinach salad with lime juice dressing & a cup of clear Dal', 'Steamed cauliflower, broccoli, and light tofu cubes', '1 small wheat Chapati with light mixed non-starchy veggie curry'],
    Snacks: ['Raw celery sticks with salt and pepper', 'Warm green tea with no sugars', 'Slices of crisp fresh cucumber'],
    Dinner: ['Rich clear vegetable broth with cabbage, mushrooms, and carrots', 'Half dry Chapati with warm non-fat lentil soup', 'Light steamed cabbage & carrots sprinkled with black pepper']
  },
  'Obesity III': {
    Breakfast: ['Hot raw Oats prepared in pure water (no sweetener)', '2 hard boiled egg whites', 'Thick organic Green Tea with real lemon juice'],
    Lunch: ['Large bowl of leafy green garden salad with cucumber and minor clear tomato lintels', 'Steamed broccoli and non-fat paneer/tofu cubes', 'Light clear vegetable soup with a side of unsalted cucumbers'],
    Snacks: ['Green tea with high-fiber cucumber slices', 'Raw celery sticks or a small raw apple', 'Sugar-free lemon water'],
    Dinner: ['Mixed clear soup cooked with spinach, peas, and green beans', 'Steamed cauliflower mash with light boiled yellow dal', 'Fresh raw vegetable salad with zero dressings (pure lime juice)']
  }
};

export const DIET_RECOMMENDATIONS_MAP: Record<BMIClassification, {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
}> = {
  ...baseRecommendationsMap,
  'Critical Zone': baseRecommendationsMap['Severe Underweight'],
  'Recovery Zone': baseRecommendationsMap['Moderate Underweight'],
  'Beginner Fit': baseRecommendationsMap['Healthy'],
  'Fit': baseRecommendationsMap['Healthy'],
  'Strong Fit': baseRecommendationsMap['Healthy'],
  'Fitness Warning': baseRecommendationsMap['Overweight'],
  'High Risk Fit': baseRecommendationsMap['Obesity I'],
  'Critical Risk': baseRecommendationsMap['Obesity II'],
  'Underweight': baseRecommendationsMap['Mild Underweight'],
  'Near Healthy': baseRecommendationsMap['Healthy'],
  'Optimal Healthy': baseRecommendationsMap['Healthy'],
  'Overweight Risk': baseRecommendationsMap['Overweight'],
  'Obesity Risk': baseRecommendationsMap['Obesity I'],
  'Obese': baseRecommendationsMap['Obesity II'],
  'Healthy Weight': baseRecommendationsMap['Healthy'],
  'Normal': baseRecommendationsMap['Healthy'],
  'Severe Thinness': baseRecommendationsMap['Severe Underweight'],
  'Moderate Thinness': baseRecommendationsMap['Moderate Underweight'],
  'Mild Thinness': baseRecommendationsMap['Mild Underweight'],
  'Obesity Class I': baseRecommendationsMap['Obesity I'],
  'Obesity Class II': baseRecommendationsMap['Obesity II'],
  'Obesity Class III': baseRecommendationsMap['Obesity III'],
  'Obese Class I': baseRecommendationsMap['Obesity I'],
  'Obese Class II': baseRecommendationsMap['Obesity II'],
  'Obese Class III': baseRecommendationsMap['Obesity III']
};

export interface MealPlan {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
}

export function getPersonalizedMealSuggestions(
  bmiClassification: BMIClassification,
  userAge: number,
  activityLevel: 'sedentary' | 'moderate' | 'active',
  userGender?: 'male' | 'female' | 'other'
): MealPlan {
  const norm = normalizeBMICategory(bmiClassification);
  const category = DIET_RECOMMENDATIONS_MAP[norm] || DIET_RECOMMENDATIONS_MAP['Healthy'];
  return {
    Breakfast: [...category.Breakfast],
    Lunch: [...category.Lunch],
    Snacks: [...category.Snacks],
    Dinner: [...category.Dinner]
  };
}

export function getFoodRecommendation(food: any): 'RECOMMENDED' | 'MODERATION' | 'LIMIT INTAKE' | 'AVOID FREQUENTLY' {
  if (!food) return 'MODERATION';
  const rec = String(food.baseRecommendation || "").trim().toUpperCase();
  const cat = String(food.category || "").trim().toLowerCase();
  const name = String(food.name || "").trim().toLowerCase();
  const id = String(food.id || "").trim().toLowerCase();
  const calories = Number(food.calories || 0);

  // 1. Recommended items
  if (
    rec === 'RECOMMENDED' || 
    rec === 'CAN EAT' || 
    cat === 'healthy' || 
    id === 'apple' || 
    id === 'idli' || 
    id === 'rava_idly' || 
    id === 'mini_idly' || 
    id === 'palak_paneer' || 
    id === 'dhokla' || 
    id === 'khichdi' || 
    id === 'boiled_egg' || 
    id === 'egg_whites' || 
    id === 'water' || 
    id.includes('salad') || 
    name.includes('salad') || 
    id === 'broccoli' || 
    name.includes('broccoli') || 
    name.includes('spinach') || 
    id.includes('spinach')
  ) {
    if (calories > 350 && (id.includes('pizza') || name.includes('pizza') || id.includes('biryani') || name.includes('biryani') || id.includes('burger') || name.includes('burger'))) {
      return 'AVOID FREQUENTLY';
    }
    return 'RECOMMENDED';
  }

  // 2. Avoid frequently
  if (
    rec === 'AVOID' || 
    rec === 'AVOID FREQUENTLY' || 
    cat === 'fast food' || 
    cat === 'snacks & drinks' || 
    cat === 'junk' || 
    id.includes('pizza') || 
    name.includes('pizza') || 
    id === 'burger' ||
    id.includes('burger') || 
    name.includes('burger') || 
    id === 'fries' ||
    id.includes('fries') || 
    name.includes('fries') || 
    id.includes('samosa') || 
    name.includes('samosa') || 
    id.includes('soda') || 
    name.includes('soda') || 
    id.includes('cola') || 
    name.includes('cola') || 
    id.includes('sweet') || 
    name.includes('sweet') || 
    id.includes('jamun') || 
    name.includes('jamun') || 
    id.includes('bhature') || 
    name.includes('bhature') || 
    calories >= 350
  ) {
    return 'AVOID FREQUENTLY';
  }

  // 3. Limit intake
  if (
    rec === 'LIMIT INTAKE' || 
    id.includes('paratha') || 
    name.includes('paratha') || 
    id.includes('naan') || 
    name.includes('naan') || 
    id.includes('vada') || 
    name.includes('vada') || 
    id.includes('bhurji') || 
    name.includes('bhurji') || 
    calories >= 220
  ) {
    return 'LIMIT INTAKE';
  }

  // 4. Moderation
  return 'MODERATION';
}

export function getPersonalizedFoodIntelligence(
  food: FoodItem,
  bmiClassification: BMIClassification,
  userAge: number,
  activityLevel: 'sedentary' | 'moderate' | 'active',
  userGender?: 'male' | 'female' | 'other'
): PersonalizedAdvice {
  const verdict = getFoodRecommendation(food);

  let colorClass = 'bg-yellow-500/10 border-yellow-500/30';
  let textColorClass = 'text-yellow-400';
  let badgeColorClass = 'bg-yellow-500/20 text-yellow-300';
  let warningText = '';
  let intakeGuidance = '';
  let suggestedWorkout = 'Brisk Walking';
  let workoutIcon = 'Smile';

  if (verdict === 'RECOMMENDED') {
    colorClass = 'bg-emerald-500/10 border-emerald-500/30';
    textColorClass = 'text-emerald-400';
    badgeColorClass = 'bg-emerald-500/20 text-emerald-300';
    warningText = `Excellent choice! "${food.name}" is highly nutritious, low in unhealthy fats, and packed with natural energy. This food perfectly supports your fitness and wellness goals.`;
    intakeGuidance = `Great to eat any time as a meal or snack. Keep portions natural and enjoy regularly as a healthy staple.`;
    suggestedWorkout = 'Light Stroll';
    workoutIcon = 'Smile';
  } else if (verdict === 'MODERATION') {
    colorClass = 'bg-yellow-500/10 border-yellow-500/30';
    textColorClass = 'text-yellow-400';
    badgeColorClass = 'bg-yellow-500/20 text-yellow-300';
    warningText = `A balanced everyday option. "${food.name}" provides healthy energy, but should be consumed mindfully. It is perfect for active days in normal quantities.`;
    intakeGuidance = `Enjoy in normal serving sizes. Savoring it slowly and pairing it with a glass of water is a clever choice.`;
    suggestedWorkout = 'Brisk Walking';
    workoutIcon = 'Activity';
  } else if (verdict === 'LIMIT INTAKE') {
    colorClass = 'bg-orange-500/10 border-orange-500/30';
    textColorClass = 'text-orange-400';
    badgeColorClass = 'bg-orange-500/20 text-orange-300';
    warningText = `Consume sparingly. "${food.name}" contains higher sodium or oil content than ideal. Enjoy this occasionally and avoid making it a daily habit.`;
    intakeGuidance = `Stick to smaller portions. Balance this meal with plenty of fresh high-fiber greens or veggies later in the day.`;
    suggestedWorkout = 'Active Jogging';
    workoutIcon = 'Zap';
  } else { // AVOID FREQUENTLY
    colorClass = 'bg-[#ffe4e6]/5 border-[#f43f5e]/30';
    textColorClass = 'text-rose-400';
    badgeColorClass = 'bg-rose-500/20 text-rose-300';
    warningText = `Highly processed option with dense calories and trans fats. "${food.name}" is a heavy caloric treat that can easily stall your weight control goals.`;
    intakeGuidance = `Enjoy very rarely as a special treat. Share a portion with friends or balance it with an extra active walk afterwards.`;
    suggestedWorkout = 'Cardio Workout';
    workoutIcon = 'Flame';
  }

  // Calculate workoutDuration
  const multiplier = activityLevel === 'sedentary' ? 1.2 : activityLevel === 'active' ? 0.8 : 1.0;
  const rawDuration = Math.round((food.calories / 5.0) * multiplier);
  const workoutDuration = Math.max(5, Math.min(120, rawDuration));

  return {
    verdict,
    colorClass,
    textColorClass,
    badgeColorClass,
    warningText,
    intakeGuidance,
    suggestedWorkout,
    workoutDuration,
    workoutIcon
  };
}
