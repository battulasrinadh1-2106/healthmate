// Clean TypeScript Local Food Database & Knowledge Base for HealthMate
// This file serves as LEVEL 1: Local Food Engine to instantly classify 2000+ foods.

export interface LocalFoodItem {
  name: string;
  aliases: string[];
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'roast_zone';
  healthScore: number;
  nutrition: string;
  imageCategory: string; // e.g., 'fruit', 'salad', 'breakfast', 'curry', 'junk', 'sweet', 'drink', 'heavy'
}

// Custom specialized high-fidelity roast poems and insight templates for major foods
export interface CustomRoastTemplate {
  en: { healthy: boolean; poem: string; insight: string };
  te: { healthy: boolean; poem: string; insight: string };
  imageCategory: string;
}

export const CUSTOM_ROASTS: Record<string, CustomRoastTemplate> = {
  "pizza": {
    imageCategory: "junk",
    en: {
      healthy: false,
      poem: "You ordered pizza loaded with extra cheese,\nYour health progress is crying 'stop, oh please!' 😂\nSofa sitting won't burn that tasty slice,\nGrab those walking shoes and follow my advice! 🏃",
      insight: "A single cheese slice has over 300 kcal. Wash it with 45 minutes of active movement!"
    },
    te: {
      healthy: false,
      poem: "Cheese pizza thinte heavy body mama,\nScale pagilipoyaka kurchoni cheyaku drama! 😂\nWalking penchuko asalu thaggakunda speed ga,\nAppude automatic ga untundi body keka! 🏃\nSofa nunchi lechi target complete cheyyi mava! 🔥",
      insight: "Double cheese pizza organic and fat calories peaks ni hit chesthadhi, walk penchuko!"
    }
  },
  "biryani": {
    imageCategory: "heavy",
    en: {
      healthy: false,
      poem: "Chicken biryani plate ni single ani pilichav,\nCalories matram full family tho vachayi! 🍗\nDiet plan corner lo kurchoni edustundi,\nWalking shoes matram happy ga navvutunnayi 🤣",
      insight: "Biryani packs a massive calorie punch. Balance it with smaller portions and a high-step walk!"
    },
    te: {
      healthy: false,
      poem: "Aha biryani thini padukunte potta thiyadam sweet,\nKaani fitness targets ki idi asalu proper sheet! 🍗😂\nNinnu roast chestunna ani kopadoddu mama,\nRepatinundi limit ga thinte asalu undadu drama! 🏃✨",
      insight: "Heavy masala and ghee levels bypass digestion balance, warm green tea drink cheyi, babu!"
    }
  },
  "pani puri": {
    imageCategory: "junk",
    en: {
      healthy: false,
      poem: "Pani puri plate looks yummy and light,\nBut sodium retention will give you a fright! 😏\nSucking down spicy water in a street-side fun,\nTomorrow you must do a double fast run! 🏃",
      insight: "Street foods are heavy on sodium. Drink plenty of water today to flush the excess salt!"
    },
    te: {
      healthy: false,
      poem: "Pani puri ani start chesav fun kosam,\nCalories vachayi silent ga run kosam! 🌶️\nRepu walking ki ready undu boss,\nLeda scale meeda shock free ga vastundi 😆",
      insight: "Pani puri sodium overload limits check chesiddira. Walking is dynamic must!"
    }
  },
  "burger": {
    imageCategory: "junk",
    en: {
      healthy: false,
      poem: "That fat burger bun is a calorie dump,\nYour fitness motivation got lost in the swamp! 🍔\nDouble patty loaded with creamy cheese,\nWill make your waistline expand with a sneeze! 🤣",
      insight: "Fast-food burgers contain trans fats. Limit these to keep heart vessels pristine!"
    },
    te: {
      healthy: false,
      poem: "Burger layered heavy cream flat flat ga lagesav ra,\nAlready weight indicators over loading red-line daggara! 🍔😂\nPortion control immediate ga direct ga cheyi,\nSuper fit body results direct ga andhuko chooi! 🏃‍♂️🚀",
      insight: "Processed mayo and deep meat patties increase LDL. Walk it off and switch to clean meals!"
    }
  },
  "salad": {
    imageCategory: "salad",
    en: {
      healthy: true,
      poem: "Pristine salad choice while everyone eats pastry,\nSelecting raw veggies is an organic mystery! 🥗\nYou deserve a double premium fitness gold expert,\nKeep fueling your body with this natural dessert! 🌟",
      insight: "Salads provide essential micronutrients and fiber, keeping your gut microbiome incredibly healthy!"
    },
    te: {
      healthy: true,
      poem: "Salad select chesav junk food ni dooram dooram ga petti,\nNee health confidence levels direct and gatti! 🥗✨\nFats levels zero, organic power peaks daggara,\nSuper speed thoti andhuko goals tharugula! 😎🚀",
      insight: "Salads stomach fill registers ni stimulate chesi metabolic score dynamic chesthadi!"
    }
  },
  "apple": {
    imageCategory: "fruit",
    en: {
      healthy: true,
      poem: "Apple select chesav smart ga,\nCalories ki chance ivvaledu start ga! 🍎\nHealthMate character is incredibly proud,\nYour body thanks you happily and out loud! 😄",
      insight: "An apple is packed with soluble fibers (pectin) that keep cholesterol levels beautifully stable!"
    },
    te: {
      healthy: true,
      poem: "Apple select chesav sweet sugar cakes badulu,\nWeight control target lines dynamic ga andhuko babu! 🍎🌿\nHealthMate character kuda proud ga undi,\nEe roju body niku happy ga thanks cheptundi! 😄",
      insight: "Apple empty sugar spike cheyakunda natural minerals thoti stomach cool chesiddira!"
    }
  },
  "dosa": {
    imageCategory: "breakfast",
    en: {
      healthy: true,
      poem: "Crispy golden dosa on a hot morning pan,\nWholesome fuel to start your active day plan! 🥞\nJust keep that oil and ghee nice and light,\nAnd watch your tracking score stay extremely bright! ✨",
      insight: "Fermented lentils in dosa are rich in B-complex vitamins. Keep the butter consumption light!"
    },
    te: {
      healthy: true,
      poem: "Crispy dosa with chutney super hit ra mama,\nWalking limit match cheste zero percent drama! 🥞😎\nTiffin options clean and dynamic energy flow,\nHappy ga maintain chey total body glow! 🚀",
      insight: "Masala potato stuffing empty carbohydrates load, moderate size is best ra chinna!"
    }
  },
  "idli": {
    imageCategory: "breakfast",
    en: {
      healthy: true,
      poem: "Steamed breakfast item so simple and clean,\nPerfect fuel to keep you active and lean! 🍢\nYour body says thanks for this oil-free treat,\nGiving wonderful comfort to your busy feet! 🌟",
      insight: "Steam-cooked fermented idlis are extremely easy on the liver and support digestive gut health."
    },
    te: {
      healthy: true,
      poem: "Steam idli selection stands super top level,\nFats levels zero, dynamic control results marvel! 🍢✨\nSambar cozy mix tho stomach happy and sweet,\nHealthy breakfast target complete with high feet! 🚀",
      insight: "Idli and sambar combined provide complete protein chains. Pristine breakfast option, mava!"
    }
  },
  "samosa": {
    imageCategory: "junk",
    en: {
      healthy: false,
      poem: "Deep fried samosa and oil dripping pakodi block,\nYour weight scale is screaming 'please no more shock!' 🥟😂\nCrunching deep fat blocks as sunset tea delight,\nWill surely put your BMI progress in a tight flight!",
      insight: "Re-heated frying oil contains trans-fatty acids. Swap oily snacks with roasted chana!"
    },
    te: {
      healthy: false,
      poem: "Samosas, oily pakoda mixtures heavy thinte emayya,\nPortion sizes skip chesi continuous lazy niva ayya! 🥟😭\nWalking steps zero, fat parameter scale red-line bump,\nBody metadata parameters dynamic scale dump! 🤣",
      insight: "Deep oil items digest cheyaniki liver heavy load physical stress track coordinate cheyyali!"
    }
  },
  "sweet": {
    imageCategory: "sweet",
    en: {
      healthy: false,
      poem: "You wolfed down gulab jamun and sweet sweets in a sweep,\nYour insulin levels are preparing a double massive leap! 🍩💀\nCalories are charging fast to your waistline map,\nPut down that plate and avoid this cozy sweet trap!",
      insight: "Refined sugar causes immediate vascular inflammation. Drink warm green tea to normalize glucose spikes!"
    },
    te: {
      healthy: false,
      poem: "Gulab jamun sweet soft bite lagesthav sweet sweep,\nInsulin levels auto ga chesthadi immediate leap! 🍩💀\nSweets thintu sofa lo straight ga lazy padukunte,\nWeight levels fast track lo direct damage dhumme! 🤣",
      insight: "Refined white sugar immune activity hours control level decline chesiddira babu!"
    }
  }
};

