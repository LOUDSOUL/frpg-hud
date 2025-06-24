import { STORAGE_KEYS } from "../constants";
import { setCraftworks } from "./craftworks";
import { handleHudTimerUpdate, setHudItems, setHudStash, setHudStatus, setHudUrl, updateHudDisplay } from "./hud";
import { populateItemNameIdMap, setInventory, setInventoryLimit } from "./inventory";
import { setProduction } from "./production";
import { setQuickActions } from "./quickActions";
import { setSettings } from "./settings";
import { setSupplyPacks } from "./supplyPack";
import { setTownsfolk } from "./townsfolk";
import { setRecipes, setReturnRate } from "./workshop";


const storageListeners = {
    [STORAGE_KEYS.HUD_URL]: (value) => { setHudUrl(value); return true; },
    [STORAGE_KEYS.HUD_ITEMS]: (value) => { setHudItems(value); return true; },
    [STORAGE_KEYS.HUD_TIMERS]: handleHudTimerUpdate,
    [STORAGE_KEYS.HUD_STATUS]: (value) => { setHudStatus(value); return true; },
    [STORAGE_KEYS.HUD_STASH]: (value) => { setHudStash(value); return true; },
    [STORAGE_KEYS.INVENTORY]: (value) => { setInventory(value); return true; },
    [STORAGE_KEYS.INVENTORY_LIMIT]: (value) => { setInventoryLimit(value); return true; },
    [STORAGE_KEYS.SETTINGS]: (value) => { setSettings(value); return true; },

    [STORAGE_KEYS.QUICK_ACTIONS]: (value) => { setQuickActions(value); return false; },
    [STORAGE_KEYS.TOWNSFOLK]: (value) => { setTownsfolk(value); return false; },
    [STORAGE_KEYS.RECIPES]: (value) => { setRecipes(value); return false; },
    [STORAGE_KEYS.RETURN_RATE]: (value) => { setReturnRate(value); return false; },
    [STORAGE_KEYS.SUPPLY_PACKS]: (value) => { setSupplyPacks(value); return false; },
    [STORAGE_KEYS.NEW_ITEM]: () => { populateItemNameIdMap(); return false; },
    [STORAGE_KEYS.CRAFTWORKS]: (value) => { setCraftworks(value); return false; },
    [STORAGE_KEYS.PRODUCTION]: (value) => { setProduction(value); return false; },
};

export const setupStorageListeners = () => {
    for (const [key, handler] of Object.entries(storageListeners)) {
        GM_addValueChangeListener(key, (k, _oldVal, newVal) => {
            if (handler(newVal)) updateHudDisplay(k === STORAGE_KEYS.HUD_STATUS);
        });
    }
};
