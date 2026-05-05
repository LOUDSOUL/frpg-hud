import { getHudHtml, hudStatus, setStatsData, setStatsHtml } from "../utils/hud";
import { inventoryCache, itemNameIdMap, updateInventory } from "../utils/inventory";
import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";

const addToggleButton = (element) => {
    const statsDiv = element.firstElementChild;
    const toggleHtml = `<span><a id="frpg-hud-toggle" style="padding: 3px 5px 2px 5px; border: 1px solid; border-radius: 5px;" onclick="toggleHudStatus()" href="#">HUD</span>`;

    const hrElement = statsDiv?.querySelector("hr");
    if (hrElement) {
        hrElement.insertAdjacentHTML("beforeBegin", toggleHtml);
    } else {
        const spans = element.querySelectorAll("span");
        if (spans.length > 0) {
            spans[spans.length - 1].insertAdjacentHTML("afterEnd", toggleHtml);
            return element;
        } else {
            statsDiv.insertAdjacentHTML("beforeEnd", toggleHtml);
        }
    };

    return element;
}

const explorationHud = (response) => {
    const parsedResponse = JSON.parse(response);

    const mainHtml = parsedResponse.html_main;
    const trackerHtml = parsedResponse.html_tracker;

    const mainElement = parseHtml(mainHtml);
    const trackerElement = trackerHtml ? parseHtml(trackerHtml) : trackerHtml;

    addToggleButton(mainElement);
    if (trackerElement) {
        addToggleButton(trackerElement);
    }
    const statsElements = Array.from(mainElement.querySelectorAll("span"));
    if (statsElements.length >= 3) {
        const acElement = statsElements[2];
        const acCount = parseNumberWithCommas(acElement.innerText);

        if (acCount !== inventoryCache[itemNameIdMap.get("Ancient Coin")]?.count) {
            updateInventory({ "Ancient Coin": acCount }, { isAbsolute: true, resolveNames: true });
        }
    }
    setStatsData(statsElements.map((i) => i.innerHTML));
    setStatsHtml(trackerElement ? trackerElement.innerHTML : "");

    return JSON.stringify({
        ...parsedResponse,
        html_main: mainElement.innerHTML,
        html_tracker: hudStatus ? getHudHtml() : trackerElement ? trackerElement.innerHTML : trackerElement,
    });

};

const hudListener = {
    name: "Exploration HUD",
    callback: explorationHud,
    urlMatch: [/worker\.php\?.*go=getstats/],
    passive: false,
};

export default hudListener;
