import { parseHtml } from "../utils/misc";
import { STORAGE_KEYS } from "../constants";
import { hudTimers } from "../utils/hud";


const parseHome = (response) => {
    const parsedResponse = parseHtml(response);
    const timers = parsedResponse.querySelectorAll(`[data-countdown-to]`);
    const updatedTimers = {};
    for (const element of timers) {
        const linkElement = element.closest(".item-link");
        if (!linkElement) continue;

        try {
            const itemId = new URLSearchParams(linkElement.href.split("?")[1]).get("id");
            const rawTime = element.dataset.countdownTo;
            const parsedTime = luxon.DateTime.fromISO(rawTime, { zone: "America/Chicago" });
            const time = new Date(parsedTime.toISO());

            updatedTimers[itemId] = +time;
        } catch {
            continue;
        }
    }

    GM_setValue(STORAGE_KEYS.HUD_TIMERS, { ...hudTimers, ...updatedTimers });
    return response;
};

const homeListener = {
    name: "Home Page",
    callback: parseHome,
    urlMatch: [/^index\.php/],
    passive: true,
};

export default homeListener;
