import { HUD_DISPLAY_MODES, loadouts, STORAGE_KEYS } from "../constants";
import { craftworks } from "./craftworks";
import { hudItems, hudStash, hudStatus, setHudItemsByName, toggleHudStatus } from "./hud";
import { inventoryCache } from "./inventory";
import { refreshInventory } from "./misc";
import { showSettings } from "./settings";


const showLoadout = (loadout) => {
    if (hudStash === null) {
        const currentItemNames = hudItems.map(item => item.name);
        GM_setValue(STORAGE_KEYS.HUD_STASH, currentItemNames);
    };

    setHudItemsByName(
        loadout.items,
        loadout.displayMode ?? HUD_DISPLAY_MODES.INVENTORY
    );
    if (!hudStatus) toggleHudStatus();
};

export const showLoadouts = () => {
    const loadoutActions = [
        {
            text: "Change script settings",
            onClick: showSettings,
        },
        {
            text: "Select the loadout to activate",
            label: true,
        },
        ...Object.keys(loadouts).map((loadoutName) => {
            return {
                text: loadoutName,
                onClick: () => showLoadout(loadouts[loadoutName]),
            }
        }),
        {
            text: "Craftworks",
            onClick: () => showLoadout({ items: craftworks.map(entry => inventoryCache[entry.item].name) }),
        },
        {
            text: "Cancel",
            color: "red",
            onClick: refreshInventory
        },
    ];

    myApp.actions(loadoutActions);
};
