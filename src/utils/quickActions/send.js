import { townsfolk } from "../townsfolk";


export const handleItemSend = (itemId, count, action, cleanup) => {
    const sendTarget = action.townsfolk;
    const targetId = townsfolk[sendTarget];

    if (!targetId) {
        myApp.addNotification({
            title: "Invalid townsfolk selected",
            subtitle: "The townsfolk set for this item does not exist"
        });
        return cleanup(false);
    }

    $.ajax({
        url: `worker.php?go=givemailitem&id=${itemId}&to=${targetId}&qty=${count}&rs=1`,
        method: "POST"
    }).done((data) => {
        if (data === "cannotrec") {
            myApp.addNotification({
                title: "Error!",
                subtitle: "This NPC cannot accept this item"
            });
        };
        cleanup();
    });
};
