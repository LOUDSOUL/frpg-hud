import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";
import { setHudItemsByName } from "../utils/hud";

const parseViewcharter = (response) => {
    const parsedResponse = parseHtml(response);
    const foundItems = parsedResponse.querySelectorAll(".collectindvbtn");
    
    if (foundItems.length === 0) return response;

    const charterBatch = {};
    const itemNames = [];

    for (const button of foundItems) {
        const itemContainer = button.closest(".item-content");
        const itemLink = itemContainer.querySelector("a.item-link");
        const itemId = new URLSearchParams(itemLink.href.split("?")[1]).get("id");
        const itemName = itemContainer.querySelector(".item-title > strong").innerText.trim();
        const itemImage = itemContainer.querySelector("img.itemimg").src;
        const foundCount = parseNumberWithCommas(button.innerText.replace("Found ", ""));

        charterBatch[itemId] = {
            id: itemId,
            name: itemName,
            image: itemImage,
            count: foundCount
        };

        itemNames.push(itemName);
    }

    // ToDo store charterBatch to use later for `collectindvcharter`, because that one just return "success"
    setHudItemsByName(itemNames);

    return response;
};

const viewcharterListener = {
    name: "Viewcharter",
    callback: parseViewcharter,
    urlMatch: [/^viewcharter\.php/],
    passive: true,
};

export default viewcharterListener;