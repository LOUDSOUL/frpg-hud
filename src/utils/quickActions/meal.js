import { refreshInventory } from "../misc";


const useMeal = (mealId, mealName) => {
    $.ajax({
        url: `worker.php?go=useitem&id=${mealId}`,
        method: "POST"
    }).done(function (data) {
        switch (data) {
            case "success":
                myApp.addNotification({ title: "Delicious", subtitle: `${mealName} successfully used` });
                break;
            case "limit":
                myApp.addNotification({ title: "Meal limit reached!", subtitle: "Cancel some meals or buy more slots" });
                break;
            case "error":
                myApp.addNotification({ title: "Cannot use meals right now!", subtitle: "Try again later when reset is over" });
                break;
            default:
                myApp.addNotification({ title: "Something went wrong...", subtitle: `Unexpected server response: ${data}` });
                break;
        }
    })
};

export const confirmMealUse = (mealId, mealName) => {
    const actions = [
        {
            text: `Are you sure you want to eat ${mealName}?`,
            label: true,
        },
        {
            text: "Yes",
            onClick: () => useMeal(mealId, mealName),
        },
        {
            text: "Cancel",
            color: "red",
            onClick: refreshInventory,
        },
    ];

    myApp.actions(actions);
};