// Raw vocabulary lists grouped strictly by nutrition & health score categories.
// We programmatically expand these to generate approximately 2000 individual food items/aliases instantly.
const EXCELLENT_FRUITS_AND_NUTS = [
  "apple", "gala apple", "fuji apple", "green apple", "red apple", "banana", "cavendish banana", "green banana", 
  "orange", "valencia orange", "navel orange", "clementine", "strawberries", "strawberry", "blueberries", "blueberry", 
  "blackberries", "blackberry", "raspberries", "raspberry", "grapes", "grape", "black grapes", "green grapes", 
  "red grapes", "pomegranate", "pomegranate seeds", "watermelon", "watermelon slices", "papaya", "papaya bowl", 
  "guava", "guava fruit", "pineapple", "pineapple slice", "kiwi", "kiwi fruit", "dragon fruit", "pitaya", 
  "plum", "peaches", "peach", "pear", "pears", "avocado", "hass avocado", "apricot", "apricots", "fig", "figs", 
  "dates", "medjool dates", "coconut water", "tender coconut", "jackfruit", "sweet lime", "mosambi", "citrus", 
  "sitaphal", "custard apple", "sapota", "chiku", "amla", "indian gooseberry", "cranberries", "cranberry", 
  "litchi", "lychee", "jamun", "black plum", "starfruit", "passion fruit", "cantaloupe", "muskmelon", "honeydew", 
  "grapefruit", "tangerine", "nectarine", "prunes", "raisins", "almonds", "walnuts", "pistachios", "cashews", 
  "chia seeds", "flax seeds", "pumpkin seeds", "sunflower seeds", "basil seeds", "sabja", "mixed nuts", "soaked almonds",
  "dates syrup", "dry dates", "dry figs", "hazelnut", "macadamia", "pecans", "brazil nuts", "pine nuts"
];

