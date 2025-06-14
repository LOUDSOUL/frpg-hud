import { STORAGE_KEYS } from "../constants";


export const fetchLocationData = (type, id) => {
    return GM_getValue(`${STORAGE_KEYS.LOCATION_PREFIX}.${type}-${id}`, null);
};

export const setLocationData = (type, id, data) => {
    const locationItems = [];
    for (const itemId of Object.keys(data)) {
        locationItems.push({
            id: itemId,
            name: data[itemId].name,
            image: data[itemId].image,
        })
    }
    GM_setValue(`${STORAGE_KEYS.LOCATION_PREFIX}.${type}-${id}`, locationItems);
};
