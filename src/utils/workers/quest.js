import { updateInventory } from "../inventory";
import { quests } from "../quests";


const handleQuestClaim = (response, parameters) => {
    if (response === "") return; // Don't have requested items

    if (response === "already") return;

    if (response !== "success") return;

    const questId = parameters.get("id");
    const questDetails = quests[questId];

    if (!questDetails) return;

    const requestedItems = { ...questDetails.request };
    for(const [name, quantity] of Object.entries(requestedItems)) {
        requestedItems[name] = -quantity;
    }
    const updateBatch = { ...questDetails.reward, ...requestedItems };

    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, });
};

const questWorkers = [
    {
        action: "collectquest",
        listener: handleQuestClaim,
    },
];

export default questWorkers;
