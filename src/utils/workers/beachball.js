import { updateInventory } from "../inventory";

const handleBeachball = (response) => {
    try {
        const itemMatch = response.match(/<strong>(.*?)<\\\/strong>/);
        const quantityMatch = response.match(/class='itemimg'> x(\d+)/);
        
        if (itemMatch && itemMatch[1]) {
            const itemName = itemMatch[1];
            const quantity = quantityMatch && quantityMatch[1] ? parseInt(quantityMatch[1]) : 1;
            
            updateInventory({ [itemName]: quantity }, { isAbsolute: false, resolveNames: true });
        }
    } catch (error) {
        console.error("Error processing beachball response:", error);
    }
};

const beachballWorkers = [
    {
        action: "beachball",
        listener: handleBeachball,
    }
];

export default beachballWorkers;