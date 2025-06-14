import { updateInventory } from "../inventory";


const handleItemSend = (response, parameters) => {
    if (response !== "success") return;

    const itemId = parameters.get("id");
    const itemCount = parameters.get("qty");

    updateInventory({ [itemId]: -itemCount }, { isAbsolute: false });
};

const itemSendWorkers = [
    {
        action: "givemailitem",
        listener: handleItemSend
    },
];

export default itemSendWorkers;
