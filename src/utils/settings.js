import { defaultSettings, STORAGE_KEYS } from "../constants";
import { handleHudTimerUpdate, hudTimers } from "./hud";
import { quickActions } from "./quickActions";


let _settings = GM_getValue(STORAGE_KEYS.SETTINGS, {});

/** @typedef {{ [K in keyof defaultSettings]: defaultSettings[K]['default'] }} UserSettings */

/** @type {UserSettings} */
export const settings = new Proxy(_settings, {
    get(target, key) {
        if (key in target) return target[key];

        if (typeof key === 'string' && key in defaultSettings) {
            return defaultSettings[key].default;
        };

        return undefined;
    },
})
export const setSettings = (value) => _settings = value;

/**
 * @param {keyof typeof defaultSettings} key 
 */
const toggleSetting = (key) => {
    settings[key] = !(settings[key] ?? defaultSettings[key].default);
    GM_setValue(STORAGE_KEYS.SETTINGS, settings);

    if (key === "mealTimersEnabled") {
        handleHudTimerUpdate(hudTimers);
    }
};

const exportQuickActions = () => {
    const quickActionsString = JSON.stringify(quickActions);
    GM_setClipboard(quickActionsString, "text");
    myApp.addNotification({ title: "Successfully exported QuickActions!", subtitle: `Exported ${Object.keys(quickActions).length} entries` });
};

const importQuickActions = () => {
    const input = prompt("Paste the QuickAction export:");
    try {
        const parsedActions = JSON.parse(input);
        if (typeof parsedActions !== 'object' || Array.isArray(parsedActions) || parsedActions === null) {
            throw new Error("Invalid paste");
        }
        GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, { ...quickActions, ...parsedActions });
        myApp.addNotification({ title: "Succesfully imported QuickActions!", subtitle: `Imported ${Object.keys(quickActions).length} entries` });
    } catch (error) {
        myApp.addNotification({ title: "Error importing QuickActions!", subtitle: `Please paste the full string from the export | ${error}` });
    }
}

export const showSettings = () => {
    const settingActions = [
        ...Object.keys(defaultSettings).map(key => {
            return {
                text: `${defaultSettings[key].label}: ${(settings[key] ?? defaultSettings[key].default) ? "Yes" : "No"}`,
                onClick: () => {
                    toggleSetting(key);
                    showSettings();
                },
            }
        }),
        {
            text: "Export QuickActions",
            onClick: exportQuickActions,
        }, 
        {
            text: "Import QuickActions",
            onClick: importQuickActions,
        },
        {
            text: "Exit",
            color: "red",
        }
    ];

    myApp.actions(settingActions);
};
