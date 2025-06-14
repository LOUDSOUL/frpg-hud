import craftingWorkers from "./crafting";
import explorationWorkers from "./exploration";
import farmWorkers from "./farm";
import fishingWorkers from "./fishing";
import itemSellWorkers from "./itemSell";
import itemSendWorkers from "./itemSend";
import itemUseWorkers from "./itemUse";
import miscWorkers from "./misc";

export const workers = [
    ...explorationWorkers,
    ...fishingWorkers,
    ...itemSellWorkers,
    ...craftingWorkers,
    ...itemUseWorkers,
    ...itemSendWorkers,
    ...miscWorkers,
    ...farmWorkers,
];
