import { removeHudItem } from "../hud";
import { getDefaultTextColor } from "../misc";


const hudRemovalTimeouts = {};

export const cancelHudRemoval = (itemId) => {
    clearTimeout(hudRemovalTimeouts[itemId]);
};

export const getCleanupCallback = (target) => {
    return (removeItem = true) => {
        const targetStyle = target.firstElementChild.style;
        targetStyle.color = getDefaultTextColor();

        if (removeItem && target.dataset.remove === "true") {
            const itemId = target.dataset.id;

            hudRemovalTimeouts[itemId] = setTimeout(() => {
                removeHudItem([itemId]);
            }, 2500);
        }

        return true;
    }
};
