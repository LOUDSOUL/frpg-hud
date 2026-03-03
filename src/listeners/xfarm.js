import { seedCrop } from "../constants";
import { inventoryCache } from "../utils/inventory";
import { parseHtml } from "../utils/misc";
import { parseProductionRows } from "../utils/xfarm";

// Store current crops data
let currentCropsData = null;


const updateCropCount = (event) => {
    const selectElement = event.target;
    const targetElement = selectElement.parentElement.parentElement.firstElementChild;

    const seedId = selectElement.value;
    const cropName = selectElement.selectedOptions[0].dataset.name?.slice(0, -6);

    if (!cropName) {
        // Show inventory of currently growing crops when no seed is selected
        const growingCropsInventory = getCurrentlyGrowingCropsInventory();
        if (growingCropsInventory.length > 0) {
            targetElement.innerText = growingCropsInventory.join(", ");
        } else {
            targetElement.innerText = "No crop selected";
        }
        return;
    }

    const cropId = seedCrop[seedId] || null;
    const cropInventory = cropId === null ? "??" : inventoryCache[cropId]?.count ?? "??";

    targetElement.innerText = `${cropInventory} ${cropName} in inventory`;
};

const getCurrentlyGrowingCropsInventory = () => {
    try {
        if (!currentCropsData) {
            return [];
        }
        
        const cropInventories = new Set();
        
        // Parse crop images from both condensed and full views
        const allCropImages = currentCropsData.querySelectorAll('#crops-condensed img, #crops img.cropitem');
        
        allCropImages.forEach(img => {
            const match = img.src.match(/\/img\/items\/(\w+)\./i);
            if (match) {
                const identifier = match[1];
                // Find crop by image identifier (numeric ID or name)
                for (const [, item] of Object.entries(inventoryCache)) {
                    if (item.image && (item.image.includes(`/${identifier}.`) || 
                        item.name.toLowerCase().includes(identifier.toLowerCase()))) {
                        const cropCount = item.count ?? "??";
                        cropInventories.add(`${cropCount} ${item.name} in inventory`);
                        break;
                    }
                }
            }
        });
        
        return Array.from(cropInventories);
    } catch (error) {
        console.warn('Could not parse growing crops inventory:', error);
        return [];
    }
};
unsafeWindow.updateCropCount = updateCropCount;

const parseFarm = (response) => {
    const parsedResponse = parseHtml(response);
    
    // Store crop data from initial farm response
    const cropArea = parsedResponse.querySelector('#croparea');
    if (cropArea) {
        currentCropsData = parsedResponse;
    }
    
    const cropSelect = parsedResponse.querySelector("select.seedid");
    if (cropSelect) {
        cropSelect.setAttribute("onchange", "updateCropCount(event)");
        updateCropCount({ target: cropSelect });
    }

    parseProductionRows(parsedResponse);

    return parsedResponse.innerHTML;
};

const parsePanelCrops = (response) => {
    currentCropsData = parseHtml(response);
    return response;
};

const xfarmListener = {
    name: "Farm",
    callback: parseFarm,
    urlMatch: [/^xfarm\.php\?id=/],
    passive: false,
};

const panelCropsListener = {
    name: "Panel Crops",
    callback: parsePanelCrops,
    urlMatch: [/^panel_crops\.php/],
    passive: true,
};

export default [xfarmListener, panelCropsListener];
