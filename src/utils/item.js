import { STORAGE_KEYS } from "../constants";
import { getGlobalReserveAmount } from "./inventory";
import { quickActions, updateQuickAction } from "./quickActions";
import { townsfolk } from "./townsfolk";
import { recipes } from "./workshop";


export const cloneRowAfter = (row, title, subtitle, afterValue = "", img = "/img/items/7211.png") => {
    const newRow = row.cloneNode(true);
    const titleElement = newRow.querySelector(".item-title");

    const titleNode = titleElement.childNodes[0];
    titleNode.textContent = title;

    const subtitleNode = titleNode.nextSibling.nextSibling;
    subtitleNode.style.textWrap = "wrap";
    subtitleNode.textContent = subtitle;

    newRow.querySelector("img.itemimg").src = img;
    newRow.querySelector(".item-after").innerHTML = afterValue;
    newRow.querySelector(".progressbar")?.remove();

    row.after(newRow);
    return newRow;
}

const clearRowsAfter = (settingsRow) => {
    let node = settingsRow.nextElementSibling;
    while (node) {
        const element = node;
        node = node.nextElementSibling;

        element.remove();
    }
}

export const quickActionChangeHandler = (target, ignoreUpdate = false) => {
    const settingsRow = target.closest("#frpg-quick-action");
    const itemName = settingsRow.dataset.name;

    clearRowsAfter(settingsRow);

    const itemAction = quickActions[itemName] ?? {};
    const selectedAction = target.value?.trim() ?? "none";

    const getListenerString = (value, itemName) => `updateQuickActionParameter('${value}', '${itemName}', event.target.value)`;

    const reserveValue = itemAction.reserve ?? getGlobalReserveAmount();
    const reserveInputHtml = `
        <input type="number" class="inlineinputlg" min="-1" onclick="$(this).select()" onchange="${getListenerString("reserve", itemName)}" value="${reserveValue}" />
        `;
    const reserveRow = cloneRowAfter(settingsRow, "Reserve Amount", "Amount to keep in reserve while performing quick actions", reserveInputHtml);

    if (selectedAction === "none") {
        if (ignoreUpdate) return;

        updateQuickAction(itemName, {
            ...itemAction,
            action: "none"
        })
        return;
    }

    if (selectedAction === "send") {
        let selectedTownsfolk = itemAction.townsfolk;
        if (!selectedTownsfolk) {
            const quickGiveSelector = reserveRow.closest("ul")?.querySelector(".quickgivedd");
            const selectedOption = quickGiveSelector?.selectedOptions[0];

            if (!selectedOption || selectedOption.innerText.startsWith("-")) {
                selectedTownsfolk = Object.keys(townsfolk)[0];
            } else {
                selectedTownsfolk = selectedOption.innerText.split("(")[0].trim();
            }
        }

        const townsfolkOptions = Object.keys(townsfolk).map(t => `<option value="${t}" ${selectedTownsfolk === t ? "selected" : ""}>${t}</option>`).join("");
        const townsfolkSelectHtml = `
                <select class="inlineinputlg" onchange="${getListenerString("townsfolk", itemName)}">${townsfolkOptions}</select>
            `;

        cloneRowAfter(reserveRow, "Target Townsfolk", "Who would like this gift", townsfolkSelectHtml, "/img/items/icon_mail.png?1");

        if (ignoreUpdate) return;

        if (!selectedTownsfolk) return;

        updateQuickAction(itemName, { ...itemAction, action: selectedAction, townsfolk: selectedTownsfolk });
        return;
    } else if (selectedAction === "craft") {
        const craftableItems = [];
        for (const [recipeName, recipeDetails] of Object.entries(recipes)) {
            if (Object.keys(recipeDetails).includes(itemName)) craftableItems.push(recipeName);
        }

        let selectedRecipe = itemAction.item;
        if (!selectedRecipe && craftableItems.length > 0) selectedRecipe = craftableItems[0];

        const recipeOptions = craftableItems.map(recipe => `<option value="${recipe}" ${recipe === selectedRecipe ? "selected" : ""}>${recipe}</option>"`);
        const recipeSelectHtml = `<select class="inlineinputlg" onchange="${getListenerString("item", itemName)}">${recipeOptions}</select>`;

        const bypassReserve = itemAction.bypassReserve ?? false;
        const bypassSelectHtml = `
            <select class="inlineinputlg" onchange="${getListenerString("bypassReserve", itemName)}">
                <option value="false" ${bypassReserve ? "" : "selected"}>No</option>
                <option value="true" ${bypassReserve ? "selected" : ""}>Yes</option>
            </select>
            `;

        const itemRow = cloneRowAfter(reserveRow, "Item", "Which item to craft this into", recipeSelectHtml, "/img/items/5868.png");
        cloneRowAfter(itemRow, "Bypass Material Reserve", "Ignore reserve values of other materials", bypassSelectHtml, "/img/items/5868.png");

        if (ignoreUpdate) return;
        if (!selectedRecipe) return;

        updateQuickAction(itemName, { ...itemAction, action: selectedAction, item: selectedRecipe, bypassReserve });
        return;
    } else {
        if (ignoreUpdate) return;

        updateQuickAction(itemName, { ...itemAction, action: selectedAction });
        return;
    }
};

export const updateQuickActionParameter = (updateValue, itemName, newValue) => {
    const itemData = quickActions[itemName] ?? {};

    if (updateValue === "reserve") {
        newValue = Number(newValue);

        if (Number.isNaN(newValue) || newValue < 0) newValue = getGlobalReserveAmount();
    } else if (updateValue === "bypassReserve") {
        newValue = newValue === "true";
    }

    itemData[updateValue] = newValue;
    quickActions[itemName] = itemData;
    GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, quickActions);
};
