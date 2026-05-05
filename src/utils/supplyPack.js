import { STORAGE_KEYS } from "../constants";
import { updateInventory } from "./inventory";


export let supplyPacks = GM_getValue(STORAGE_KEYS.SUPPLY_PACKS, {});
export const setSupplyPacks = (packs) => supplyPacks = packs;

export const parseSupplyPack = (titleRows, itemName) => {
    const supplyPackTitle = titleRows.find(row =>
        row.innerText.trim().toLowerCase() === "item contents"
    );
    if (!supplyPackTitle) return;

    const supplyPackItems = {};
    const updatedInventory = {};

    const itemListElement = supplyPackTitle.nextElementSibling.nextElementSibling;
    const itemList = itemListElement.querySelectorAll("a.item-link");

    for (const item of itemList) {
        const itemId = item.href.split("id=")[1];
        const image = item.querySelector("img.itemimg").src;
        const name = item.querySelector(".item-title > strong").innerText.trim();
        const count = Number(item.querySelector(".item-after").innerText.replace("x", "").trim());

        supplyPackItems[name] = count;

        if (name !== "Gold") {
            updatedInventory[itemId] = { id: itemId, name, image };
        }
    }

    updateInventory(updatedInventory, { isDetailed: true });

    const updatedSupplyPacks = { ...supplyPacks, [itemName]: supplyPackItems };
    GM_setValue(STORAGE_KEYS.SUPPLY_PACKS, updatedSupplyPacks);
};
