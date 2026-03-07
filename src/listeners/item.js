import { updateInventory } from "../utils/inventory";
import { quickActionChangeHandler, updateQuickActionParameter } from "../utils/item";
import { displayItemConfig } from "../utils/itemConfig";
import { parseHtml } from "../utils/misc";
import { parseNumberWithCommas } from "../utils/numbers";


unsafeWindow.updateQuickActionParameter = updateQuickActionParameter;
unsafeWindow.quickActionChangeHandler = quickActionChangeHandler;

const extractItemId = (url) => new URLSearchParams(url.split("?")[1]).get("id");

const extractItemName = (parsedHtml) => parsedHtml.querySelector(".navbar-inner > .center.sliding")?.innerText.trim();

const extractItemCount = (parsedHtml) => {
    const inventoryLink = parsedHtml.querySelector(`a[href="inventory.php"]`);
    const inventoryRow = inventoryLink?.closest(".item-content");
    const countText = inventoryRow?.querySelector(".item-after")?.innerText.trim() || "0";
    return parseNumberWithCommas(countText);
};

const extractItemImage = (parsedHtml) => parsedHtml.querySelector(".itemimglg")?.src || null;

const parseItemRow = (itemElement) => {
    const itemId = new URLSearchParams(itemElement.href.split("?")[1]).get("id");
    const name = itemElement.querySelector(".item-title > strong").innerText;
    const image = itemElement.querySelector(".item-media > img").src;
    const count = parseNumberWithCommas(itemElement.querySelector(".item-after").innerText.split("/")[0]);

    return { id: itemId, name, image, count };
}

const parseIngredients = (parsedHtml) => {
    const craftingSections = Array.from(parsedHtml.querySelectorAll(".content-block-title:has(.fa-wrench)"));
    const ingredientsSection = craftingSections.find(section => section.innerText.toLowerCase().includes("crafting recipe"));

    if (!ingredientsSection) return {};

    const ingredientDetails = ingredientsSection.nextElementSibling.nextElementSibling;
    const itemList = Array.from(ingredientDetails.querySelectorAll("a.item-link"));

    const ingredients = {};
    for(const item of itemList) {
        const itemData = parseItemRow(item);

        ingredients[itemData.id] = itemData;
    }

    return ingredients;
}

const parseCrafts = (parsedHtml) => {
    const craftingSections = Array.from(parsedHtml.querySelectorAll(".content-block-title:has(.fa-wrench)"));
    const craftsSection = craftingSections.find(section => section.innerText.toLowerCase().includes("crafting use"));

    if (!craftsSection) return {};

    const craftsDetails = craftsSection.nextElementSibling.nextElementSibling;
    const itemList = Array.from(craftsDetails.querySelectorAll("a.item-link"));

    const crafts = {};
    for(const item of itemList) {
        const itemData = parseItemRow(item);
        
        crafts[itemData.id] = itemData;
    }

    return crafts;
}

const parseItem = (response, url) => {
    const parsedResponse = parseHtml(response, url);
    const itemId = extractItemId(url);
    const itemName = extractItemName(parsedResponse);
    const itemCount = extractItemCount(parsedResponse);
    const itemImage = extractItemImage(parsedResponse);

    const itemDetails = {
        id: itemId,
        name: itemName,
        count: itemCount,
        ...(itemImage && { image: itemImage })
    };

    const ingredientsInventory = parseIngredients(parsedResponse);
    const craftsInventory = parseCrafts(parsedResponse);

    updateInventory({
        [itemId]: itemDetails,
        ...ingredientsInventory,
        ...craftsInventory
    }, { isDetailed: true });
    displayItemConfig(parsedResponse, itemName, itemId);

    return parsedResponse.innerHTML;
}

const itemListener = {
    name: "Items",
    callback: parseItem,
    urlMatch: [/^item\.php\?id=\d+/],
    passive: false,
};

export default itemListener;
