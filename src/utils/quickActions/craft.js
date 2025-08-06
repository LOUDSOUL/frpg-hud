import { getMaxCraftable } from "../crafting";
import { addHudItems } from "../hud";
import { getGlobalReserveAmount, inventoryCache, inventoryLimit, itemNameIdMap } from "../inventory";
import { refreshInventory } from "../misc";
import { quickActions } from "../quickActions";
import { recipes } from "../workshop";
import { cancelHudRemoval } from "./cleanup";


const getApplicableInventory = (recipeDetails, triggerItem, bypassReserve) => {
    const applicableInventory = {};
    const globalReserve = getGlobalReserveAmount();

    for (const materialName of Object.keys(recipeDetails)) {
        const materialId = itemNameIdMap.get(materialName);
        const itemCount = inventoryCache[materialId].count;

        applicableInventory[materialId] = { count: itemCount };

        if (["Iron", "Nails"].includes(materialName)) continue;

        if (materialName === triggerItem || !bypassReserve) {
            applicableInventory[materialId].count = Math.max(0, itemCount - (quickActions[materialName]?.reserve ?? globalReserve));
        }
    }

    return applicableInventory;
}

export const handleItemCraft = (itemName, action, cleanup) => {
    const targetItemName = action.item;

    if (targetItemName === "Select") {
        myApp.addNotification({ title: "No item selected to craft!", subtitle: "Please go to item details and select the item to craft into" });
        return cleanup(false);
    }

    const targetItemId = itemNameIdMap.get(targetItemName);
    const targetItem = inventoryCache[targetItemId];

    const recipe = recipes[targetItemName];
    if (!recipe) {
        myApp.addNotification({ title: "Recipe not found!", subtitle: "Please go to the workshop to refresh recipes or select another item to craft" });
        return cleanup(false);
    }

    const inventoryLeft = inventoryLimit - targetItem.count;
    if (inventoryLeft === 0) {
        addHudItems([{ ...targetItem, removeOnQuickSell: true }]);
        return cleanup(false) && refreshInventory();
    }

    cancelHudRemoval(itemNameIdMap.get(targetItemName));

    const applicableInventory = getApplicableInventory(recipe, itemName, action.bypassReserve ?? false);
    const maxCraftable = getMaxCraftable(recipe, applicableInventory);
    const craftCount = Math.min(maxCraftable, inventoryLeft);

    if (craftCount === 0) {
        return cleanup(false) && refreshInventory();
    }

    $.ajax({
        url: `worker.php?go=craftitem&id=${targetItemId}&qty=${craftCount}`,
        method: "POST",
    }).done(
        function (data) {
            if (data === "success") {
                addHudItems([{ ...targetItem, removeOnQuickSell: true }]);
            } else if (data === "cannotafford") {
                myApp.addNotification({ title: "Cannot afford error", subtitle: 'Inventory most likely out of sync' });
            } else {
                myApp.addNotification({ title: "Something went wrong...", subtitle: `Unexpected server response: ${data}` });
            }
            return cleanup();
        }
    );
};
