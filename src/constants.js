export const STORAGE_KEYS = {
    INVENTORY: "frpg.inventory",
    INVENTORY_LIMIT: "frpg.inventory-limit",
    RECIPES: "frpg.recipes",
    RETURN_RATE: "frpg.return-rate",
    LOCATION_PREFIX: "frpg.location",
    QUICK_ACTIONS: "frpg.quick-actions",
    TOWNSFOLK: "frpg.townsfolk",
    HUD_STATUS: "frpg.hud-status",
    HUD_ITEMS: "frpg.hud-items",
    HUD_URL: "frpg.hud-url",
    HUD_STASH: "frpg.hud-stash",
    HUD_TIMERS: "frpg.hud-timers",
    SUPPLY_PACKS: "frpg.supply-packs",
    NEW_ITEM: "frpg.new-item",
    CRAFTWORKS: "frpg.craftworks",
    SETTINGS: "frpg.settings",
    PRODUCTION: "frpg.production",
    PRODUCTION_LAST_UPDATE: "frpg.production-last-update",
    PRODUCTION_LOCK: "frpg.production-lock",
    QUESTS: "frpg.quests",
};

export const HUD_DISPLAY_MODES = {
    INVENTORY: "INVENTORY",
    MEAL: "MEAL",
    TIMER: "TIMER",
};

export const seedCrop = {
    "14": "13", // Eggplant
    "16": "15", // Tomato
    "20": "19", // Carrot
    "30": "29", // Cucumber
    "32": "31", // Radish
    "34": "33", // Onion
    "47": "46", // Hops
    "49": "48", // Potato
    "51": "50", // Leek
    "60": "59", // Watermelon
    "64": "65", // Corn
    "66": "67", // Cabbage
    "68": "69", // Pumpkin
    "70": "71", // Wheat
    "160": "159", // Gold Carrot
    "190": "189", // Gold Cucumber
    "255": "254", // Cotton
    "257": "256", // Broccoli
    "352": "262", // Gold Eggplant
    "374": "373", // Sunflower
    "449": "450", // Beet
    "631": "630", // Rice
    "158": "157", // Gold Pepper
    "162": "161", // Gold Pea
    "588": "450", // Mega Beet
    "741": "254", // Mega Cotton
    "589": "373", // Mega Sunflower
    "395": "43", // Mushroom
    "28": "27", // Pea
    "12": "11", // Pepper
    "410": "409", // Pine
};

export const staminaItems = ["Apple", "Orange Juice"];

export const mealTimeExceptions = {
    "Breakfast Boost": 2 * 60,
    "Cabbage Stew": 2 * 60,
    "Lemon Cream Pie": 2 * 60,
    "Crunchy Omelette": 2 * 60,
    "Hickory Omelette": 60 * 60,
};

export const loadouts = {
    "Hourly": {
        items: ["Stone", "Coal", "Wood", "Board", "Sandstone", "Straw", "Steel", "Steel Wire",],
    },
    "Reset": {
        items: ["Apple", "Grapes", "Lemon", "Orange", "Antler", "Milk", "Eggs", "Feathers", "Black Truffle", "White Truffle", "Steak", "Steak Kabob",],
    },
    "Meals": {
        items: ["Mushroom Stew", "Shrimp-a-Plenty", "Quandary Chowder", "Neigh", "Lemon Cream Pie", "Cabbage Stew", "Cat's Meow", "Sea Pincher Special", "Hickory Omelette", "Breakfast Boost", "Over The Moon", "Onion Soup",],
        displayMode: HUD_DISPLAY_MODES.MEAL,
    },
    "Cookies": {
        items: ["Mushroom Stew", "Breakfast Boost", "Happy Cookies", "Spooky Cookies", "Lovely Cookies",],
        displayMode: HUD_DISPLAY_MODES.MEAL,
    },
};

export const mealNames = new Set([...loadouts.Meals.items, ...loadouts.Cookies.items]);

export const wheelItems = ["Apple", "Apple Cider", "Orange Juice", "Lemonade", "Fishing Net", "Rope", "Mushroom Paste", "Yarn",];

