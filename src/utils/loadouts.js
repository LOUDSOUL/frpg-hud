import { HUD_DISPLAY_MODES, loadouts } from "../constants";
import { craftworks } from "./craftworks";
import { hudStatus, setHudItemsByName, toggleHudStatus } from "./hud";
import { inventoryCache } from "./inventory";
import { refreshInventory } from "./misc";
import { showSettings } from "./settings";


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
                onClick: () => {
                    setHudItemsByName(
                        loadouts[loadoutName].items,
                        loadouts[loadoutName].displayMode ?? HUD_DISPLAY_MODES.INVENTORY
                    );
                    if (!hudStatus) toggleHudStatus();
                },
            }
        }),
        {
            text: "Craftworks",
            onClick: () => {
                if (craftworks.length === 0) return;

                setHudItemsByName(craftworks.map(entry => inventoryCache[entry.item].name));
                if (!hudStatus) toggleHudStatus();
            },
        },
        {
            text: "Cancel",
            color: "red",
            onClick: refreshInventory
        },
    ];

    myApp.actions(loadoutActions);
};
