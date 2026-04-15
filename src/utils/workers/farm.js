import { updateInventory } from "../inventory";

const processHarvestData = (data) => {
    if (!data.drops) return;

    const updatedInventory = {};
    for (const cropId of Object.keys(data.drops)) {
        updatedInventory[cropId] = data.drops[cropId].qty;
    }
    updateInventory(updatedInventory, { isAbsolute: false });
};

const handleFarmHarvest = (response) => {
    if (response === "") return;

    const parsedResponse = JSON.parse(response);
    processHarvestData(parsedResponse);

    try {
        const cropSelect = document.querySelector(".seedid");
        if (cropSelect) {
            unsafeWindow.updateCropCount({ target: cropSelect });
        }
    } catch (error) {
        console.log("Error while updating crop counts", error);
    };
};

const handleGrapeJuiceVat = (response) => {
    if (response === "") return;

    const parsedResponse = JSON.parse(response);
    processHarvestData(parsedResponse);
};

const farmWorkers = [
    {
        action: "harvest",
        listener: handleFarmHarvest,
    },
    {
        action: "harvestall",
        listener: handleFarmHarvest,
    },
    {
        action: "grapejuicevat",
        listener: handleGrapeJuiceVat,
    }
]

export default farmWorkers;
