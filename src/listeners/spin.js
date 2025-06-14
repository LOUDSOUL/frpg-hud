import { wheelItems } from "../constants";
import { parseHtml } from "../utils/misc";
import { setHudItemsByName } from "../utils/hud";
import { getFormattedNumber } from "../utils/numbers";


const wheelSpin = (response) => {
    setHudItemsByName(wheelItems);

    const parsedResponse = parseHtml(response);
    const spinElement = parsedResponse.querySelector(`.card-content-inner > a[href="wheelhistory.php"]`).parentElement;
    const spinCount = Number(spinElement.children[3].innerText);
    const spinCost = 5 / 2 * spinCount * Math.max(0, (spinCount - 1));
    spinElement.innerHTML = spinElement.innerHTML.replace("</strong> time(s)", `</strong> time(s) for a total of <strong>${getFormattedNumber(spinCost)}</strong> coins`);
    return parsedResponse.innerHTML;
};

const spinListener = {
    name: "Wheel Spin",
    callback: wheelSpin,
    urlMatch: [/^spin\.php/],
};

export default spinListener;
