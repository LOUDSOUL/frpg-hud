import { hudItems } from "../hud";
import { inventoryCache, updateInventory } from "../inventory";


const handleFishSell = () => {
    const updatedInventory = {};
    for (const item of hudItems) {
        const itemId = item.id;
        const itemDetails = inventoryCache[itemId];

        if (itemDetails.locked === false) {
            updatedInventory[itemId] = -itemDetails.count;
        }
    }
    updateInventory(updatedInventory, { isAbsolute: false });
};

const handleItemSale = (response, parameters) => {
    if (response === "error") return;

    const itemId = parameters.get("id");
    const itemCount = parameters.get("qty");

    updateInventory({ [itemId]: -itemCount }, { isAbsolute: false });
};

const handleKabobSale = (response, parameters) => {
    if (response === "cannotafford") return;

    const amount = parameters.get("amt");
    updateInventory({ "Steak Kabob": -amount }, { isAbsolute: false, resolveNames: true });
};

const handleSteakSale = (response, parameters) => {
    if (response === "cannotafford") return;

    const amount = parameters.get("amt");
    updateInventory({ "Steak": -amount }, { isAbsolute: false, resolveNames: true });
};

const itemSellWorkers = [
    {
        action: "sellitem",
        listener: handleItemSale,
    },
    {
        action: "sellalluserfish",
        listener: handleFishSell,
    },
    {
        action: "sellkabobs",
        listener: handleKabobSale,
    },
    {
        action: "sellsteaks",
        listener: handleSteakSale,
    },
];

export default itemSellWorkers;
