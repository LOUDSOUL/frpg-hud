import { setHudItemsByName } from "../utils/hud";
import { parseHtml } from "../utils/misc";
import { supplyPacks } from "../utils/supplyPack";


const trackSupplyPack = (target) => {
    const itemContainer = target.closest(".item-content");
    const supplyPackName = itemContainer.querySelector(".item-title > strong").childNodes[0].textContent.trim();

    const supplyPackDetails = supplyPacks[supplyPackName];
    if (!supplyPackDetails) return;

    setHudItemsByName(Object.keys(supplyPackDetails));
};
unsafeWindow.trackSupplyPack = trackSupplyPack;


const parseLocksmith = (response) => {
    const parsedResponse = parseHtml(response);
    const itemList = parsedResponse.querySelectorAll(".close-panel");
    for (const item of itemList) {
        item.setAttribute("onclick", "trackSupplyPack(event.target)");
    }
    return parsedResponse.innerHTML;
}

const locksmithListener = {
    name: "Locksmith",
    callback: parseLocksmith,
    urlMatch: [/^locksmith\.php/],
    passive: false,
};

export default locksmithListener;
