import { hourlyProductionItems, STORAGE_KEYS, tenMinuteProductionItems } from "../constants";
import { inventoryCache, itemNameIdMap, updateInventory } from "./inventory";
import { hudTimers } from "./hud";


export let production = GM_getValue(STORAGE_KEYS.PRODUCTION, {});
export const setProduction = (value) => production = value;

let productionTimeout = null;

const acquireLock = () => {
    const currentTime = Date.now();
    const lockTimeout = 10 * 1000;
    const lockTime = GM_getValue(STORAGE_KEYS.PRODUCTION_LOCK, 0);

    if (lockTime > currentTime - lockTimeout) return false;

    GM_setValue(STORAGE_KEYS.PRODUCTION_LOCK, currentTime);

    const newLockTime = GM_getValue(STORAGE_KEYS.PRODUCTION_LOCK);

    return newLockTime === currentTime;
};

const releaseLock = () => {
    GM_setValue(STORAGE_KEYS.PRODUCTION_LOCK, 0);
};

const tenMinuteProduction = (productionTime) => {
    const updateBatch = Object.fromEntries(tenMinuteProductionItems.map(itemName => [itemName, production[itemName] ?? 0]));

    const hickoryActive = hudTimers[itemNameIdMap.get("Hickory Omelette")] > productionTime;
    if (hickoryActive) {
        updateBatch["Wood"] = Math.floor(production["Wood"] / 5);
        updateBatch["Board"] = Math.floor(production["Board"] / 5);
    }

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, processCraftworks: true });
};

const hourlyProduction = () => {
    const updateBatch = Object.fromEntries(hourlyProductionItems.map(itemName => [itemName, production[itemName] ?? 0]));

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, processCraftworks: true });
};

const getNextUpdate = (lastUpdate) => {
    const nextUpdate = new Date(lastUpdate);

    const isTenMinuteMark = nextUpdate.getUTCMinutes() % 10 === 0;
    const productionNotYetRan = nextUpdate.getSeconds() < 15;

    nextUpdate.setSeconds(15);
    nextUpdate.setMilliseconds(0);

    const shouldRunThisMinute = isTenMinuteMark && productionNotYetRan;
    if (!shouldRunThisMinute) {
        nextUpdate.setUTCMinutes(Math.ceil((nextUpdate.getUTCMinutes() + 1) / 10) * 10)
    }

    return nextUpdate;
};

const handleProduction = () => {
    if (!acquireLock()) return scheduleProduction();

    const lastUpdate = GM_getValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    const nextUpdate = getNextUpdate(lastUpdate);
    const currentTime = new Date();

    let finishedUpdate = null;

    while (nextUpdate < currentTime) {
        const updateMinute = nextUpdate.getUTCMinutes();

        if (updateMinute % 10 === 0) {
            tenMinuteProduction(nextUpdate);
        }
        if (updateMinute === 0) {
            hourlyProduction(nextUpdate);
        }

        finishedUpdate = +nextUpdate;
        nextUpdate.setUTCMinutes(Math.ceil((updateMinute + 1) / 10) * 10);
    }

    if (finishedUpdate) GM_setValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, finishedUpdate);
    scheduleProduction();
    releaseLock();
};

export const scheduleProduction = () => {
    const lastUpdate = GM_getValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    const nextUpdate = getNextUpdate(lastUpdate);
    const currentTime = Date.now();

    const delay = Math.max(nextUpdate - currentTime, 0);

    clearTimeout(productionTimeout);
    productionTimeout = setTimeout(handleProduction, delay);
};

export const parseProductionSection = (possibleSections, items) => {
    const parsedProductions = {};

    for (const itemName of items) {
        const itemDetails = inventoryCache[itemNameIdMap.get(itemName)];
        if (!itemDetails) continue;

        const sections = Array.from(possibleSections);
        const targetSection = sections.find(section => section.querySelector("img.itemimg")?.src === itemDetails.image);
        if (!targetSection) continue;

        const addButton = targetSection.querySelector(".item-after > button.button");
        if (!addButton) continue;

        parsedProductions[itemName] = Number(addButton.dataset.current);
    }

    return parsedProductions;
};
