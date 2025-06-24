import { farmProductionKeys, STORAGE_KEYS } from "../constants";
import { parseNumberWithCommas } from "./numbers";
import { production } from "./production";


const parseProductionChildren = (children) => {
    const output = {};

    for (const child of children) {
        if (child.nodeType !== 3) continue;

        const productionText = child.textContent.trim();

        const spaceIndex = productionText.indexOf(" ");
        if (spaceIndex === -1) continue;

        const itemName = productionText.slice(spaceIndex + 1).trim();
        const countString = productionText.slice(0, spaceIndex);
        const itemCount = parseNumberWithCommas(countString);

        if (Number.isNaN(itemCount)) {
            continue;
        }

        output[itemName] = itemCount;
    }

    return output;
};

export const parseProductionRows = (parsedResponse) => {
    const sections = Array.from(parsedResponse.querySelectorAll(".content-block-title"));
    const targetSection = sections.find(section => section.innerText === "Around Your Farm");

    if (!targetSection) return;

    let parsedProductionMap = {};

    const buildingLinks = targetSection.nextElementSibling?.querySelectorAll(".item-link");
    for (const buildingLink of buildingLinks) {
        const detailsElement = buildingLink.querySelector(".item-after > span");
        if (!detailsElement) continue;

        const buildingProduction = parseProductionChildren(detailsElement.childNodes);
        parsedProductionMap = { ...parsedProductionMap, ...buildingProduction };
    }

    const updatedProduction = { ...production };
    for (const [itemName, key] of Object.entries(farmProductionKeys)) {
        updatedProduction[itemName] = parsedProductionMap[key] ?? 0;
    }

    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
};
