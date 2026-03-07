import { updateInventory } from "../utils/inventory";
import { parseHtml } from "../utils/misc";
import { addTownsfolkGifts, townsfolk } from "../utils/townsfolk";


const parseMailbox = (response, url) => {
    const parsedResponse = parseHtml(response);
    const mailboxBlock = parsedResponse.querySelector(".mailboxcb");
    if (!mailboxBlock) return response;

    const mailItems = mailboxBlock.querySelectorAll(".list-block .item-content");
    const updatedInventory = {};
    for (const item of mailItems) {
        const link = item.querySelector('a[href^="item.php"]');
        if (!link) continue;

        const itemId = new URLSearchParams(link.href.split('?')[1]).get("id");
        const count = item.querySelector("input.qty").dataset.numLeft;

        updatedInventory[itemId] = count;
    }

    updateInventory(updatedInventory, { isDetailed: false, isAbsolute: true });

    const playerId = new URLSearchParams(url.split("?")[1]).get("id");
    const townsfolkName = Object.keys(townsfolk).find(name => townsfolk[name] === playerId);

    if (!townsfolkName) return response;

    const sectionTitles = mailboxBlock.querySelectorAll(".content-block-title");
    const sections = Array.from(sectionTitles);

    if (sections.some(section => section.textContent.toLowerCase().includes("discovered"))) {
        const discoveredSection = sections.find(section => section.textContent.toLowerCase().includes("discovered"));
        if (!discoveredSection) return response;

        const discoveredGifts = {};

        const discoveredItems = discoveredSection.nextElementSibling.querySelectorAll(".item-content");
        for (const item of discoveredItems) {
            const link = item.querySelector('a[href^="item.php"]');
            if (!link) continue;

            const itemId = new URLSearchParams(link.href.split('?')[1]).get("id");
            let statusImage = item.querySelector(".item-title > strong > img")?.src;
            if (!statusImage) continue;

            let status = null;
            if (statusImage.includes("love")) {
                status = "love";
            } else if (statusImage.includes("like")) {
                status = "like";
            }
            if (!status) continue;

            discoveredGifts[itemId] = status;
        }

        addTownsfolkGifts(townsfolkName, discoveredGifts);
    }

    return response;
};

const mailboxListener = {
    name: "Mailbox",
    callback: parseMailbox,
    urlMatch: [/^mailbox\.php/],
    passive: true,
};

export default mailboxListener;
