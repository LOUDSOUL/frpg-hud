import inventoryListener from "./listeners/inventory";
import workerListener from "./listeners/worker";
import areaListener from "./listeners/area";
import craftworksListener from "./listeners/craftworks";
import homeListener from "./listeners/home";
import hudListener from "./listeners/hud";
import itemListener from "./listeners/item";
import locationListener from "./listeners/location";
import locksmithListener from "./listeners/locksmith";
import townsfolkListener from "./listeners/npclevels";
import spinListener from "./listeners/spin";
import workshopListener from "./listeners/workshop";
import xfarmListener from "./listeners/xfarm";

import { interceptFetch, interceptXHR } from "./utils/interceptors";
import { setupEventListeners } from "./utils/listeners";
import { setupStorageListeners } from "./utils/storage";


const listeners = [
    workerListener,
    hudListener,
    xfarmListener,
    areaListener,
    homeListener,
    itemListener,
    inventoryListener,
    workshopListener,
    locationListener,
    craftworksListener,
    locksmithListener,
    spinListener,
    townsfolkListener,
];

const responseHandler = (response, url, type) => {
    for (const listener of listeners) {
        for (const regex of listener.urlMatch) {
            if (!regex.test(url)) continue;

            if (listener.passive) {
                setTimeout(listener.callback, null, response, url, type);
                return response;
            }

            try {
                const modifiedResponse = listener.callback(response, url, type);
                return modifiedResponse ?? response;
            } catch (error) {
                console.error("Error while calling callback for", listener, error);
                return response;
            }
        }
    }

    return response;
};

setupEventListeners();
setupStorageListeners();

interceptXHR(responseHandler);
interceptFetch(responseHandler);

/* eslint-disable no-undef */
// Only export during testing
// Prevents the bundler from injecting `exports` into the build
if (__TEST_MODE && typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { listeners, responseHandler };
}
/* eslint-enable no-undef */
