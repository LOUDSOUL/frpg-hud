import { updateInventory } from "../inventory";


const handleFarmHarvest = (response) => {
    const parsedResponse = JSON.parse(response);
    const updatedInventory = {};
    for (const cropId of Object.keys(parsedResponse.drops)) {
        updatedInventory[cropId] = parsedResponse.drops[cropId].qty;
    }
    updateInventory(updatedInventory, { isAbsolute: false });

    try {
        unsafeWindow.updateCropCount({ target: document.querySelector(".seedid") });
    } catch (error) {
        console.log("Error while updating crop counts", error);
    };
};

const farmWorkers = [
    {
        action: "harvestall",
        listener: handleFarmHarvest,
    }
]

export default farmWorkers;