// So no one sells them accidentally
export const unsellableItems = ["White Truffle", "Black Truffle"];

export const darkModeActive = (document.querySelector("#dark_mode")?.innerText.trim() ?? "1") === "1";

export const defaultSettings = {
    mealTimersEnabled: {
        label: "Display meal timers",
        default: true,
    },
    processCraftworks: {
        label: "Run craftworks simulation",
        default: true,
    },
    hudStashEnabled: {
        label: "Enable HUD stash (Restore Button)",
        default: true,
    },
};

export const farmProductionKeys = {
    "Worms": "Worms",
    "Gummy Worms": "Gummies",
    "Mealworms": "Mealworms",

    "Grubs": "Grubs",
    "Minnows": "Minnows",

    "Wood": "Wood",
    "Board": "Boards",
    "Oak": "Oak",

    "Steel": "Steel",
    "Steel Wire": "Wire",

    "Straw": "Straw",

    "Stone": "Stone",
    "Sandstone": "Stone",
    "Coal": "Coal Hourly",
};

export const tenMinuteProductionItems = ["Straw", "Stone", "Sandstone"];

export const hourlyProductionItems = ["Wood", "Board", "Coal", "Steel", "Steel Wire", "Oak", "Worms", "Gummy Worms", "Mealworms", "Grubs", "Minnows"];

