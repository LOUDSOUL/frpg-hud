import { getHarvestStatsCard, parseCropTile, parseHarvestLog } from "../utils/farminfo";
import { updateInventory } from "../utils/inventory";
import { parseHtml } from "../utils/misc";

const parseFarmInfo = (response) => {
    const parsed = parseHtml(response);
    const cropTab = parsed.querySelector(".page-content > .content-block > .tabs > .tab");
    if (cropTab) {
        const crops = cropTab.querySelectorAll(".card-content-inner .col-25:has(a)");
        const updatedBatch = {};

        for (const crop of crops) {
            const item = parseCropTile(crop);
            updatedBatch[item.id] = item;
        }

        updateInventory(updatedBatch, { isDetailed: true });
    }

    const harvestLog = parsed.querySelector("#harvestlog");
    const logsContainer = harvestLog?.nextElementSibling?.nextElementSibling;

    if (logsContainer) {
        const harvests = logsContainer.querySelectorAll("ul > li.close-panel > .item-content");
        const harvestedItems = {};

        for (const harvest of harvests) {
            const log = parseHarvestLog(harvest);

            if (!harvestedItems[log.date]) {
                harvestedItems[log.date] = {};
            }
            if (!harvestedItems[log.date][log.id]) {
                harvestedItems[log.date][log.id] = 0;
            }

            harvestedItems[log.date][log.id] += log.count;
        }

        if (Object.keys(harvestedItems).length > 0) {
            const defaultActiveTab = parsed.querySelector(".tabs > .tab.active").id;

            const statsCard = getHarvestStatsCard(harvestedItems, defaultActiveTab);

            harvestLog.insertAdjacentHTML("afterend", statsCard);
        }
    }

    return parsed.innerHTML;
};

const farmInfoListener = {
    name: "Farm Info",
    callback: parseFarmInfo,
    urlMatch: [/^farminfo\.php/],
    passive: false,
};

export default farmInfoListener;
