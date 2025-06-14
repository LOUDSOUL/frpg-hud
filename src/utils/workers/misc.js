import { updateInventory } from "../inventory";
import { parseHtml } from "../misc";


const handleWheelSpin = (response) => {
    const parsedResponse = parseHtml(response.split("|")[1]);

    const rewardText = parsedResponse.innerText.split(":")[1];
    let [itemName, countText] = rewardText.split("(x");

    itemName = itemName.trim();
    if (itemName === "Apples") itemName = "Apple";

    const itemCount = Number(countText.split(")")[0]);

    updateInventory({ [itemName]: itemCount }, { isAbsolute: false, resolveNames: true });
};

const miscWorkers = [
    {
        action: "spinfirst",
        listener: handleWheelSpin,
    }
]

export default miscWorkers;
