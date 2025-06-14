import { staminaItems } from "../../constants";


export const handleItemUse = (itemName, count, cleanup) => {
    if (!staminaItems.includes(itemName)) {
        myApp.addNotification({ title: "This shouldn't be possible...", subtitle: "Cannot use this item" });
        return cleanup();
    }

    const method = itemName === "Apple" ? "eatxapples" : "drinkxojs";

    $.ajax({
        url: `worker.php?go=${method}&amt=${count}`,
        method: "POST"
    }).done(function () {
        return cleanup();
    })
};
