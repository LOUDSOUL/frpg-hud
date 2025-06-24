import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";
import { parseProductionSection, production } from "../utils/production";


const parseWormHabitat = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));

    const parsedProductions = parseProductionSection(sections, ["Worms", "Gummy Worms", "Mealworms"]);
    const updatedProduction = { ...production, ...parsedProductions };

    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
};

const wormHabitatListener = {
    name: "Worm Habitat",
    callback: parseWormHabitat,
    urlMatch: [/^hab\.php/],
    passive: true,
};

export default wormHabitatListener;