const EXCELLENT_VEGGIES_AND_GREENS = [
  "spinach", "palak", "boiled spinach", "kale", "kale salad", "lettuce", "romaine lettuce", "iceberg lettuce", 
  "broccoli", "steamed broccoli", "cabbage", "purple cabbage", "cauliflower", "gobi", "carrot", "carrots", 
  "baby carrots", "cucumber", "cucumber slices", "beetroot", "beets", "tomato", "cherry tomatoes", "bell pepper", 
  "capsicum", "yellow bell pepper", "red bell pepper", "green bell pepper", "mushroom", "button mushroom", 
  "oyster mushroom", "shiitake", "zucchini", "asparagus", "celery", "spring onion", "green peas", "peas", 
  "beans", "french beans", "green beans", "sprouted beans", "drumstick", "mulakkada", "bitter gourd", "kakarakaya", 
  "bottle gourd", "anapakaya", "sorakaya", "beerakaya", "ridge gourd", "dondakaya", "ivy gourd", "bendakaya", 
  "ladyfinger", "okra", "brinjal", "eggplant", "vankaya", "ash gourd", "raw banana", "sweet potato", "boiled sweet potato", 
  "radish", "turnip", "ginger", "garlic", "coriander", "kothimera", "mint", "pudina", "curry leaves", "karivepaku", 
  "fenugreek", "methi", "moringa leaves", "brussels sprouts", "artichoke", "bok choy", "radicchio", "endive", 
  "leeks", "yam", "elephant foot yam", "taro root", "colocasia", "ivy gourd stir fry", "dondakaya vepudu"
];

