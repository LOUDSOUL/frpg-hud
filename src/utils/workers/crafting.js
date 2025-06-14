import { STORAGE_KEYS } from "../../constants";
import { getCraftResult, getMaterialsDelta } from "../crafting";
import { craftworks } from "../craftworks";
import { inventoryCache, inventoryLimit, updateInventory } from "../inventory";
import { recipes, returnRate } from "../workshop";


const handleItemCraft = (response, parameters) => {
    // Required to keep materials in sync when using the "Quick Craft" perk
    // Will be overwritten by workshop immediately in case of manual craft

    if (response !== "success") return;

    const itemId = parameters.get("id");
    const craftCount = Number(parameters.get("qty"));

    if (Number.isNaN(craftCount) || craftCount <= 0) return;

    const itemDetails = inventoryCache[itemId];
    if (!itemDetails) return;

    const itemName = itemDetails.name;

    const recipe = recipes[itemName];
    if (!recipe) return;
    const inventoryLeft = inventoryLimit - itemDetails.count;

    const { amountCrafted, materialsUsed } = getCraftResult(inventoryLeft, craftCount, returnRate);
    const materialsDelta = getMaterialsDelta(recipe, materialsUsed);

    updateInventory({ ...materialsDelta, [itemName]: amountCrafted }, { isAbsolute: false, resolveNames: true, processCraftworks: true });
};

const handleCraftworksReorder = (response, parameters) => {
    if (response !== "success") return;

    const newOrder = parameters.get("ords");
    if (!newOrder) return;

    const updatedCraftworks = [];

    for (const item of newOrder.split("|")) {
        if (!item) break;

        const [itemId, itemIndex] = item.split(",");

        updatedCraftworks[Number(itemIndex) - 1] = {
            item: itemId,
            enabled: craftworks.find(entry => entry.item === itemId)?.enabled ?? false,
        }
    }

    GM_setValue(STORAGE_KEYS.CRAFTWORKS, updatedCraftworks);
}

const craftingWorkers = [
    {
        action: "craftitem",
        listener: handleItemCraft,
    },
    {
        action: "setcwitemorder",
        listener: handleCraftworksReorder,
    },
]

export default craftingWorkers;
