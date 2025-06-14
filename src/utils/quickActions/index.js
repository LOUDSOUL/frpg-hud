import { mealNames, STORAGE_KEYS, unsellableItems } from "../../constants";
import { getGlobalReserveAmount, inventoryCache } from "../inventory";
import { getDefaultTextColor, refreshInventory } from "../misc";
import { getFormattedNumber } from "../numbers";
import { getCleanupCallback } from "./cleanup";
import { handleItemCraft } from "./craft";
import { confirmMealUse } from "./meal";
import { handleItemSell } from "./sell";
import { handleItemSend } from "./send";
import { handleItemUse } from "./use";


export let quickActions = GM_getValue(STORAGE_KEYS.QUICK_ACTIONS, {});
export const setQuickActions = (actions) => quickActions = actions;

export const updateQuickAction = (itemName, actionDetails) => {
    quickActions[itemName] = actionDetails;

    GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, quickActions);
}


const confirmSell = (itemName, count, target, cleanup) => {
    const confirmationTitle = `Sell ${getFormattedNumber(count)}x ${itemName}?`;
    const confirmationSubtitle = `Global reserve value of ${getFormattedNumber(getGlobalReserveAmount())} applied`;
    const callbackAccept = () => {
        updateQuickAction(itemName, { action: "sell" });
        handleQuickAction(target);
    };

    myApp.confirm(confirmationSubtitle, confirmationTitle, callbackAccept, refreshInventory);
    return cleanup(false);
}

export const handleQuickAction = (target) => {
    const itemId = target.dataset.id;
    const itemCount = target.dataset.count;
    const itemName = inventoryCache[itemId].name;

    const isMeal = mealNames.has(itemName);
    if (isMeal) return confirmMealUse(itemId, itemName);

    const itemAction = quickActions[itemName];
    const applicableCount = itemCount - (itemAction?.reserve ?? getGlobalReserveAmount());

    const targetStyle = target.firstElementChild.style;
    const cleanup = getCleanupCallback(target);

    if (applicableCount <= 0 || itemAction?.action === "none") return cleanup(false) && refreshInventory();

    if (itemAction?.action) {
        const action = itemAction.action;

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
        return;
    }

    if (unsellableItems.includes(itemName)) {
        myApp.addNotification({ title: "Cannot sell this item", subtitle: "Please sell it manually" });
    };

    return confirmSell(itemName, applicableCount, target, cleanup);
};
