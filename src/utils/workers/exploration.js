import { inventoryCache, inventoryLimit, itemNameIdMap, updateInventory } from "../inventory";
import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";


const extractNumber = (element) => parseNumberWithCommas(element.innerText.trim());

const handleExploration = (response, parameters) => {
    const parsedResponse = parseHtml(response);
    const foundItems = parsedResponse.querySelectorAll(`img[src^="/img/items/"]`);
    const updateBatch = {};

    const ciderUsed = parameters.get("cider");
    const lemonadeUsed = parameters.get("go") === "drinklm";

    for (const itemImage of foundItems) {
        const itemName = itemImage.alt.trim();
        if (!itemName) continue;
        let itemCount = updateBatch[itemName] ?? 0;

        if (itemImage.style.filter.includes("grayscale")) {
            itemCount = inventoryLimit;
        } else if (itemImage.nextSibling && (ciderUsed || lemonadeUsed)) {
            itemCount += parseNumberWithCommas(itemImage.nextSibling.textContent.trim().split("x")[1].slice(0, -1));
        } else {
            itemCount += 1;
        }

        updateBatch[itemName] = itemCount;
    }

    const updateItemDifference = (itemName, selector) => {
        const selectedItem = parsedResponse.querySelector(selector);
        if (!selectedItem) return;
        const count = extractNumber(selectedItem);
        updateBatch[itemName] = count - inventoryCache[itemNameIdMap.get(itemName)].count;
    }

    // #cidercnt is present in regular explores too but always shows 0
    if (ciderUsed || lemonadeUsed) {
        const itemUsed = ciderUsed ? "Apple Cider" : parsedResponse.querySelector("#lmtyp").innerText.trim();
        const countSelector = ciderUsed ? "#cidercnt" : "#lmcnt";
        updateItemDifference(itemUsed, countSelector);
    }
    updateItemDifference("Apple", "#applecnt");

    if (Object.keys(updateBatch).length > 0) {
        updateInventory(updateBatch, {isAbsolute: false, resolveNames: true, processCraftworks: true});
    }
};

const explorationWorkers = [
    {
        action: "drinklm",
        listener: handleExploration,
    },
    {
        action: "explore",
        listener: handleExploration,
    },
]

export default explorationWorkers;
