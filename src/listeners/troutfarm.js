import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseTroutFarm = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Grubs", "Minnows"]);
    const updatedProduction = { ...production, ...parsedProductions };

    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const troutFarmListener = {
    name: "Trout Farm",
    callback: parseTroutFarm,
    urlMatch: [/^troutfarm\.php/],
    passive: true,
};

export default troutFarmListener;
