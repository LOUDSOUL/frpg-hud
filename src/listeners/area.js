import { setHudDetails } from "../utils/hud";
import { fetchLocationData } from "../utils/location";


const parseArea = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const locationId = urlParameters.get("id");
    const type = url.startsWith("area.php") ? "explore" : "fishing";

    const locationData = fetchLocationData(type, locationId);
    if (locationData === null) {
        myApp.addNotification({ title: "New location detected", subtitle: "Please visit the location details to track items with HUD!" });
        return response;
    };

    setHudDetails(locationData, url);
    return response;
};

const areaListener = {
    name: "Areas",
    callback: parseArea,
    urlMatch: [/^area\.php.*/, /^fishing\.php.*/],
    passive: true,
};

export default areaListener;
