import { mealNames, unsellableItems } from "../constants";
import { cloneRowAfter, quickActionChangeHandler } from "./item";
import { quickActions } from "./quickActions";
import { parseSupplyPack } from "./supplyPack";
import { parseQuickSend, townsfolk } from "./townsfolk";


const getPanelRows = (parsedResponse) => Array.from(parsedResponse.querySelectorAll(".list-block > ul > li.close-panel"));

const getTitleRows = (parsedResponse) => Array.from(parsedResponse.querySelectorAll(".content-block-title"));

const detectSendableItem = (panelRows) => panelRows.some(row => row.innerHTML.includes("/img/items/icon_mail.png?")) && Object.keys(townsfolk).length !== 0;

const detectCraftableItem = (titleRows) => titleRows.some(row => row.innerText.trim().toLowerCase() === "crafting use");

const detectUsableItem = (itemName) => mealNames.has(itemName);

const detectSellableItem = (panelRows, itemName) => {
    if (unsellableItems.includes(itemName)) return false;

    const hasQuickSell = panelRows.some(row => row.innerHTML.includes("market.php"));
    return hasQuickSell || ["Steak", "Steak Kabob"].includes(itemName);
};

const generateQuickActionOptions = (flags, itemQuickActions) => {
    const { itemSendable, itemCraftable, itemSellable, itemUsable } = flags;

    const actions = {
        "None": true,
        "Use": itemUsable,
        "Send": itemSendable,
        "Craft": itemCraftable,
        "Sell": itemSellable
    };

    return Object.entries(actions).map(([option, show]) => {
        if (!show) return "";
        const selected = itemQuickActions?.action === option.toLowerCase() ? "selected" : "";
        return `<option value="${option.toLowerCase()}" ${selected}>${option}</option>`;
    }).join("");
};

const wrapDropdownHtml = (options) =>
    `<select onchange="quickActionChangeHandler(event.target)" class="inlineinputlg" id="frpg-quick-action-value">
        ${options}
    </select>`;

const appendQuickActionRow = (lastRow, itemName, itemId, dropdownHtml) => {
    const row = cloneRowAfter(lastRow, "Quick Action", "Select the action on middle click or tap and hold", dropdownHtml);

    row.setAttribute("id", "frpg-quick-action");
    row.setAttribute("data-id", itemId);
    row.setAttribute("data-name", itemName);

    return row;
};

const addQuickActionDropdown = (panelRows, itemName, itemId, flags) => {
    const lastRow = panelRows[panelRows.length - 1];
    const itemQuickActions = quickActions[itemName];

    const optionsHtml = generateQuickActionOptions(flags, itemQuickActions);
    const dropdownHtml = wrapDropdownHtml(optionsHtml);

    const settingRow = appendQuickActionRow(lastRow, itemName, itemId, dropdownHtml);

    const selectElement = settingRow.querySelector("#frpg-quick-action-value");
    quickActionChangeHandler(selectElement, true);
};

export const displayItemConfig = (parsedResponse, itemName, itemId) => {
    const panelRows = getPanelRows(parsedResponse);
    const titleRows = getTitleRows(parsedResponse);

    const itemSendable = detectSendableItem(panelRows);
    const itemCraftable = detectCraftableItem(titleRows);
    const itemUsable = detectUsableItem(itemName);
    const itemSellable = detectSellableItem(panelRows, itemName);

    parseSupplyPack(titleRows, itemName);

    if (itemSendable) parseQuickSend(panelRows);

    if (itemSendable || itemSellable || itemCraftable || itemUsable) {
        addQuickActionDropdown(panelRows, itemName, itemId, {
            itemSendable,
            itemCraftable,
            itemSellable,
            itemUsable,
        });
    }
};
