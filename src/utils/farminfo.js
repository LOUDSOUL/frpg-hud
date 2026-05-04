import { inventoryCache } from "./inventory";
import { getFormattedNumber, parseNumberWithCommas } from "./numbers";

export const parseCropTile = (crop) => {
    const anchor = crop.firstElementChild;
    const id = anchor.href.split("?id=")[1];

    const image = anchor.firstElementChild.src;

    const nameSpan = crop.querySelector("span:nth-of-type(1)");
    const name = nameSpan.innerText.trim();

    const countSpan = crop.querySelector("span:nth-of-type(2)");
    const countText = countSpan.innerText.split("/")[0].trim();
    const count = parseNumberWithCommas(countText);

    return { id, name, image, count };
};

export const parseHarvestLog = (harvest) => {
    const anchor = harvest.querySelector(".item-media > a");
    const id = anchor.href.split("?id=")[1];
    const time = harvest.querySelector(".item-title > span").innerText.trim();
    const date = time.split(" ")[0];

    const harvestCountText = harvest.querySelector(".item-after").innerText.trim();
    const count = parseNumberWithCommas(harvestCountText);

    return { id, date, count };
};

const getCropStatsTile = (id, name, image, count) => {
    return `
        <div class="col-25">
            <a href="item.php?id=${id}">
                <img src="${image}" class="itemimg" />
            </a>
            <br />
            <span style="font-weight: bold">${name}</span>
            <br />
            <span style="font-size: 11px">${getFormattedNumber(count)}</span>
        </div>
    `;
};

const getCropStatsRow = (content) => {
    return `
        <div class="row no-gutter" style="margin-bottom:15px">
            ${content.join("")}
        </div>
    `;
};

const getCropStatsTab = (id, content, active) => {
    return `
        <div id="${id}" class="tab ${active ? "active" : ""}">
            <div class="content-block">
                <div class="card">
                    <div class="card-content">
                        <div class="card-content-inner">
                            ${content.join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const getHarvestStatsCard = (harvestedItems, tabPrefix = "tab1") => {
    const tabs = [];
    const tabButtons = [];

    let firstTab = true;

    for (const [date, harvests] of Object.entries(harvestedItems)) {
        const rows = [];
        const dateEntries = Object.entries(harvests).sort((a, b) => a[1] < b[1]);

        for (let i = 0; i < dateEntries.length; i += 4) {
            const rowItems = dateEntries.slice(i, i + 4);
            const rowContent = [];

            for (const [itemId, harvestCount] of rowItems) {
                const item = inventoryCache[itemId];
                const itemHtml = getCropStatsTile(itemId, item.name, item.image, harvestCount);
                rowContent.push(itemHtml);
            }

            const rowHtml = getCropStatsRow(rowContent);
            rows.push(rowHtml);
        }

        // Hack to preserve the game's crop sorting tabs
        // The cookie doesn't save whatever is after the hyphen
        const tabId = `${tabPrefix}-harvesttotals-${date.replaceAll("-", "").trim()}`;

        const tabHtml = getCropStatsTab(tabId, rows, firstTab);
        tabs.push(tabHtml);

        const buttonHtml = `<a href="#${tabId}" class="tab-link button ${firstTab ? "active" : ""}">${date}</a>`;
        tabButtons.push(buttonHtml);

        firstTab = false;
    }

    const cardHtml = `
        <div class="card">
            <div class="card-content">
                <div class="content-block">
                    <div class="buttons-row">
                        ${tabButtons.join("")}
                    </div>
                </div>
                <div class="tabs">
                    ${tabs.join("")}
                </div>
            </div>
        </div>
    `;

    return cardHtml;
};
