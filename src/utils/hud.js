import { darkModeActive, HUD_DISPLAY_MODES, STORAGE_KEYS } from "../constants";
import { inventoryCache, inventoryLimit, itemNameIdMap } from "./inventory";
import { debounceHudUpdate, getDefaultTextColor, refreshInventory } from "./misc";
import { getFormattedNumber } from "./numbers";
import { settings } from "./settings";


let statsData = [];
export const setStatsData = (data) => statsData = data;

let statsHtml = "";
export const setStatsHtml = (html) => statsHtml = html;

export let hudStatus = GM_getValue(STORAGE_KEYS.HUD_STATUS, false);
export const setHudStatus = (status) => hudStatus = status;

export let hudItems = GM_getValue(STORAGE_KEYS.HUD_ITEMS, []);
export const setHudItems = (items) => hudItems = items;

export let hudTimers = GM_getValue(STORAGE_KEYS.HUD_TIMERS, {});

export let hudStash = GM_getValue(STORAGE_KEYS.HUD_STASH, null);
export const setHudStash = (value) => hudStash = value;

let hudTimerInterval = null;

export const handleHudTimerUpdate = (value) => {
    hudTimers = value;

    clearInterval(hudTimerInterval);
    if (Object.keys(value).length > 0 && settings.mealTimersEnabled) {
        hudTimerInterval = setInterval(updateHudDisplay, 1000);
    }

    return true;
};

setTimeout(() => handleHudTimerUpdate(hudTimers));

let hudUrl = GM_getValue(STORAGE_KEYS.HUD_URL, null);
export const setHudUrl = (url) => hudUrl = url;

export const toggleHudStatus = () => {
    GM_setValue(STORAGE_KEYS.HUD_STATUS, !hudStatus);
}
unsafeWindow.toggleHudStatus = toggleHudStatus;

export const addHudItems = (items) => {
    const seenIds = new Set();
    const updatedItems = [];

    for (const item of [...hudItems, ...items]) {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            updatedItems.push(item);
        }
    }

    if (updatedItems.length > hudItems.length) GM_setValue(STORAGE_KEYS.HUD_ITEMS, updatedItems);
};

export const setHudDetails = (items, url) => {
    items = items.filter(item => !["Iron", "Nails"].includes(item.name));

    GM_setValue(STORAGE_KEYS.HUD_ITEMS, items);

    if (url) {
        GM_setValue(STORAGE_KEYS.HUD_URL, url)
    }
}

export const setHudItemsByName = (items, displayMode = HUD_DISPLAY_MODES.INVENTORY) => {
    setHudDetails(items.map(item => {
        return { ...inventoryCache[itemNameIdMap.get(item)], displayMode };
    }).filter(item => item.id));
};

export const removeHudItem = (items) => {
    const updatedItems = hudItems.filter(item => !items.includes(item.id));
    GM_setValue(STORAGE_KEYS.HUD_ITEMS, updatedItems);
};

const restoreHudItems = () => {
    if (hudStash === null) return;

    setHudItemsByName(hudStash);
    GM_setValue(STORAGE_KEYS.HUD_STASH, null);
};

