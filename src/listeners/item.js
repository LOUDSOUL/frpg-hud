import { updateInventory } from "../utils/inventory";
import { quickActionChangeHandler, updateQuickActionParameter } from "../utils/item";
import { displayItemConfig } from "../utils/itemConfig";
import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";


unsafeWindow.updateQuickActionParameter = updateQuickActionParameter;
unsafeWindow.quickActionChangeHandler = quickActionChangeHandler;

const extractItemId = (url) => new URLSearchParams(url.split("?")[1]).get("id");

const extractItemName = (parsedHtml) => parsedHtml.querySelector(".navbar-inner > .center.sliding")?.innerText.trim();

const extractItemCount = (parsedHtml) => {
    const inventoryLink = parsedHtml.querySelector(`a[href="inventory.php"]`);
    const inventoryRow = inventoryLink?.closest(".item-content");
    const countText = inventoryRow?.querySelector(".item-after")?.innerText.trim() || "0";
    return parseNumberWithCommas(countText);
};

const extractItemImage = (parsedHtml) => parsedHtml.querySelector(".itemimglg")?.src || null;

const parseItem = (response, url) => {
    const parsedResponse = parseHtml(response, url);
    const itemId = extractItemId(url);
    const itemName = extractItemName(parsedResponse);
    const itemCount = extractItemCount(parsedResponse);
    const itemImage = extractItemImage(parsedResponse);

    const itemDetails = {
        id: itemId,
        name: itemName,
        count: itemCount,
        ...(itemImage && { image: itemImage })
    };

    updateInventory({ [itemId]: itemDetails }, { isDetailed: true });
    displayItemConfig(parsedResponse, itemName, itemId);

    return parsedResponse.innerHTML;
}

const itemListener = {
    name: "Items",
    callback: parseItem,
    urlMatch: [/^item\.php\?id=\d+/],
    passive: false,
};

export default itemListener;
