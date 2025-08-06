import { darkModeActive } from "../constants";

export const parseHtml = (htmlString) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    return tempElement;
}

export function debounceHudUpdate(fn, delay) {
    let timer = null;
    let lastArgs = null;
    let lastThis = null;
    let invoked = false;

    return function (...args) {
        lastArgs = args;
        lastThis = this;

        const callNow = !invoked || args[0];  // forcedUpdate

        if (timer) {
            clearTimeout(timer);
        }

        if (callNow) {
            fn.apply(lastThis, lastArgs);
            invoked = true;
        }

        timer = setTimeout(() => {
            fn.apply(lastThis, lastArgs);
            timer = null;
            invoked = false;
        }, delay);
    };
}

export const refreshInventory = () => {
    myApp.showIndicator();
    $.ajax({
        url: `inventory.php`,
        method: "GET"
    }).done(() => {
        myApp.hideIndicator();
    });
};

export const getDefaultTextColor = () => darkModeActive ? "white" : "black";

export const capitalizeFirst = (text) => text[0].toUpperCase() + text.slice(1);