const formatRemainingTime = (timer, currentTime) => {
    const remainingSeconds = Math.max(0, Math.floor((timer - currentTime) / 1000));

    if (remainingSeconds < 60) {
        return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else if (remainingSeconds < 3600) {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${minutes} mins ${seconds.toString().padStart(2, '0')} secs`;
    } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
}

const hudHtmlCallbacks = {
    [HUD_DISPLAY_MODES.INVENTORY]: ({ image, count }) => {
        let textColour = getDefaultTextColor();
        if (count >= inventoryLimit) textColour = "red";
        else if (count >= inventoryLimit * 0.8) {
            const percent = count / inventoryLimit;
            const green = Math.round(255 - ((percent - 0.8) / 0.2) * (255 - 100));
            textColour = `rgb(255, ${green}, 50);`;
        }

        return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${getFormattedNumber(count)} / ${getFormattedNumber(inventoryLimit)} &nbsp;
            </span>`;
    },
    [HUD_DISPLAY_MODES.MEAL]: ({ name, image, count }) => {
        const textColour = count === 0 ? "red" : getDefaultTextColor();

        return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${name} (${getFormattedNumber(count)}) &nbsp;
            </span>`;
    },
    [HUD_DISPLAY_MODES.TIMER]: ({ name, image, timer, showName }) => {
        const currentTime = Date.now();
        const textColour = currentTime > timer ? "orange" : getDefaultTextColor();
        const remainingTime = currentTime > timer ? "Finished!" : formatRemainingTime(timer, currentTime);
        const timerText = showName ? `${name} (${remainingTime})` : remainingTime;

        return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${timerText} &nbsp;
            </span>`;
    },
}

const getHudItemHtml = (item) => {
    const callback = hudHtmlCallbacks[item.displayMode] ?? hudHtmlCallbacks[HUD_DISPLAY_MODES.INVENTORY];
    const itemContent = callback(item);

    return `<td style="padding: 0px">
                <a class="frpg-hud-item" href="item.php?id=${item.id}"
                data-id="${item.id}" data-count="${item.count}" data-remove="${item.removeOnQuickSell ?? false}">
                    ${itemContent}
                    <span class="fill-animation" 
                    style="position: absolute; left: 0; top: -3px; width: 0; height: 125%; background-color: rgba(255, 0, 0, 0.5); 
                    z-index: 1; border-radius: 3px;"></span>
                </a>
            </td>`;
}

const getHudTable = (items, perRowItems) => {
    let hudHtml = '<table style="width: 100%;">';

    for (let start = 0; start < items.length; start += perRowItems) {
        hudHtml += '<tr>';

        items.slice(start, start + perRowItems)
            .forEach(item => {
                hudHtml += getHudItemHtml(item);
            });

        hudHtml += '</tr>';
    }

    hudHtml += '</table>';
    return hudHtml;
};

unsafeWindow.refreshInventory = refreshInventory;
unsafeWindow.restoreHudItems = restoreHudItems;

export const getHudHtml = () => {
    const hudHasItems = hudItems.length > 0;
    const filteredTimers = Object.fromEntries(
        Object.entries(hudTimers).filter(([, timer]) => Date.now() - timer <= 15 * 1000)
    );
    const timersCount = Object.keys(filteredTimers).length;
    const displayTimers = timersCount > 0 && settings.mealTimersEnabled;

    const perRowItems = hudItems.length > 12 ? 3 : 2;
    const timerRows = Math.ceil(timersCount / perRowItems);
    const itemRows = Math.ceil(hudItems.length / perRowItems);
    const totalRows = (timerRows * displayTimers) + itemRows + (hudHasItems && displayTimers);

    const hudTranslateY = 50 + (4 * (totalRows - 1));

    let hudHtml =
        `<div id="frpg-hud" style="
            margin: 0;
            position: absolute;
            background: ${darkModeActive ? "#111111" : "#ffffff"};
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border: 1px solid ${darkModeActive ? "#555555" : "#dddddd"};
            padding: 5px;
            transform: translateY(-${hudTranslateY}%) translateX(-8px);
            line-height: 18px;
            z-index: 99999;
        ">
            ${statsData.join('')}
        <hr>`;

    const hudSegments = [];

    if (displayTimers) {
        const showName = timersCount === 1;
        const timerItems = Object.entries(filteredTimers).map(([id, timer]) => {
            return {
                ...inventoryCache[id],
                timer,
                showName,
                displayMode: HUD_DISPLAY_MODES.TIMER,
            };
        })
        hudSegments.push(getHudTable(timerItems, perRowItems));
    }
    if (hudHasItems) {
        const detailedItems = hudItems.map((item) => {
            return { ...item, ...inventoryCache[item.id] };
        })
        hudSegments.push(getHudTable(detailedItems, perRowItems));
    }
    if (!displayTimers && !hudHasItems) {
        hudSegments.push('<span>HUD empty!</span>');
    }

    hudHtml += hudSegments.join("<hr />");

    const continueButton = `<a class="button" style="margin-left: 2%; height: 22px; line-height: 20px; white-space: nowrap;" href="${hudUrl}">C</a>`;
    const restoreButton = `<a class="button" style="margin-left: 2%; height: 22px; line-height: 20px; white-space: nowrap;" onclick="restoreHudItems()">R</a>`;

    hudHtml += `<div style="display: flex; margin-top: 5px; margin-bottom: 15px;">
                    <a class="button" style="height: 22px; line-height: 20px; width: 42%;" onclick="refreshInventory()">Refresh</a>
                    <a href="explore.php" class="button" style="margin-left: 2%; height: 22px; line-height: 20px; width: 42%;">Explore</a>
                    ${hudStash !== null && settings.hudStashEnabled ? restoreButton : continueButton}
                </div>`;

    hudHtml += `</div>`

    return hudHtml;
}

const _updateHudDisplay = (forceUpdate = false) => {
    if (document.hidden && !forceUpdate) return;

    const parentElement = document.querySelector("#statszone");
    if (!parentElement) return;

    if (!hudStatus) {
        if (forceUpdate) parentElement.innerHTML = statsHtml;
        return;
    }

    const hudElement = getHudHtml();
    parentElement.innerHTML = hudElement;
}

export const updateHudDisplay = debounceHudUpdate(_updateHudDisplay, 100);
