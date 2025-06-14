import { getHudHtml, hudStatus, setStatsData, setStatsHtml } from "../utils/hud";
import { parseHtml } from "../utils/misc";


const explorationHud = (response) => {
    const parsedHud = parseHtml(response);
    const statsDiv = parsedHud.firstElementChild;
    const toggleHtml = `<span><a id="frpg-hud-toggle" style="padding: 3px 5px 2px 5px; border: 1px solid; border-radius: 5px;" onclick="toggleHudStatus()" href="#">HUD</span>`;

    const hrElement = statsDiv.querySelector("hr");
    if (hrElement) {
        hrElement.insertAdjacentHTML("beforeBegin", toggleHtml);
    } else {
        statsDiv.insertAdjacentHTML("beforeEnd", toggleHtml);
    };

    setStatsData(Array.from(parsedHud.firstElementChild.children).filter(element => element.tagName === "SPAN").slice(0, 4).map(i => i.innerHTML));
    setStatsHtml(parsedHud.innerHTML);

    if (hudStatus) {
        return getHudHtml();
    }

    return parsedHud.innerHTML;
};

const hudListener = {
    name: "Exploration HUD",
    callback: explorationHud,
    urlMatch: [/worker\.php\?.*go=getstats/],
    passive: false,
};

export default hudListener;
