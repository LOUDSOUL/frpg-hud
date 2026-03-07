import { STORAGE_KEYS } from "../constants";
import { getCraftResult, getMaterialsDelta, getMaxCraftable } from "./crafting";
import { craftworks, craftworksDependencies, generateDependencies, craftworksIngredients } from "./craftworks";
import { notify } from "./misc";
import { settings } from "./settings";
import { recipes, returnRate } from "./workshop";


export let inventoryCache = GM_getValue(STORAGE_KEYS.INVENTORY, {});
export const setInventory = (inventory) => inventoryCache = inventory;

export let inventoryLimit = GM_getValue(STORAGE_KEYS.INVENTORY_LIMIT, 1000);
export const setInventoryLimit = (limit) => inventoryLimit = limit;

export const getGlobalReserveAmount = () => {
    return Math.floor(inventoryLimit / 5);
};

export const itemNameIdMap = new Map();

export const populateItemNameIdMap = () => {
    for (const [itemId, item] of Object.entries(inventoryCache)) {
        itemNameIdMap.set(item.name, itemId);
    }
};

populateItemNameIdMap();

const resolveItemNames = (updateBatch) => {
    const resolvedBatch = {};

    for (const itemName of Object.keys(updateBatch)) {
        const itemId = itemNameIdMap.get(itemName);

        if (!itemId) continue;

        resolvedBatch[itemId] = updateBatch[itemName];
    }

    return resolvedBatch;
};

const applyUpdateBatch = (inventory, updateBatch, { isAbsolute = false, isDetailed = false }) => {
    let newItem = false;

    for (const itemId of Object.keys(updateBatch)) {
        if (isDetailed) {
            if (!inventory[itemId]) newItem = true;

            inventory[itemId] = { ...inventory[itemId], ...updateBatch[itemId] };
        } else if (isAbsolute) {
            inventory[itemId].count = updateBatch[itemId];
        } else {
            inventory[itemId].count = Math.max(0, Math.min(
                inventoryLimit,
                (inventory[itemId].count ?? 0) + updateBatch[itemId]
            ));
        }
    }

    return newItem;
};

generateDependencies();

const simulateCraftworks = (inventory, craftedItem) => {
    const usedIngredients = new Set(craftworksIngredients);
    if (craftedItem) {
        const recipe = recipes[inventoryCache[craftedItem].name];
        if (recipe) {
            Object.keys(recipe).forEach(materialName => {
                const materialId = itemNameIdMap.get(materialName);
                if (materialId) usedIngredients.add(materialId);
            });
        }   
    }

    const maxedItems = [];

    for (const { item: recipeId, enabled } of craftworks) {
        if (!enabled) continue;

        const itemDetails = inventory[recipeId];
        if (!itemDetails) continue;

        const recipe = recipes[itemDetails.name];
        if (!recipe) continue;

        const remainingSlots = inventoryLimit - itemDetails.count;
        if (remainingSlots === 0) continue;

        const maxCraftable = getMaxCraftable(recipe, inventory);
        if (maxCraftable === 0) continue;

        const { amountCrafted, materialsUsed } = getCraftResult(remainingSlots, maxCraftable, returnRate);
        const materialsDelta = getMaterialsDelta(recipe, materialsUsed);
        const resolvedDelta = resolveItemNames({ ...materialsDelta, [itemDetails.name]: amountCrafted });

        applyUpdateBatch(inventory, resolvedDelta, { isAbsolute: false, isDetailed: false });

        if (settings.craftworksNotifications && remainingSlots === amountCrafted && !usedIngredients.has(recipeId)) {
            maxedItems.push(recipeId);
        }
    }

    if (maxedItems.length > 0) {
        const notificationText = maxedItems.map(itemId => {
            const itemName = inventoryCache[itemId].name;
            return `<a href="item.php?id=${itemId}">${itemName}</a>`;
        }).join(", ");

        notify("Craftworks Inventory Full", `${notificationText} ${maxedItems.length > 1 ? "are" : "is"} no longer being crafted!`);
    }
};

export const updateInventory = (updateBatch, { isAbsolute = false, isDetailed = false, resolveNames = false, overwriteMissing = false, processCraftworks = false, craftedItem = null }) => {
    const inventory = inventoryCache;

    if (resolveNames) {
        updateBatch = resolveItemNames(updateBatch);
    }

    const newItem = applyUpdateBatch(inventory, updateBatch, { isAbsolute, isDetailed });

    if (overwriteMissing) {
        for (const itemId of Object.keys(inventory)) {
            if (!updateBatch[itemId]) {
                inventory[itemId].count = 0;
            }
        }
    }

    if (processCraftworks && settings.processCraftworks) {
        const dependencyUpdated = Object.keys(updateBatch).some(itemId => craftworksDependencies.has(itemId));
        if (dependencyUpdated) simulateCraftworks(inventory, craftedItem);
    }

    GM_setValue(STORAGE_KEYS.INVENTORY, inventory);

    if (newItem) {
        // For keeping itemNameIdMap in sync between tabs
        GM_setValue(STORAGE_KEYS.NEW_ITEM, Date.now());
    }
};
