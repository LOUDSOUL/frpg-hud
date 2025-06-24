import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseSawmill = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Wood", "Board", "Oak"]);
    const updatedProduction = { ...production, ...parsedProductions };

    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const sawmillListener = {
    name: "Sawmill",
    callback: parseSawmill,
    urlMatch: [/^sawmill\.php/],
    passive: true,
};

export default sawmillListener;
