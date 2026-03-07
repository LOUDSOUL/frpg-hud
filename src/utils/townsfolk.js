import { STORAGE_KEYS } from "../constants";
import { defaultLikedItems } from "../constants";
import { inventoryCache } from "./inventory";

export let townsfolk = GM_getValue(STORAGE_KEYS.TOWNSFOLK, {});
export const setTownsfolk = (newTownsfolk) => townsfolk = newTownsfolk;

export let townsfolkGifts = GM_getValue(STORAGE_KEYS.TOWNSFOLK_GIFTS, defaultLikedItems);
export const setTownsfolkGifts = (newTownsfolkGifts) => townsfolkGifts = newTownsfolkGifts;

export const addTownsfolkGifts = (townsfolkName, items) => {
    let newFound = false;

    for (const [itemId, status] of Object.entries(items)) {
        const statusKey = {
            like: "likes",
            likes: "likes",
            liked: "likes",
            love: "loves",
            loves: "loves",
            loved: "loves",
        }[status];
        if (!statusKey) continue;

        const itemName = inventoryCache[itemId]?.name;
        if (!itemName) continue;

        if (!townsfolkGifts[itemName]) {
            townsfolkGifts[itemName] = {
                likes: [],
                loves: [],
            };
        }

        if (!townsfolkGifts[itemName][statusKey].includes(townsfolkName)) {
            townsfolkGifts[itemName][statusKey].push(townsfolkName);
            newFound = true;
        }
    }

    if (newFound) {
        GM_setValue(STORAGE_KEYS.TOWNSFOLK_GIFTS, townsfolkGifts);
    }

    return newFound;
};

export const parseQuickSend = (panelRows) => {
    const quickGiveRow = panelRows.find(row => row.innerHTML.includes("npclevels.php"));
    if (!quickGiveRow) return;

    const optionsElement = quickGiveRow.querySelector(".quickgivedd");
    if (!optionsElement) return;

    const updatedTownsfolk = {};
    const itemId = optionsElement.dataset.id;
    const options = optionsElement.options;

    Array.from(options).slice(1).forEach(opt => {
        const split = opt.innerText.split("(");
        const townsfolkName = split[0].trim();
        const townsfolkId = opt.value;

        updatedTownsfolk[townsfolkName] = townsfolkId;

        if (split.length > 1) {
            const itemStatus = split[1].replace(")", "").toLowerCase().trim();
            addTownsfolkGifts(townsfolkName, { [itemId]: itemStatus });
        }
    });

    if (Object.keys(updatedTownsfolk).length > 5) {
        GM_setValue(STORAGE_KEYS.TOWNSFOLK, updatedTownsfolk);
    }
};
