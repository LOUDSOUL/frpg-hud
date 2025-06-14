import { STORAGE_KEYS } from "../constants";


export let townsfolk = GM_getValue(STORAGE_KEYS.TOWNSFOLK, {});
export const setTownsfolk = (newTownsfolk) => townsfolk = newTownsfolk; 

export const parseQuickSend = (panelRows) => {
    const quickGiveRow = panelRows.find(row => row.innerHTML.includes("npclevels.php"));
    if (!quickGiveRow) return;

    const updatedTownsfolk = {};
    const options = quickGiveRow.querySelector(".quickgivedd").options;

    Array.from(options).slice(1).forEach(opt => {
        const name = opt.innerText.split("(")[0].trim();
        updatedTownsfolk[name] = opt.value;
    });

    GM_setValue(STORAGE_KEYS.TOWNSFOLK, updatedTownsfolk);
};

