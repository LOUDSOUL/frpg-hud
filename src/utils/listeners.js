import { updateHudDisplay } from "./hud";
import { showLoadouts } from "./loadouts";
import { handleQuickAction } from "./quickActions";


const preventDefaultContextMenu = () => {
    document.addEventListener('contextmenu', function (e) {
        if (e.target.id === "frpg-hud-toggle") e.preventDefault();
        if (e.target.closest("a.frpg-hud-item")) e.preventDefault();
    }, false);
};

const setupDOMContentLoadedHandlers = () => {
    document.addEventListener('DOMContentLoaded', () => {
        setupAuxClickHandler();
        setupTouchHandlers();
    });
};

const setupAuxClickHandler = () => {
    document.body.addEventListener('auxclick', (event) => {
        if (event.button !== 1) return;

        if (event.target.id === "frpg-hud-toggle") {
            event.preventDefault();
            event.stopPropagation();
            return showLoadouts();
        }

        const target = event.target.closest('a.frpg-hud-item');
        if (!target) return;

        event.preventDefault();
        event.stopPropagation();
        handleQuickAction(target);
    });
};

const setupTouchHandlers = () => {
    let quickActionTimeout;
    let animationElement;

    const clearAnimation = () => {
        if (animationElement) {
            animationElement.classList.remove("active");
            animationElement = null;
        }
    };

    document.body.addEventListener("touchstart", (event) => {
        if (event.target.id === "frpg-hud-toggle") {
            clearTimeout(quickActionTimeout);
            quickActionTimeout = setTimeout(() => {
                showLoadouts();
            }, 500);
        }

        const target = event.target.closest('a.frpg-hud-item');
        if (!target) return;

        animationElement = target.querySelector('.fill-animation');
        if (animationElement) animationElement.classList.add('active');

        clearTimeout(quickActionTimeout);
        quickActionTimeout = setTimeout(() => {
            clearAnimation();
            handleQuickAction(target);
        }, 500);
    }, { passive: true });

    const cancelTouch = () => {
        if (quickActionTimeout) {
            clearTimeout(quickActionTimeout);
            quickActionTimeout = null;
        }
        clearAnimation();
    };

    document.body.addEventListener("touchend", cancelTouch);
    document.body.addEventListener("touchmove", cancelTouch);
};

const addAnimationStyle = () => {
    GM_addStyle(`
        .frpg-hud-item .fill-animation.active {
            animation: fillUp 500ms forwards;
        }
        
        @keyframes fillUp {
            from { width: 0; }
            to { width: 95%; }
        }
    `);
};

const setupVisibilityChangeListener = () => {
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            updateHudDisplay(true);
        }
    })
};

export const setupEventListeners = () => {
    addAnimationStyle();
    preventDefaultContextMenu();
    setupDOMContentLoadedHandlers();
    setupVisibilityChangeListener();
};