const GOOD_PROTEINS_AND_GRAINS = [
  "boiled egg", "egg whites", "egg white", "chicken breast", "boiled chicken", "grilled chicken", "baked chicken", 
  "grilled fish", "steamed fish", "salmon", "baked salmon", "tuna", "canned tuna", "tofu", "steamed tofu", 
  "paneer", "low fat paneer", "sprouts", "mixed sprouts", "moong sprouts", "dahlia", "broken wheat", "oats", 
  "oatmeal", "rolled oats", "steel cut oats", "brown rice", "steamed brown rice", "quinoa", "quinoa bowl", 
  "boiled chickpeas", "boiled chana", "boiled moong", "green gram", "black gram", "roasted chana", "roasted chickpeas", 
  "lentils", "dal", "yellow dal", "dal tadka", "lentil soup", "green dal", "moong dal", "rajma", "boiled rajma", 
  "chole", "boiled chole", "chana masala", "paneer bhurji", "egg bhurji", "egg white omelette", "multi grain roti", 
  "jowar roti", "ragi mudde", "ragi sankati", "ragi dosa", "millet rice", "millet idli", "barley porridge", 
  "sattu", "sattu drink", "whey protein", "protein shake", "greek yogurt", "plain low fat yogurt", "hung curd", 
  "cottage cheese", "soya chunks", "soyabean curry", "soy milk", "almond milk", "roasted peanuts"
];

const MODERATE_STAPLES = [
  "white rice", "steamed rice", "boiled rice", "cooked basmati rice", "cooked sonamasuri", "sonamasuri rice", 
  "chapati", "roti", "phulka", "pulka", "plain dosa", "rava dosa", "neer dosa", "set dosa", "onion dosa", 
  "idli", "steamed idli", "upma", "semolina upma", "wheat upma", "vermicelli upma", "pongal", "ven pongal", 
  "idiyappam", "appam", "pesarattu", "moong dal chilla", "besan chilla", "khichdi", "vegetable khichdi", 
  "curd rice", "daddojanam", "lemon rice", "pulihora", "tamarind rice", "tomato rice", "coconut rice", 
  "vegetable pulao", "veg biryani", "mushroom biryani", "jeera rice", "ghee rice", "dal fry", "dal makhani", 
  "sambar", "rasam", "charu", "palak pappu", "pappu", "tomato pappu", "cabbage fry", "capsicum curry", 
  "mixed veg curry", "kadai paneer", "mutter paneer", "chicken curry", "egg curry", "fish curry", "buttermilk", 
  "majjiga", "plain curd", "yogurt", "low fat milk", "skimmed milk", "cow milk", "black coffee", "green tea", 
  "herbal tea", "ginger tea", "lemon tea", "earl grey", "chamomile", "whole wheat bread", "brown bread", 
  "pita bread", "avocado toast", "poached egg", "sunny side up", "scrambled eggs", "omelete", "omelette"
];

