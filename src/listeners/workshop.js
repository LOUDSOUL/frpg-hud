import { parseHtml } from "../utils/misc";
import { updateInventory } from "../utils/inventory";
import { STORAGE_KEYS } from "../constants";
import { parseNumberWithCommas } from "../utils/numbers";


const parseWorkshop = (response) => {
    const parsedWorkshop = parseHtml(response);
    const recipeItems = {};
    const materialItems = {};
    const recipes = {};

    const recipeList = parsedWorkshop.querySelectorAll("ul > li.close-panel");
    for (const recipe of recipeList) {
        const recipeId = recipe.dataset.id;
        const recipeName = recipe.dataset.name;
        if (recipeId === undefined) continue;

        recipeItems[recipeId] = {
            id: recipeId,
            name: recipeName,
            image: recipe.querySelector(".itemimg").src,
            count: Number(recipe.querySelector(".item-title > strong > span").textContent.replace(/(,|\(|\))/g, ""))
        }

        let materialName;
        let materialCount;
        let materialRequired;

        const recipeMaterials = {};

        const materialDetails = recipe.querySelector(".item-title > span");
        let node = materialDetails.firstChild;

        while (node !== null) {
            if (node.nodeName === "BR") {
                node = node.nextSibling;
                continue;
            }
            if (node.nodeName === "SPAN" && node.style.color === "red") {
                const parts = node.textContent.split(" ");

                materialCount = parseNumberWithCommas(parts[0]);
                materialRequired = parseNumberWithCommas(parts[2]);
                materialName = parts.slice(3).join(" ");
            } else {
                const amountNode = node.nextSibling;
                const nameNode = amountNode.nextSibling;

                materialCount = Number(node.textContent.replace(/(,|\/)/g, "").trim());
                materialRequired = Number(amountNode.dataset.amt);
                materialName = nameNode.textContent.trim();

                node = nameNode;
            }

            materialItems[materialName] = materialCount;
            recipeMaterials[materialName] = materialRequired;

            node = node.nextSibling;
        }

        recipes[recipeName] = recipeMaterials;
    }

    for (const card of parsedWorkshop.querySelectorAll(".card-content-inner")) {
        const cardText = card.innerText.trim();
        const regex = /resource saver perk is (\d{1,2})%/;
        const result = regex.exec(cardText);
        if (result) {
            const newRateText = result[1];
            const newRate = 1 + (Number(newRateText) / 100);

            GM_setValue(STORAGE_KEYS.RETURN_RATE, newRate);
            break;
        }
    }

    updateInventory(recipeItems, { isAbsolute: true, isDetailed: true });
    updateInventory(materialItems, { isAbsolute: true, resolveNames: true });

    GM_setValue(STORAGE_KEYS.RECIPES, recipes);
    GM_setValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());

    return response;
};

const workshopListener = {
    name: "Workshop",
    callback: parseWorkshop,
    urlMatch: [/^workshop\.php$/],
    passive: true,
};

export default workshopListener;
