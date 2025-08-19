import fs from 'fs';
import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../src/main.js';
import { setHudItemsByName } from '../../src/utils/hud.js';

listeners.forEach(listener => {
    listener.passive = false;
});

vi.mock('../../src/utils/inventory.js', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {
        '574': { count: 113, name: 'Crab' },
        '575': { count: 88, name: 'Green Barracuda' },
        '577': { count: 76, name: 'Jumbo Fish' },
    },
    itemNameIdMap: new Map([
        ['Crab', '574'],
        ['Green Barracuda', '575'],
        ['Jumbo Fish', '577'],
    ]),
    inventoryLimit: 500
}));

vi.mock('../../src/utils/hud.js', () => ({
    setHudItemsByName: vi.fn(),
}));

describe("Viewcharter parsing functionality", () => {
    beforeEach(() => vi.resetAllMocks());

    it("should parse charter found items and show current amount in HUD", () => {
        const response = fs.readFileSync(path.join(__dirname, "viewcharter.html"), "utf8");
        const url = "viewcharter.php?id=5243756";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(setHudItemsByName).toHaveBeenCalledWith([
            "Crab",
            "Green Barracuda", 
            "Jumbo Fish",
            "Mulberry Snapper",
            "Orcafish",
            "Purple Butterfly Fish",
            "Speckled Grouper"
        ]);
    });

    it("should handle charter item collection", () => {
        const response = "success";
        const url = "worker.php?go=collectindvcharter&id=5243756&itemid=570";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();
        // ToDo add found items to inventory (probably should be stored in cache after getting viewcharter)

        expect(result).toBe(response);
    });
});