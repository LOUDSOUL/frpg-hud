import { updateQuickAction } from ".";
import { likedItems, staminaItems } from "../../constants";
import { inventoryCache, inventoryLimit, itemNameIdMap } from "../inventory";
import { getFormattedNumber } from "../numbers";
import { townsfolk } from "../townsfolk";
import { recipes } from "../workshop";


const confirmQuickAction = (itemName, quickAction, animate = true) => {
    const actions = [
        { text: `Item: ${itemName}`, },
        { text: `Action: ${quickAction.action.toUpperCase()}`, onClick: () => promptQuickAction(itemName), },
        { text: `Reserve: ${getFormattedNumber(quickAction.reserve)}`, onClick: () => promptReserveAmount(itemName, quickAction), },
    ];
    if (quickAction.action === "send") {
        const loved = likedItems[itemName]?.loved?.includes(quickAction.townsfolk);
        const liked = likedItems[itemName]?.liked?.includes(quickAction.townsfolk);

        const townsfolkText = `${quickAction.townsfolk}${loved ? " (loves)" : ""}${liked ? " (likes)" : ""}`;
        actions.push({ text: `Townsfolk: ${townsfolkText}`, onClick: () => promptQuickSend(itemName) });
    } else if (quickAction.action === "craft") {
        const recipeDetails = inventoryCache[itemNameIdMap.get(quickAction.item)];

        actions.push({
            text: `Crafted Item: ${quickAction.item} (${getFormattedNumber(recipeDetails.count)})`,
            onClick: () => promptQuickCraft(itemName, quickAction.bypassReserve),
        });
        actions.push({
            text: `Bypass Reserve: ${quickAction.bypassReserve ? "Yes" : "No"}`,
            onClick: () => {
                quickAction.bypassReserve = !quickAction.bypassReserve;
                confirmQuickAction(itemName, quickAction, false);
            },
        });
    }

    actions.push(
        { text: "Confirm", onClick: () => updateQuickAction(itemName, quickAction) },
        { text: "Cancel", color: "red", },
    );

    myApp.actions(actions, animate);
};

const setReserve = (quickAction, reserveAmount) => {
    quickAction["reserve"] = reserveAmount;
    return quickAction;
};

const promptReserveAmount = (itemName, quickAction) => {
    const percent10 = parseInt(inventoryLimit * 0.1);
    const percent25 = parseInt(inventoryLimit * 0.25);
    const percent50 = parseInt(inventoryLimit * 0.5);
    const percent90 = parseInt(inventoryLimit * 0.9);

    const actions = [
        { text: "Select the reserve amount:", label: true, },
        { text: "No reserve", onClick: () => confirmQuickAction(itemName, setReserve(quickAction, 0)), },
        { text: `1,000x`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, 1000)), },
        { text: `${getFormattedNumber(percent10)} (10%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent10)), },
        { text: `${getFormattedNumber(percent25)} (25%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent25)), },
        { text: `${getFormattedNumber(percent50)} (50%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent50)), },
        { text: `${getFormattedNumber(percent90)} (90%)`, onClick: () => confirmQuickAction(itemName, setReserve(quickAction, percent90)), },
        { text: "Cancel", color: "red", },
    ]

    myApp.actions(actions);
};

const promptQuickSell = (itemName) => {
    promptReserveAmount(itemName, { action: "sell" });
};

const getSendAction = (target) => ({ action: "send", townsfolk: target, });

const promptQuickSend = (itemName, displayAll = false) => {
    if (!likedItems[itemName]) {
        displayAll = true;
    }

    const actions = [
        { text: "Select the townsfolk to send the item to: ", label: true, },
    ];

    for (const target of Object.keys(townsfolk)) {
        const loved = likedItems[itemName]?.loved?.includes(target);
        const liked = likedItems[itemName]?.liked?.includes(target);

        if (!displayAll && !(liked || loved)) continue;

        const targetText = `${target}${loved ? " (loves)" : ""}${liked ? " (likes)" : ""}`;
        actions.push({ text: targetText, onClick: () => promptReserveAmount(itemName, getSendAction(target)), });
    }
    if (!displayAll) {
        actions.push({ text: "Show All", onClick: () => promptQuickSend(itemName, true) });
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

const promptQuickCraft = (itemName, bypassReserve = false, animate = true) => {
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
        { text: `Enabled: ${bypassReserve ? "Yes" : "No"}`, onClick: () => promptQuickCraft(itemName, !bypassReserve, false), },
        { text: "Select the item to craft", label: true, },
    ]
    for (const recipe of craftableItems) {
        const recipeDetails = inventoryCache[itemNameIdMap.get(recipe)];
        actions.push({
            text: `${recipe} (inv: ${getFormattedNumber(recipeDetails.count)})`,
            onClick: () => promptReserveAmount(itemName, getCraftAction(recipe, bypassReserve)),
        });
    }
    actions.push({ text: "Cancel", color: "red", });

    myApp.actions(actions, animate);
};

const promptQuickUse = (itemName) => {
    promptReserveAmount(itemName, { action: "use" });
};

export const promptQuickAction = (itemName) => {
    const possibleActions = [
        {
            display: true,
            text: `Select the quick action for ${itemName}`,
            label: true,
        },
        {
            display: true,
            text: "Sell",
            onClick: () => promptQuickSell(itemName),
        },
        {
            display: likedItems[itemName],
            text: "Send",
            onClick: () => promptQuickSend(itemName),
        },
        {
            display: isCraftable(itemName),
            text: "Craft",
            onClick: () => promptQuickCraft(itemName),
        },
        {
            display: staminaItems.includes(itemName),
            text: "Use",
            onClick: () => promptQuickUse(itemName),
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
