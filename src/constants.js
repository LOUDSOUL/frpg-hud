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
    HUD_TIMERS: "frpg.hud-timers",
    SUPPLY_PACKS: "frpg.supply-packs",
    NEW_ITEM: "frpg.new-item",
    CRAFTWORKS: "frpg.craftworks",
    SETTINGS: "frpg.settings",
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
};
