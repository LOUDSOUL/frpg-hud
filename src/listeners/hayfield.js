import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseHayfield = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Straw"]);
    const updatedProduction = { ...production, ...parsedProductions };

    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const hayfieldListener = {
    name: "Hayfield",
    callback: parseHayfield,
    urlMatch: [/^hayfield\.php/],
    passive: true,
};

export default hayfieldListener;