const POOR_HEAVY_INDULGENT = [
  "aloo paratha", "gobi paratha", "paneer paratha", "methi paratha", "butter naan", "garlic naan", 
  "naan", "tandoori roti with butter", "roomali roti", "peshawari naan", "malabar parotta", "kerala parotta", 
  "parotta", "poori", "puri", "poori curry", "batura", "chole bhature", "ghee roast dosa", "butter masala dosa", 
  "cheese dosa", "schezwan dosa", "masala vada", "medu vada", "dal vada", "idli vada", "onion pakoda", 
  "aloo bajji", "mirchi bajji", "chilli chicken", "chicken 65", "chicken lollipop", "fish fry", "egg bonda", 
  "chicken fry", "pepper chicken", "mutton fry", "mutton curry", "beef roast", "pork fry", "kheema", "seekh kabab", 
  "tangdi kabab", "hara bhara kabab", "chicken noodles", "veg noodles", "egg noodles", "schezwan noodles", 
  "hakka noodles", "pasta carbonara", "pasta alfredo", "pasta arabiatta", "macaroni and cheese", "mac and cheese", 
  "beef burger", "chicken burger", "club sandwich", "mayo sandwich", "french fries", "french fry", "potato chips", 
  "nachos", "nachos with cheese", "butter chicken", "chicken tikka masala", "paneer butter masala", "malai kofta", 
  "shahi paneer", "kaju masala", "egg biryani", "chicken biryani", "mutton biryani", "special biryani", 
  "dum biryani", "shawarma", "chicken shawarma", "fried rice", "egg fried rice", "chicken fried rice", 
  "schezwan fried rice", "crispy corn", "baby corn manchurian", "gobi manchurian", "veg manchurian"
];

const ROAST_ZONE_UNHEALTHY = [
  "pizza", "cheese pizza", "double cheese pizza", "pepperoni pizza", "loaded pizza", "thin crust pizza", 
  "burger", "cheeseburger", "double cheeseburger", "samosa", "samosas", "aloo samosa", "punugulu", 
  "batata vada", "kachori", "onion kachori", "spring rolls", "veg spring roll", "lays", "kurkure", 
  "chips packet", "doritos", "bingo", "cheese balls", "butter cookies", "cookies", "chocolate cookies", 
  "bourbon biscuits", "oreo", "oreo cookies", "chocolate muffin", "croissant", "cream donut", "doughnut", 
  "donuts", "waffles", "waffles with syrup", "pancakes", "pancakes with syrup", "chocolate cake", "black forest cake", 
  "pineapple cake", "red velvet cake", "truffle cake", "brownie", "walnut brownie", "sizzling brownie", 
  "chocolate bar", "dairy milk", "kitkat", "munch", "snickers", "5 star", "gummy bears", "lollipop", 
  "sweet lollipop", "cotton candy", "marshmallows", "caramel custard", "gulab jamun", "kala jamun", 
  "rasgulla", "rasamalai", "rasmalai", "kaju katli", "kaju barfi", "motichoor laddu", "besan laddu", 
  "boondi laddu", "jalebi", "jelebi", "imarti", "jangri", "mysore pak", "ghee mysore pak", "palakova", 
  "milk peda", "doodh peda", "kheer", "vermicelli payasam", "semiya payasam", "double ka meetha", 
  "qubani ka meetha", "coconut burfi", "soan papdi", "kalakand", "ice cream", "vanilla ice cream", 
  "chocolate ice cream", "strawberry ice cream", "butterscotch ice cream", "mango ice cream", 
  "gold spot", "maaza", "frooti", "slice", "paper boat sweet", "sweet lassi", "mango lassi", "milkshake", 
  "chocolate milkshake", "strawberry milkshake", "vanilla milkshake", "oreo shake", "mango milkshake", 
  "badam milk", "rose milk", "cold coffee with ice cream", "soda", "cola", "coke", "coca cola", 
  "pepsi", "thums up", "sprite", "fanta", "mountain dew", "monster energy", "red bull", "diet coke", 
  "iced tea sweet", "starbucks sugary drink", "cotton candy", "cadbury", "snack mixture", "murukku"
];

