import { parseHtml } from "../utils/misc";
import { updateInventory } from "../utils/inventory";
import { STORAGE_KEYS } from "../constants";
import { parseNumberWithCommas } from "../utils/numbers";


const parseInventory = (response) => {
    const parsedInventory = parseHtml(response);
    const items = parsedInventory.querySelectorAll(".list-group > ul a.item-link");
    const currentLimit = Number(parsedInventory.querySelector(".card-content-inner > strong").innerText.replaceAll(",", ""));
    const updatedInventory = {};
    for (const item of items) {
        const itemId = item.href.split("?id=")[1];
        const name = item.querySelector(".item-title > strong").innerText;
        const image = item.querySelector(".item-media > img").src;
        const count = parseNumberWithCommas(item.getElementsByClassName("item-after")[0].innerText);

        updatedInventory[itemId] = {
            id: itemId,
            name,
            image,
            count,
        };
    };
    updateInventory(updatedInventory, { isDetailed: true, overwriteMissing: true });
    GM_setValue(STORAGE_KEYS.INVENTORY_LIMIT, currentLimit);

    return response;
}

const inventoryListener = {
    name: "Inventory",
    callback: parseInventory,
    urlMatch: [/^inventory\.php/],
    passive: true,
};

export default inventoryListener;
