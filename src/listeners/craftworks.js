import { STORAGE_KEYS } from "../constants";
import { updateInventory } from "../utils/inventory";
import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";


const parseCraftworks = (response) => {
    const parsedResponse = parseHtml(response);
    const itemList = parsedResponse.querySelectorAll(".close-panel[data-id]");

    const craftworksItems = [];
    const inventoryUpdate = {};

    for (const element of itemList) {
        const itemId = element.dataset.id;
        const enabled = Array.from(element.querySelectorAll("button")).some((button) => button.classList.contains("pausecwbtn"));

        craftworksItems.push({ item: itemId, enabled });

        const titleChildren = element.querySelector(".item-title").children;
        const countText = titleChildren[titleChildren.length - 1].firstChild.textContent.split(":")[1].trim();
        const itemCount = parseNumberWithCommas(countText);

        inventoryUpdate[itemId] = itemCount;
    }

    GM_setValue(STORAGE_KEYS.CRAFTWORKS, craftworksItems);
    updateInventory(inventoryUpdate, { isAbsolute: true });

    return response;
};

const craftworksListener = {
    name: "Craftworks",
    callback: parseCraftworks,
    urlMatch: [/^craftworks\.php/],
    passive: true,
};

export default craftworksListener;
