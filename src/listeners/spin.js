import { wheelItems } from "../constants";
import { setHudItemsByName } from "../utils/hud";

const wheelSpin = (response) => {
    setHudItemsByName(wheelItems);
    return response;
};

const spinListener = {
    name: "Wheel Spin",
    callback: wheelSpin,
    urlMatch: [/^spin\.php/],
    passive: true,
};

export default spinListener;
