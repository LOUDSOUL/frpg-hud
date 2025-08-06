import { mealNames, STORAGE_KEYS, unsellableItems } from "../../constants";
import { getGlobalReserveAmount, inventoryCache } from "../inventory";
import { getDefaultTextColor, refreshInventory } from "../misc";
import { editMode } from "../settings";
import { getCleanupCallback } from "./cleanup";
import { handleItemCraft } from "./craft";
import { confirmMealUse } from "./meal";
import { confirmQuickAction, promptQuickAction } from "./prompt";
import { handleItemSell } from "./sell";
import { handleItemSend } from "./send";
import { handleItemUse } from "./use";


export let quickActions = GM_getValue(STORAGE_KEYS.QUICK_ACTIONS, {});
export const setQuickActions = (actions) => quickActions = actions;

export const updateQuickAction = (itemName, actionDetails) => {
    quickActions[itemName] = actionDetails;

    GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, quickActions);
}

export const handleQuickAction = (target, itemAction = null) => {
    const cleanup = getCleanupCallback(target);

    const itemId = target.dataset.id;
    const itemCount = target.dataset.count;
    const itemName = inventoryCache[itemId].name;

    const isMeal = mealNames.has(itemName);
    if (isMeal) return confirmMealUse(itemId, itemName);

    if (unsellableItems.includes(itemName)) {
        myApp.addNotification({ title: "Cannot perform quick action", subtitle: "Quick actions cannot be performed on this item" });
        return cleanup(false);
    };

    if (!itemAction) {
        itemAction = quickActions[itemName];

        if (editMode) {
            return cleanup(false) && confirmQuickAction(itemName, itemAction, target);
        }
    }

    if (!itemAction?.action || itemAction.action === "none") {
        return cleanup(false) && promptQuickAction(itemName, target);
    }

    const applicableCount = itemCount - (itemAction?.reserve ?? getGlobalReserveAmount());

    if (applicableCount <= 0) return cleanup(false) && refreshInventory();

    const action = itemAction.action;

    const targetStyle = target.firstElementChild.style;
    targetStyle.color = {
        "send": "cyan",
        "craft": "skyblue",
        "sell": "green",
        "use": "orange",
    }[action] ?? getDefaultTextColor();

    if (action === "send") {
        return handleItemSend(itemId, applicableCount, itemAction, cleanup);
    } else if (action === "craft") {
        return handleItemCraft(itemName, itemAction, cleanup);
    } else if (action === "use") {
        return handleItemUse(itemName, applicableCount, cleanup);
    } else if (action === "sell") {
        return handleItemSell(itemId, itemName, applicableCount, cleanup);
    }

    myApp.addNotification({ title: "Invalid quickAction selected", subtitle: `"${action}" is not a valid action. Please go to item page and re-configure` });
};
