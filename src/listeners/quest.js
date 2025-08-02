
import { parseHtml } from "../utils/misc";
import { STORAGE_KEYS } from "../constants";
import { parseNumberWithCommas } from "../utils/numbers";
import { quests } from "../utils/quests";
import { inventoryCache, itemNameIdMap, updateInventory } from "../utils/inventory";


const parseQuest = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const questId = urlParameters.get("id");

    const parsedResponse = parseHtml(response);
    const questDetails = {};
    const updateBatch = {};

    const sections = parsedResponse.querySelectorAll(".content-block-title");
    for (const section of sections) {
        const sectionTitle = section.innerText;
        if (!["Items Requested", "Rewards"].includes(sectionTitle)) continue;

        const sectionItems = section.nextElementSibling.querySelectorAll("a.item-link");
        const sectionDetails = {};

        for (const sectionItem of sectionItems) {
            const urlMatch = new URLSearchParams(sectionItem.href.split("?")[1]);

            const itemId = urlMatch.get("id");
            const itemName = sectionItem.querySelector(".item-title > strong").innerText.trim();
            const itemImage = sectionItem.querySelector("img.itemimg").src;

            const itemRequirementText = sectionItem.querySelector(".item-after").innerText;
            const itemRequirement = parseNumberWithCommas(itemRequirementText.replace("x", "").trim());

            const itemDetails = { id: itemId, name: itemName, image: itemImage };

            const progressbar = sectionItem.querySelector(".progressbar");
            if (progressbar) {
                const quantityElement = progressbar.previousElementSibling;
                const quantityWords = quantityElement.textContent.trim().split(" ");
                const quantity = parseNumberWithCommas(quantityWords[quantityWords.length - 1]);
                
                itemDetails.count = quantity;
            }

            updateBatch[itemId] = itemDetails;
            sectionDetails[itemName] = itemRequirement;
        }

        const key = sectionTitle === "Items Requested" ? "request" : "reward";
        questDetails[key] = sectionDetails;
    }
    const updatedQuests = { ...quests, [questId]: questDetails };

    const pjButton = parsedResponse.querySelector(".drinkpj");
    if (pjButton) {
        const pjDetails = inventoryCache[itemNameIdMap.get("Peach Juice")];
        if (pjDetails) {
            const pjText = pjButton.innerText;
            const pjCount = parseNumberWithCommas(pjText.split("(")[1].trim().slice(0, -1));

            pjDetails.count = pjCount;
            updateBatch[pjDetails.id] = pjDetails;
        }
    }

    updateInventory(updateBatch, { isDetailed: true, })
    GM_setValue(STORAGE_KEYS.QUESTS, updatedQuests);
};

const questListener = {
    name: "Quest",
    callback: parseQuest,
    urlMatch: [/^quest\.php/],
    passive: true,
};

export default questListener;
