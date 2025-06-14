import { mealTimeExceptions, STORAGE_KEYS } from "../../constants";
import { hudTimers } from "../hud";
import { inventoryCache, updateInventory } from "../inventory";
import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";


const handleMealUse = (response, parameters) => {
    if (!response === "success") return;

    const itemId = parameters.get("id");
    const itemDetails = inventoryCache[itemId];

    if (!itemDetails) return;

    const mealTimeSeconds = mealTimeExceptions[itemDetails.name] ?? (5 * 60);
    const endTime = Date.now() + (mealTimeSeconds * 1000);

    const updatedTimers = hudTimers;
    hudTimers[itemId] = endTime;

    GM_setValue(STORAGE_KEYS.HUD_TIMERS, updatedTimers);
    updateInventory({ [itemId]: -1 }, { isAbsolute: false });
};

const handleLocksmithOpen = (response) => {
    const parsedResponse = parseHtml(response);
    const updatedInventory = {};
    for (const itemRow of parsedResponse.querySelectorAll("img")) {
        const itemDetails = itemRow.nextSibling;
        const [nameText, countText] = itemDetails.textContent.split("x");
        const itemName = nameText.trim();
        const itemCount = parseNumberWithCommas(countText);

        updatedInventory[itemName] = itemCount;
    }
    updateInventory(updatedInventory, { isAbsolute: false, resolveNames: true, processCraftworks: true });
};

const handleOrangeJuiceUse = (response, parameters) => {
    if (!response.toLowerCase().includes("you drank")) return;

    const amount = parameters.get("amt");
    updateInventory({ "Orange Juice": -amount }, { isAbsolute: false, resolveNames: true });
};

const handleAppleUse = (response, parameters) => {
    if (!response.toLowerCase().includes("you ate")) return;

    const amount = parameters.get("amt");
    updateInventory({ Apple: -amount }, { isAbsolute: false, resolveNames: true });
};

const itemUseWorkers = [
    {
        action: "useitem",
        listener: handleMealUse,
    },
    {
        action: "openitem",
        listener: handleLocksmithOpen,
    },
    {
        action: "drinkxojs",
        listener: handleOrangeJuiceUse,
    },
    {
        action: "eatxapples",
        listener: handleAppleUse,
    },
    {
        action: "eatapple",
        listener: (response) => handleAppleUse(response, { get: () => 1 }),
    },
    {
        action: "drinkoj",
        listener: (response) => handleOrangeJuiceUse(response, { get: () => 1 }),
    },
];

export default itemUseWorkers;