export const townsfolkGifts = {
    "Baba Gec": {
        "loves": ["Cabbage Stew", "Peach Juice", "Wooden Button"],
        "likes": ["Leek", "Onion", "Rope", "Snail"],
    },
    "Beatrix": {
        "loves": ["Black Powder", "Explosive", "Fireworks", "Iced Tea"],
        "likes": ["Bird Egg", "Carbon Sphere", "Coal", "Hammer", "Hops", "Oak"],
    },
    "Borgen": {
        "loves": ["Cheese", "Gold Catfish", "Wooden Box"],
        "likes": ["Glass Orb", "Gold Carrot", "Gold Cucumber", "Gold Peas", "Milk", "Slimestone"],
    },
    "Buddy": {
        "loves": ["Pirate Bandana", "Pirate Flag", "Purple Flower", "Valentines Card"],
        "likes": ["Bone", "Bucket", "Giant Centipede", "Gold Peppers", "Gummy Worms", "Mushroom", "Snail", "Spider"],
    },
    "Captain Thomas": {
        "loves": ["Fishing Net", "Gold Catfish", "Gold Drum", "Gold Trout", "Large Net"],
        "likes": ["Blue Crab", "Minnows"],
    },
    "Cecil": {
        "loves": ["Grasshopper", "Horned Beetle", "Leather", "MIAB", "Old Boot", "Shiny Beetle", "Yarn"],
        "likes": ["Aquamarine", "Giant Centipede", "Grapes", "Ladder", "Slimestone", "Snail"],
    },
    "Charles": {
        "loves": ["Apple", "Apple Cider", "Box of Chocolate 01", "Gold Carrot", "Peach", "Valentines Card"],
        "likes": ["3-leaf Clover", "Carrot", "Grasshopper", "Twine"],
    },
    "Cid": {
        "loves": ["Bomb", "Diamonds", "Explosive", "Mushroom Stew", "Safety Goggles", "Spider"],
        "likes": ["Black Powder", "Blue Feathers", "Shimmer Stone", "Stone"],
    },
    "frank": {
        "loves": ["Carrot", "Gold Carrot"],
        "likes": ["Blue Dye", "Blue Feathers", "Bucket", "Caterpillar", "Feathers", "Grasshopper"],
    },
    "Gary Bearson V": {
        "loves": ["Apple Cider", "Gold Trout", "Yarn", "You Rock Card"],
        "likes": ["Feathers", "Oak", "Trout"],
    },
    "Geist": {
        "loves": ["Gold Catfish", "Goldgill", "Sea Pincher Special", "Shrimp-a-Plenty"],
        "likes": ["Blue Crab", "Green Chromis", "Stingray", "Yellow Perch"],
    },
    "George": {
        "loves": ["Apple Cider", "Carbon Sphere", "Hide", "Mug of Beer", "Spider"],
        "likes": ["Arrowhead", "Bird Egg", "Glass Orb", "Hops", "Mushroom Stew", "Orange Juice"],
    },
    "Holger": {
        "loves": ["Gold Trout", "Mug of Beer", "Potato", "Wooden Table"],
        "likes": ["Apple Cider", "Arrowhead", "Bluegill", "Carp", "Cheese", "Horn", "Largemouth Bass", "Mushroom Stew", "Peach", "Peas", "Trout"],
    },
    "Jill": {
        "loves": ["Leather", "MIAB", "Mushroom Paste", "Peach", "Yellow Perch"],
        "likes": ["Cheese", "Grapes", "Milk", "Old Boot", "Scrap Metal", "Tomato"],
    },
    "Lorn": {
        "loves": ["Glass Orb", "Gold Peas", "Milk", "Shrimp", "Small Prawn"],
        "likes": ["3-leaf Clover", "Apple Cider", "Bucket", "Green Parchment", "Iced Tea", "Iron Cup", "Peas", "Purple Parchment"],
    },
    "Mariya": {
        "loves": ["Cat's Meow", "Leather Diary", "Mushroom Stew", "Onion Soup", "Over The Moon", "Quandary Chowder", "Sea Pincher Special", "Shrimp-a-Plenty"],
        "likes": ["Cucumber", "Eggplant", "Eggs", "Iced Tea", "Milk", "Peach", "Radish"],
    },
    "Mummy": {
        "loves": ["Bone", "Spider", "Valentines Card"],
        "likes": ["Fish Bones", "Hammer", "Treat Bag 02", "Yarn"],
    },
    "Ric Ryph": {
        "loves": ["5 Gold", "Hammer", "Mushroom Paste", "Shovel"],
        "likes": ["Arrowhead", "Black Powder", "Bucket", "Carbon Sphere", "Coal", "Green Parchment", "Old Boot", "Unpolished Shimmer Stone"],
    },
    "ROOMBA": {
        "loves": ["Carbon Sphere", "Scrap Metal"],
        "likes": ["Glass Orb", "Hammer", "Scrap Wire"],
    },
    "Rosalie": {
        "loves": ["Blue Dye", "Box of Chocolate 01", "Gold Carrot", "Green Dye", "Purple Dye", "Red Dye", "Valentines Card"],
        "likes": ["Apple", "Apple Cider", "Aquamarine", "Carrot", "Caterpillar", "Fireworks", "Iced Tea", "Purple Flower"],
    },
    "Star Meerif": {
        "loves": ["Blue Feathers", "Gold Feather"],
        "likes": ["Eggs", "Feathers"],
    },
    "Thomas": {
        "loves": ["Fishing Net", "Flier", "Gold Catfish", "Gold Trout", "Goldgill"],
        "likes": ["Carp", "Drum", "Gummy Worms", "Iced Tea", "Largemouth Bass", "Mealworms", "Minnows"],
    },
    "Vincent": {
        "loves": ["5 Gold", "Apple Cider", "Axe", "Lemonade", "Mushroom Paste", "Onion Soup", "Orange Juice"],
        "likes": ["Acorn", "Apple", "Cheese", "Hops", "Horn", "Leather Diary", "Shovel", "Wooden Box"],
    }
}

// Item Name: {liked: [Townsfolk1, Townsfolk2, ...], loved: [Townsfolk1, Townsfolk2, ...]}
export const likedItems = {};

for (const [townsfolk, gifts] of Object.entries(townsfolkGifts)) {
    gifts.loves.forEach(item => {
        if (!likedItems[item]) likedItems[item] = { liked: [], loved: [] };
        likedItems[item].loved.push(townsfolk);
    });
    gifts.likes.forEach(item => {
        if (!likedItems[item]) likedItems[item] = { liked: [], loved: [] };
        likedItems[item].liked.push(townsfolk);
    });
};
