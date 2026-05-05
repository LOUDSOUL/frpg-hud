import { setSupplyItemsHud } from "../utils/hud";
import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";

const trackSupplyPack = (target) => {
    const itemContainer = target.closest(".item-content");
    const supplyPackName = itemContainer
        .querySelector(".item-title > strong")
        .childNodes[0].textContent.trim();
    const quantity = parseNumberWithCommas(itemContainer.querySelector("input.qty").value);

    setSupplyItemsHud(supplyPackName, quantity);
};
unsafeWindow.trackSupplyPack = trackSupplyPack;

const parseLocksmith = (response) => {
    const parsedResponse = parseHtml(response);
    const itemList = parsedResponse.querySelectorAll(".close-panel");
    for (const item of itemList) {
        item.setAttribute("onclick", "trackSupplyPack(event.target)");
    }
    const qtyInputs = parsedResponse.querySelectorAll("input.qty");
    for (const input of qtyInputs) {
        input.setAttribute("oninput", "trackSupplyPack(event.target)");
    }
    return parsedResponse.innerHTML;
};

const locksmithListener = {
    name: "Locksmith",
    callback: parseLocksmith,
    urlMatch: [/^locksmith\.php/],
    passive: false,
};

export default locksmithListener;
