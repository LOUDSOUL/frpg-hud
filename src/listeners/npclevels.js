import { STORAGE_KEYS } from "../constants";
import { parseHtml } from "../utils/misc";


const parseTownsfolk = (response) => {
    const parsedResponse = parseHtml(response);

    const mailboxLinks = parsedResponse.querySelectorAll('a[href^="mailbox.php?id"]');
    const updatedTownsfolk = {};
    for (const link of mailboxLinks) {
        const townsfolkName = link.nextElementSibling.nextElementSibling.innerText.trim();
        const townsfolkId = new URLSearchParams(link.href.split("?")[1]).get("id");

        updatedTownsfolk[townsfolkName] = townsfolkId;
    }

    if (!("Captain Thomas" in updatedTownsfolk)) {  // (-_-)
        updatedTownsfolk["Captain Thomas"] = updatedTownsfolk["Cpt Thomas"]
        delete updatedTownsfolk["Cpt Thomas"];
    }

    GM_setValue(STORAGE_KEYS.TOWNSFOLK, updatedTownsfolk);
    return response;
};

const townsfolkListener = {
    name: "Townsfolk",
    callback: parseTownsfolk,
    urlMatch: [/^npclevels\.php/],
    passive: true,

};

export default townsfolkListener;
