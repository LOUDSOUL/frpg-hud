import fs from 'fs';
import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../src/main.js';
import { STORAGE_KEYS } from '../../src/constants.js';
import { updateInventory } from '../../src/utils/inventory.js';

listeners.forEach(listener => {
    listener.passive = false;
});

vi.mock('../../src/utls/quests.js', () => ({
    quests: {},
}));

vi.mock('../../src/utils/inventory.js', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {
        '10': { count: 100, name: 'Wood' },
        '11': { count: 100, name: 'Board' },
    },
    itemNameIdMap: new Map([
        ['Wood', '10'],
        ['Board', '11'],
    ]),
    inventoryLimit: 500
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
        })
    })
});
