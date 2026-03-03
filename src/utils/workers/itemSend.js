import { updateInventory } from "../inventory";


import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";

const handleItemSend = (response, parameters) => {
    if (!response.includes("wk__item_max")) return;

    const html = parseHtml(response);
    const maxItemCountElement = html.querySelector("#wk__item_max");

    if (!maxItemCountElement) return;

    const maxItemCount = parseNumberWithCommas(maxItemCountElement.textContent);
    const itemId = parameters.get("id");

    updateInventory({ [itemId]: maxItemCount }, { isAbsolute: true });
};

const itemSendWorkers = [
    {
        action: "givemailitem",
        listener: handleItemSend
    },
];

export default itemSendWorkers;
