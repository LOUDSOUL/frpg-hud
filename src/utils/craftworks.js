import { STORAGE_KEYS } from "../constants";
import { inventoryCache, itemNameIdMap } from "./inventory";
import { recipes } from "./workshop";

export const craftworksDependencies = new Set();
export const craftworksIngredients = new Set();

export let craftworks = GM_getValue(STORAGE_KEYS.CRAFTWORKS, []);
export const setCraftworks = (value) => {
    craftworks = value;
    generateDependencies();
};

export const generateDependencies = () => {
    craftworksDependencies.clear();
    craftworksIngredients.clear();

    const enabledItems = new Set(craftworks.filter(entry => entry.enabled).map(entry => entry.item));

    for (const itemId of enabledItems) {
        craftworksDependencies.add(itemId);

        const itemName = inventoryCache[itemId].name;
        const recipe = recipes[itemName];

        if (!recipe) continue;

        for (const materialName of Object.keys(recipe)) {
            const materialId = itemNameIdMap.get(materialName);
            if (!materialId) continue;

            craftworksDependencies.add(materialId);
            if (enabledItems.has(materialId)) {
                craftworksIngredients.add(materialId);
            }
        }
    }
};
