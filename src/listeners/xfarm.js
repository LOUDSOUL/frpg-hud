import { seedCrop } from "../constants";
import { inventoryCache } from "../utils/inventory";
import { parseHtml } from "../utils/misc";
import { parseProductionRows } from "../utils/xfarm";


const updateCropCount = (event) => {
    const selectElement = event.target;
    const targetElement = selectElement.parentElement.parentElement.firstElementChild;

    const seedId = selectElement.value;
    const cropName = selectElement.selectedOptions[0].dataset.name.slice(0, -6);

    const cropId = seedCrop[seedId] || null;
    const cropInventory = cropId === null ? "??" : inventoryCache[cropId]?.count ?? "??";

    targetElement.innerText = `${cropInventory} ${cropName} in inventory`;
};
unsafeWindow.updateCropCount = updateCropCount;

const parseFarm = (response) => {
    const parsedResponse = parseHtml(response);
    const cropSelect = parsedResponse.querySelector("select.seedid");
    cropSelect.setAttribute("onchange", "updateCropCount(event)");
    updateCropCount({ target: cropSelect });

    parseProductionRows(parsedResponse);

    return parsedResponse.innerHTML;
};

const xfarmListener = {
    name: "Farm",
    callback: parseFarm,
    urlMatch: [/^xfarm\.php\?id=/],
    passive: false,
};

export default xfarmListener;
