import { parseHtml } from "../utils/misc";
import { updateInventory } from "../utils/inventory";
import { setLocationData } from "../utils/location";
import { parseNumberWithCommas } from "../utils/numbers";


const parseLocationDetails = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const type = urlParameters.get("type");
    const locationId = urlParameters.get("id");

    const parsedLocation = parseHtml(response);
    const items = parsedLocation.querySelectorAll(".card-content-inner > .row > .col-25");
    const updatedInventory = {};

    for (const item of items) {
        if (item.querySelector(`a[href^="item.php"]`) === null) continue;

        const itemId = item.firstElementChild.href.split("=")[1];
        let node = item.firstElementChild;

        while (node.nodeType !== Node.TEXT_NODE) {
            node = node.nextSibling;
        }

        const name = node.textContent.trim();
        const image = item.firstElementChild.firstElementChild.src;
        const count = parseNumberWithCommas(item.children[item.children.length - 1].textContent.trim().split(" ")[0]);

        const itemData = {
            id: itemId,
            name,
            image,
            count
        }

        const lockElement = item.querySelector("span > .f7-icons");

        if (lockElement) {
            itemData.locked = lockElement.parentElement.title === "Item locked";
        }

        updatedInventory[itemId] = itemData;
    }

    updateInventory(updatedInventory, { isDetailed: true });
    setLocationData(type, locationId, updatedInventory);

    return response;
};

const locationListener = {
    name: "Location",
    callback: parseLocationDetails,
    urlMatch: [/^location\.php.*/],
    passive: true,
};

export default locationListener;
