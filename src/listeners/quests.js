import { parseHtml } from "../utils/misc";
import { STORAGE_KEYS } from "../constants";
import { quests } from "../utils/quests";

const getQuestId = (questUrl) => {
    const urlParameters = new URLSearchParams(questUrl.split("?")[1]);
    return urlParameters.get("id");
}

const parseQuests = (response) => {
    const parsedResponse = parseHtml(response);

    const currentQuests = parsedResponse.querySelectorAll('a.item-link[href^="quest.php"]');
    const questIds = Array.from(currentQuests).map(quest => getQuestId(quest.href))

    const updatedQuests = { ...quests };

    for (const questId of Object.keys(quests)) {
        if (!questIds.includes(questId)) {
            delete updatedQuests[questId];
        }
    }

    GM_setValue(STORAGE_KEYS.QUESTS, updatedQuests);
};

const questsListener = {
    name: "Quests",
    callback: parseQuests,
    urlMatch: [/^quests\.php/],
    passive: true,
};

export default questsListener;
