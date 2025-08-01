import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';


listeners.forEach(listener => {
    listener.passive = false;
});

vi.mock('../../../src/utils/inventory.js', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {
        '378': { count: 100, name: 'Water Lily' },
    },
    itemNameIdMap: new Map([
        ['Water Lily', '378'],
    ]),
    inventoryLimit: 500
}));

describe('Wishing well throw parsing', () => {
    beforeEach(vi.resetAllMocks);

    it('should handle throwing multiple items', () => {
        const response = `<img src='/img/items/5691.png' style='vertical-align:middle; width:18px'> Mushroom Paste (x22)<br/>
                          <img src='/img/items/popcorn.png' style='vertical-align:middle; width:18px'> Popcorn (x16)<br/>
                          <img src='/img/items/4497.png' style='vertical-align:middle; width:18px'> Grab Bag 02 (x20)<br/>`;
        const url = "worker.php?go=tossmanyintowell&id=378&amt=29";
        const type = "ajax";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            {
                "Mushroom Paste": 22,
                "Popcorn": 16,
                "Grab Bag 02": 20,
                "Water Lily": -29,
            },
            { isAbsolute: false, resolveNames: true }
        );
    });

    it('should handle not having enough gold', () => {
        const response = `cannotafford`;
        const url = "worker.php?go=tossmanyintowell&id=378&amt=29";
        const type = "ajax";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    });
});

describe('Rewards claim parsing', () => {
    beforeEach(vi.resetAllMocks);

    it('should handle claiming rewards', () => {
        const response = `Rewards Earned:<br/>
                            <img src='/img/items/seadragon.png' style='width:16px'> Sea Dragon x10<br/>
                            <img src='/img/items/spikey.png' style='width:16px'> Spiked Shell x10<br/>
                            <img src='/img/items/sunflower.png' style='width:16px'> Sunflower x10<br/>`;
        const url = "worker.php?go=collectrew&type=Quests";
        const type = "ajax";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            {
                "Sea Dragon": 10,
                "Spiked Shell": 10,
                "Sunflower": 10,
            },
            { isAbsolute: false, resolveNames: true }
        );
    });

    it('should handle no rewards left', () => {
        const response = `No Rewards Left`;
        const url = "worker.php?go=collectrew&type=Quests";
        const type = "ajax";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    });

    it('should handle empty response', () => {
        const response = ``;
        const url = "worker.php?go=collectrew&type=Quests";
        const type = "ajax";

        const result = responseHandler(response, url, type);

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    });
});
