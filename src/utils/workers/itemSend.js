import { inventoryCache, updateInventory } from "../inventory";
import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";

const handleItemSend = (response, parameters) => {
    if (!response.includes("wk__item_max")) return;

    const html = parseHtml(response);
    const maxItemCountElement = html.querySelector("#wk__item_max");

    if (!maxItemCountElement) return;

    const maxItemCount = parseNumberWithCommas(maxItemCountElement.textContent);
    const itemId = parameters.get("id");
    const itemCount = parameters.get("qty");

    updateInventory({ [itemId]: -itemCount }, { isAbsolute: false, processCraftworks: true });
    if (inventoryCache[itemId]?.count !== maxItemCount) {
        // maxItemCount is after craftworks calculations are finished in-game
        // We can use it to sync count in case rng throws off our calculation
        updateInventory({ [itemId]: maxItemCount }, { isAbsolute: true });
    }
};

const itemSendWorkers = [
    {
        action: "givemailitem",
        listener: handleItemSend,
    },
];

export default itemSendWorkers;
