import fs from 'fs';
import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../src/main.js';
import { STORAGE_KEYS } from '../../src/constants.js';
import { updateInventory } from '../../src/utils/inventory.js';
import { setHudDetails } from '../../src/utils/hud.js';

listeners.forEach(listener => {
    listener.passive = false;
});

vi.mock('../../src/utls/quests.js', () => ({
    quests: {},
}));

vi.mock('../../src/utils/inventory.js', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {
        '454': { id: '454', count: 5, name: '100 Gold', image: 'http://localhost/img/items/goldpouch2.png' },
        '508': { id: '508', count: 10, name: 'Arnold Palmer', image: 'http://localhost/img/items/ap.png' },
    },
    itemNameIdMap: new Map([
        ['100 Gold', '454'],
        ['Arnold Palmer', '508'],
    ]),
    inventoryLimit: 500
}));

vi.mock('../../src/utils/hud.js', () => ({
    setHudDetails: vi.fn(),
}));

describe("Quest parsing functionality", () => {
    beforeEach(() => vi.resetAllMocks());

    it("should parse quest rewards and inventory update", () => {
        const response = fs.readFileSync(path.join(__dirname, "quest.html"), "utf8");
        const url = "quest.php?id=5243756";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith({
            "714": {
                "count": 0,
                "id": "714",
                "image": "http://localhost/img/items/8285.png",
                "name": "Bananas",
            },
            "454": {
                "id": "454",
                "image": "http://localhost/img/items/goldpouch2.png",
                "name": "100 Gold",
            },
            "508": {
                "id": "508",
                "image": "http://localhost/img/items/ap.png",
                "name": "Arnold Palmer",
            },
        }, { isDetailed: true, });
        expect(global.GM_setValue).toBeCalledWith(STORAGE_KEYS.QUESTS, {
            "5243756": {
                request: {
                    "Bananas": 10,
                },
                reward: {
                    "100 Gold": 1,
                    "Arnold Palmer": 5000,
                },
            }
        });
        expect(setHudDetails).toHaveBeenCalledWith([
            { id: '508', count: 10, name: 'Arnold Palmer', image: 'http://localhost/img/items/ap.png' },
            { id: '454', count: 5, name: '100 Gold', image: 'http://localhost/img/items/goldpouch2.png' }
        ], url);
    })
});
