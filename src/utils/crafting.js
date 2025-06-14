import { itemNameIdMap } from "./inventory";


export const getMaterialsDelta = (recipe, amountConsumed) => {
    const delta = {};
    for (const [materialName, requiredPerCraft] of Object.entries(recipe)) {
        if (["Iron", "Nails"].includes(materialName)) continue;
        delta[materialName] = requiredPerCraft * amountConsumed * -1;
    }
    return delta;
};

export const getMaxCraftable = (recipe, inventory) => {
    return Math.min(...Object.entries(recipe).map(([materialName, requiredPerCraft]) => {
        const materialId = itemNameIdMap.get(materialName);
        return Math.floor((inventory[materialId]?.count ?? 0) / requiredPerCraft);
    }))
};

export const getCraftResult = (remainingSlots, maxCraftable, returnRate) => {
    maxCraftable = Math.min(maxCraftable, remainingSlots);

    // Since the game uses stochastic rounding, there's always a chance of off-by-one error
    // Regular rounding has 75% chance of matching compared to stochastically rounding again which is 66%
    const amountCrafted = Math.min(remainingSlots, Math.round(maxCraftable * returnRate));
    const materialsUsed = Math.round(amountCrafted / returnRate);

    return { amountCrafted, materialsUsed };
};
