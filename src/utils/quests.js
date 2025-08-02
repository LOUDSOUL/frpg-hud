import { STORAGE_KEYS } from "../constants";

export let quests = GM_getValue(STORAGE_KEYS.QUESTS, {});

export const setQuests = (updatedQuests) => {
    quests = updatedQuests;
};
