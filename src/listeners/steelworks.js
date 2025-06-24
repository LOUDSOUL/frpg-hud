import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseSteelworks = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Steel"]);
    if (parsedProductions["Steel"]) {
        parsedProductions["Steel Wire"] = Math.round(parsedProductions["Steel"] * 1 / 3);
    }

    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const steelworksListener = {
    name: "Steelworks",
    callback: parseSteelworks,
    urlMatch: [/^steelworks\.php/],
    passive: true,
};

export default steelworksListener;
