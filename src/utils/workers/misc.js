import { inventoryCache, updateInventory } from "../inventory";
import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";


const parseItemCount = (itemString) => {
    // "Mushroom Paste (x22)" -> ["Mushroom Paste", 22]
    // "Mushroom Paste x22" -> ["Mushroom Paste", 22]
    let [itemName, countText] = itemString.split("x");
    itemName = itemName.replace("(", "").trim();

    const itemCount = parseNumberWithCommas(countText.split(")")[0]);
    return [itemName, itemCount];
};

const handleWheelSpin = (response) => {
    const parsedResponse = parseHtml(response.split("|")[1]);

    const rewardText = parsedResponse.innerText.split(":")[1];
    let [itemName, itemCount] = parseItemCount(rewardText);

    if (itemName === "Apples") itemName = "Apple";

    updateInventory({ [itemName]: itemCount }, { isAbsolute: false, resolveNames: true });
};

const handleWishingWellThrow = (response, parameters) => {
    if (response === "cannotafford") return;

    const thrownId = parameters.get("id");
    const thrownCount = Number(parameters.get("amt"));
    const thrownItemName = inventoryCache[thrownId]?.name;
    const parsedResponse = parseHtml(response);

    const updateBatch = {};
    const items = parsedResponse.querySelectorAll("img");

    for (const item of items) {
        let [itemName, itemCount] = parseItemCount(item.nextSibling.textContent);
        updateBatch[itemName] = itemCount;
    }

    if (thrownItemName) {
        updateBatch[thrownItemName] = -thrownCount;
    }

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true });
};

const handleRewardsClaim = (response) => {
    if (response === "") return;

    if (response.toLowerCase().includes("no rewards left")) return;

    const parsedResponse = parseHtml(response);
    const updateBatch = {};

    const items = parsedResponse.querySelectorAll("img");

    for (const item of items) {
        let [itemName, itemCount] = parseItemCount(item.nextSibling.textContent);
        updateBatch[itemName] = itemCount;
    }

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true });
};

const miscWorkers = [
    {
        action: "spinfirst",
        listener: handleWheelSpin,
    },
    {
        action: "tossmanyintowell",
        listener: handleWishingWellThrow,
    },
    {
        action: "collectrew",
        listener: handleRewardsClaim,
    },
]

export default miscWorkers;
