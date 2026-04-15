import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

listeners.forEach(listener => {
    listener.passive = false;
});

describe('Harvest parsing functionality', () => {
    beforeEach(() => vi.resetAllMocks());

    it('should handle single harvest responses', () => {
        const response = `{"result":"success","drops":{"1276":{"name":"Sugar Cane","img":"/img/items/scane.png","qty":1}}}`;
        const url = "worker.php?go=harvest&id=15647209471";
        const type = "fetch";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            { "1276": 1 },
            { isAbsolute: false }
        );
    });

    it('should handle harvestall responses', () => {
        const response = `{"result":"success","drops":{"1276":{"name":"Sugar Cane","img":"/img/items/scane.png","qty":73}}}`;
        const url = "worker.php?id=115961&go=harvestall";
        const type = "fetch";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            { "1276": 73 },
            { isAbsolute: false }
        );
    });

    it('should handle grapejuicevat responses', () => {
        const response = `{"result":"success","drops":{"373":{"name":"Sunflower","img":"/img/items/sunflower.png","qty":12510}},"extra":"Prizes: 96 Double Prizes: 43<br/>","gj":2}`;
        const url = "worker.php?seed_id=589&gj=2&go=grapejuicevat";
        const type = "fetch";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            { "373": 12510 },
            { isAbsolute: false }
        );
    });
});
