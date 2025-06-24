import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseQuarry = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Stone", "Coal"]);
    if (parsedProductions["Stone"]) {
        parsedProductions["Sandstone"] = parsedProductions["Stone"];
    }

    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const quarryListener = {
    name: "Quarry",
    callback: parseQuarry,
    urlMatch: [/^quarry\.php/],
    passive: true,
};

export default quarryListener;
