import { STORAGE_KEYS } from "../constants";
import { inventoryCache, itemNameIdMap } from "./inventory";
import { recipes } from "./workshop";

export const craftworksDependencies = new Set();

export let craftworks = GM_getValue(STORAGE_KEYS.CRAFTWORKS, []);
export const setCraftworks = (value) => {
    craftworks = value;
    generateDependencies();
};

export const generateDependencies = () => {
    craftworksDependencies.clear();

    for (const { item, enabled } of craftworks) {
        if (!enabled) continue;

        craftworksDependencies.add(item);

        const itemName = inventoryCache[item].name;
        const recipe = recipes[itemName];

        if (!recipe) continue;

        Object.keys(recipe).forEach(materialName => craftworksDependencies.add(itemNameIdMap.get(materialName)));
    }
};
