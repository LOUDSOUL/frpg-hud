const getSellUrlParams = (itemId, itemName, count) => {
    switch (itemName) {
        case "Steak":
            return `sellsteaks&amt=${count}`;
        case "Steak Kabob":
            return `sellkabobs&amt=${count}`;
        default:
            return `sellitem&id=${itemId}&qty=${count}`;
    }
};

export const handleItemSell = (itemId, itemName, count, cleanup) => {
    const urlParameters = getSellUrlParams(itemId, itemName, count);

    $.ajax({
        url: `worker.php?go=${urlParameters}`,
        method: "POST"
    }).done((data) => {
        if (data === "error") {
            myApp.addNotification({ title: "Error selling item!", subtitle: "Inventory most likely out of sync. Craftworks?" });
        }
        cleanup();
    });
};
