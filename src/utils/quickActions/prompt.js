import { handleQuickAction, updateQuickAction } from ".";
import { likedItems, staminaItems } from "../../constants";
import { getGlobalReserveAmount, inventoryCache, inventoryLimit, itemNameIdMap } from "../inventory";
import { capitalizeFirst } from "../misc";
import { getFormattedNumber } from "../numbers";
import { townsfolk } from "../townsfolk";
import { recipes } from "../workshop";


export const confirmQuickAction = (itemName, quickAction, target, animate = true) => {
    const actions = [
        { text: "Item config", label: true, },
        { text: `Item: ${itemName}`, },
        { text: `Action: ${capitalizeFirst(quickAction.action)}`, onClick: () => promptQuickAction(itemName, target), },
    ];

    if (quickAction.reserve !== undefined) {
        actions.push({
            text: `Reserve: ${getFormattedNumber(quickAction.reserve)}`,
            onClick: () => promptReserveAmount(itemName, quickAction, target),
        });
    }

    if (quickAction.action === "send") {
        const loved = likedItems[itemName]?.loved?.includes(quickAction.townsfolk);
        const liked = likedItems[itemName]?.liked?.includes(quickAction.townsfolk);

        const townsfolkText = `${quickAction.townsfolk}${loved ? " (loves)" : ""}${liked ? " (likes)" : ""}`;
        actions.push({ text: `Townsfolk: ${townsfolkText}`, onClick: () => promptQuickSend(itemName, target) });
    } else if (quickAction.action === "craft") {
        const recipeDetails = inventoryCache[itemNameIdMap.get(quickAction.item)];

        actions.push({
            text: `Crafted Item: ${quickAction.item} (${getFormattedNumber(recipeDetails.count)})`,
            onClick: () => promptQuickCraft(itemName, target, quickAction.bypassReserve),
        });
        actions.push({
            text: `Bypass Reserve: ${quickAction.bypassReserve ? "Yes" : "No"}`,
            onClick: () => {
                quickAction.bypassReserve = !quickAction.bypassReserve;
                confirmQuickAction(itemName, quickAction, target, false);
            },
        });
    }

    actions.push({ text: "Actions", label: true, });
    if (quickAction.action !== "none") {
        actions.push({ text: "Perform", onClick: () => handleQuickAction(target, quickAction), });
    }
    actions.push(
        { text: "Save", onClick: () => updateQuickAction(itemName, quickAction), },
        { text: "Cancel", color: "red", },
    );

    myApp.actions(actions, animate);
};

const setReserve = (quickAction, reserveAmount) => {
    quickAction["reserve"] = reserveAmount;
    return quickAction;
};

const promptReserveAmount = (itemName, quickAction, target) => {
    const percent10 = parseInt(inventoryLimit * 0.1);
    const percent25 = parseInt(inventoryLimit * 0.25);
    const percent50 = parseInt(inventoryLimit * 0.5);
    const percent90 = parseInt(inventoryLimit * 0.9);

    const actions = [
        { text: "Select the reserve amount:", label: true, },
        { text: "No reserve", onClick: () => confirmQuickAction(itemName, setReserve(quickAction, 0), target), },
        {
            text: `${getFormattedNumber(getGlobalReserveAmount())} (Global Reserve)`,
            onClick: () => confirmQuickAction(itemName, setReserve(quickAction, getGlobalReserveAmount()), target),
        },
        { text: `${getFormattedNumber(percent10)} (10%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent10), target), },
        { text: `${getFormattedNumber(percent25)} (25%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent25), target), },
        { text: `${getFormattedNumber(percent50)} (50%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent50), target), },
        { text: `${getFormattedNumber(percent90)} (90%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent90), target), },
        { text: "Cancel", color: "red", },
    ];

    myApp.actions(actions);
};

const promptQuickSell = (itemName, target) => {
    promptReserveAmount(itemName, { action: "sell" }, target);
};

const getSendAction = (target) => ({ action: "send", townsfolk: target, });

const promptQuickSend = (itemName, target, displayAll = false) => {
    if (!likedItems[itemName]) {
        displayAll = true;
    }

    const actions = [
        { text: "Select the townsfolk to send the item to: ", label: true, },
    ];

    for (const npc of Object.keys(townsfolk)) {
        const loved = likedItems[itemName]?.loved?.includes(npc);
        const liked = likedItems[itemName]?.liked?.includes(npc);

        if (!displayAll && !(liked || loved)) continue;

        const targetText = `${npc}${loved ? " (loves)" : ""}${liked ? " (likes)" : ""}`;
        actions.push({ text: targetText, onClick: () => promptReserveAmount(itemName, getSendAction(npc), target) });
    }
    if (!displayAll) {
        actions.push({ text: "Show All", onClick: () => promptQuickSend(itemName, target, true) });
    }
    actions.push({ text: "Cancel", color: "red", });

    myApp.actions(actions);
};

const isCraftable = (itemName) => {
    for (const recipe of Object.values(recipes)) {
        if (recipe[itemName]) return true;
    }

    return false;
};

const getCraftAction = (recipe, bypassReserve) => ({ action: "craft", item: recipe, bypassReserve, });

const promptQuickCraft = (itemName, target, bypassReserve = false, animate = true) => {
    if (!isCraftable(itemName)) {
        const actions = [
            { text: "No recipes unlocked for this item yet", label: true, },
            { text: "Cancel", color: "red", },
        ];
        myApp.actions(actions);
        return;
    }

    const craftableItems = [];
    for (const [recipeName, ingredients] of Object.entries(recipes)) {
        if (ingredients[itemName] !== undefined) craftableItems.push(recipeName);
    }

    const actions = [
        { text: "Bypass other materials' reserve?", label: true, },
        { text: `Enabled: ${bypassReserve ? "Yes" : "No"}`, onClick: () => promptQuickCraft(itemName, target, !bypassReserve, false), },
        { text: "Select the item to craft", label: true, },
    ]
    for (const recipe of craftableItems) {
        const recipeDetails = inventoryCache[itemNameIdMap.get(recipe)];
        actions.push({
            text: `${recipe} (inv: ${getFormattedNumber(recipeDetails.count)})`,
            onClick: () => promptReserveAmount(itemName, getCraftAction(recipe, bypassReserve), target),
        });
    }
    actions.push({ text: "Cancel", color: "red", });

    myApp.actions(actions, animate);
};

const promptQuickUse = (itemName, target) => {
    promptReserveAmount(itemName, { action: "use" }, target);
};

const promptNoAction = (itemName, target) => {
    confirmQuickAction(itemName, { action: "none" }, target);
};

export const promptQuickAction = (itemName, target) => {
    const possibleActions = [
        {
            display: true,
            text: `Select the quick action for ${itemName}`,
            label: true,
        },
        {
            display: true,
            text: "Sell",
            onClick: () => promptQuickSell(itemName, target),
        },
        {
            display: likedItems[itemName],
            text: "Send",
            onClick: () => promptQuickSend(itemName, target),
        },
        {
            display: isCraftable(itemName),
            text: "Craft",
            onClick: () => promptQuickCraft(itemName, target),
        },
        {
            display: staminaItems.includes(itemName),
            text: "Use",
            onClick: () => promptQuickUse(itemName, target),
        },
        {
            display: true,
            text: "None",
            onClick: () => promptNoAction(itemName, target),
        },
        {
            display: true,
            text: "Cancel",
            color: "red",
        }
    ];

    const displayedActions = possibleActions.filter(action => action.display);

    myApp.actions(displayedActions);
};
