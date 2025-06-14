import { hudItems } from "../hud";
import { inventoryCache, inventoryLimit, itemNameIdMap, updateInventory } from "../inventory";
import { parseHtml } from "../misc";
import { parseNumberWithCommas } from "../numbers";


const handleManualFish = (response) => {
    const parsedResponse = parseHtml(response);
    const fishName = parsedResponse.querySelector("img").alt;
    parsedResponse.lastElementChild.remove();
    let caughtCount;

    if (parsedResponse.innerText.trim() === fishName) {
        caughtCount = 1;
    } else {
        caughtCount = parseNumberWithCommas(parsedResponse.innerText.split("x")[1].slice(0, -1));
        if (Number.isNaN(caughtCount)) {
            return;
        }
    }

    updateInventory({ [fishName]: caughtCount }, { isAbsolute: false, resolveNames: true });
};

const handleNetFish = (response) => {
    const parsedResponse = parseHtml(response);
    const updateBatch = {};

    const caughtFish = parsedResponse.querySelectorAll(`img[src^="/img/items/"]`);

    for (const fishImage of caughtFish) {
        let fishName = fishImage.alt;
        if (!fishName) {
            // Why...
            const fishDetails = hudItems.find(item => item.image.includes(fishImage.src));
            if (!fishDetails) continue;

            fishName = fishDetails.name;
        }

        const quantityNode = fishImage.nextSibling;
        let caughtCount = updateBatch[fishName] ?? 0;

        if (fishImage.style.filter.includes("grayscale")) {
            caughtCount = inventoryLimit;
        } else if (quantityNode?.nodeType === 3 && quantityNode.textContent.trim() !== "") {
            caughtCount += Number(quantityNode.textContent.split("x")[1].trim().slice(0, -1));
        } else {
            caughtCount += 1;
        }

        updateBatch[fishName] = caughtCount;
    }

    const itemUsed = parsedResponse.querySelector("#nettyp").innerText.trim();
    const count = parseNumberWithCommas(parsedResponse.querySelector("#netcnt").innerText.trim());
    const difference = count - inventoryCache[itemNameIdMap.get(itemUsed)].count;
    updateBatch[itemUsed] = difference;

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true });
};

const fishingWorkers = [
    {
        action: "fishcaught",
        listener: handleManualFish,
    },
    {
        action: "castnet",
        listener: handleNetFish,
    }
]

export default fishingWorkers;
