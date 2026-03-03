import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";
import { updateInventory } from "../utils/inventory";
import { setHudItemsByName } from "../utils/hud";
import { STORAGE_KEYS } from "../constants";

const parsePet = (response, url) => {
    if (url.includes("worker.php?go=collectpetitems")) {
        if (response === "success") {
            const petItemsCache = GM_getValue(STORAGE_KEYS.PET_ITEMS_CACHE, {});
            if (Object.keys(petItemsCache).length > 0) {
                const additiveBatch = {};
                for (const [itemId, item] of Object.entries(petItemsCache)) {
                    additiveBatch[itemId] = item.count;
                }
                updateInventory(additiveBatch, { isAbsolute: false });
                GM_setValue(STORAGE_KEYS.PET_ITEMS_CACHE, {});
            }
        }
        return response;
    }

    const parsedResponse = parseHtml(response);
    const titles = parsedResponse.querySelectorAll(".content-block-title");
    
    let itemsFoundSection = null;
    for (const title of titles) {
        if (title.innerText === "Items Found") {
            itemsFoundSection = title;
            break;
        }
    }
    
    if (!itemsFoundSection) return response;

    const itemsListBlock = itemsFoundSection.nextElementSibling;
    if (!itemsListBlock || !itemsListBlock.classList.contains("list-block")) return response;

    const itemLinks = itemsListBlock.querySelectorAll("a.item-link");
    
    if (itemLinks.length === 0) return response;

    const updateBatch = {};
    const itemNames = [];

    for (const itemLink of itemLinks) {
        const itemId = new URLSearchParams(itemLink.href.split("?")[1]).get("id");
        const itemName = itemLink.querySelector(".item-title > strong").innerText.trim();
        const itemImage = itemLink.querySelector("img.itemimg").src;
        const itemCount = parseNumberWithCommas(itemLink.querySelector(".item-after").innerText);

        updateBatch[itemId] = {
            id: itemId,
            name: itemName,
            image: itemImage,
            count: itemCount
        };

        itemNames.push(itemName);
    }

    GM_setValue(STORAGE_KEYS.PET_ITEMS_CACHE, updateBatch);
    setHudItemsByName(itemNames);

    return response;
};

const petListener = {
    name: "Pet",
    callback: parsePet,
    urlMatch: [/^pet\.php/, /^worker\.php.*go=collectpetitems/],
    passive: true,
};

export default petListener;