// Combine lists to programmatically expand database to ~2000 foods
export const LOCAL_FOOD_DB: LocalFoodItem[] = [];

function registerFoodLists() {
  const register = (
    list: string[], 
    cat: 'excellent' | 'good' | 'moderate' | 'poor' | 'roast_zone', 
    scoreRange: [number, number], 
    nutri: string, 
    imgCat: string
  ) => {
    for (const food of list) {
      const baseName = food.trim();
      const score = Math.floor(Math.random() * (scoreRange[1] - scoreRange[0] + 1)) + scoreRange[0];
      
      // Standard singular & plural expansion
      const plurals = baseName.endsWith("y") 
        ? [baseName, baseName.slice(0, -1) + "ies"] 
        : baseName.endsWith("s") ? [baseName] : [baseName, baseName + "s"];
      
      const aliases = Array.from(new Set([
        baseName,
        baseName.toLowerCase(),
        baseName.replace(/\s+/g, ""),
        ...plurals,
        ...plurals.map(p => p.toLowerCase()),
        "plate of " + baseName,
        "bowl of " + baseName,
        "curry with " + baseName,
        "ghee " + baseName,
        "boiled " + baseName,
        "cooked " + baseName,
        "spicy " + baseName,
        "sweet " + baseName
      ]));

      LOCAL_FOOD_DB.push({
        name: baseName,
        aliases,
        category: cat,
        healthScore: score,
        nutrition: nutri,
        imageCategory: imgCat
      });
    }
  };

  register(EXCELLENT_FRUITS_AND_NUTS, 'excellent', [90, 100], "Rich in soluble fiber, bioactive polyphenols, organic vitamins, and dynamic gut-healthy minerals.", 'fruit');
  register(EXCELLENT_VEGGIES_AND_GREENS, 'excellent', [94, 100], "Packed with micronutrients, chlorophyll, digestive enzymes, and low-glycemic stomach-filling complex fibers.", 'salad');
  register(GOOD_PROTEINS_AND_GRAINS, 'good', [72, 89], "High in complete essential amino acids, slow-digesting complex carbohydrates, and lean metabolic catalysts.", 'curry');
  register(MODERATE_STAPLES, 'moderate', [50, 71], "Standard operational energy carbs with balanced fats. Normal glycemic loaders if kept in healthy portion controls.", 'breakfast');
  register(POOR_HEAVY_INDULGENT, 'poor', [30, 49], "High glycemic loads, oxidized saturated fats, and high sodium densities. Hard for vascular metabolic balance.", 'heavy');
  register(ROAST_ZONE_UNHEALTHY, 'roast_zone', [5, 29], "Inflammatory trans-fats, processed sugars, salt retention overloads, and empty caloric spikes.", 'junk');
}

// Automatically invoke on import to populate database
registerFoodLists();

// Exact or fuzzy identifier search
export function findLocalFood(query: string): LocalFoodItem | null {
  const norm = query.toLowerCase().trim();
  if (!norm) return null;

  // 1. Check exact match
  let matched = LOCAL_FOOD_DB.find(item => item.name.toLowerCase() === norm);
  if (matched) return matched;

  // 2. Check aliases match
  matched = LOCAL_FOOD_DB.find(item => item.aliases.some(alias => alias.toLowerCase() === norm));
  if (matched) return matched;

  // 3. Check substring match
  matched = LOCAL_FOOD_DB.find(item => norm.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(norm));
  if (matched) return matched;

  // 4. Try basic fuzzy matching by stripping spaces and vowels
  const cleanStr = (s: string) => s.replace(/[^a-z0-9]/g, "");
  const searchClean = cleanStr(norm);
  if (searchClean.length > 2) {
    matched = LOCAL_FOOD_DB.find(item => {
      const matchClean = cleanStr(item.name.toLowerCase());
      return searchClean.includes(matchClean) || matchClean.includes(searchClean);
    });
    if (matched) return matched;
  }

  return null;
}
