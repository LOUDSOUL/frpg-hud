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
    inventoryCache: {},
    itemNameIdMap: new Map(),
    inventoryLimit: 500
}));

vi.mock('../../src/utils/hud.js', () => ({
    setHudItemsByName: vi.fn(),
}));

describe("Viewexpedition parsing functionality", () => {
    beforeEach(() => vi.resetAllMocks());

    it("should parse expedition found items and update HUD", () => {
        const response = fs.readFileSync(path.join(__dirname, "viewexpedition.html"), "utf8");
        const url = "viewexpedition.php?id=5243756";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(setHudItemsByName).toHaveBeenCalledWith([
            "Broken Pipe",
            "Copper Wire",
            "Machine Part",
            "Monster Skull",
            "Onyx Scorpion",
            "Prickly Pear",
            "Pulley",
            "Sand",
            "Scrap Metal",
            "Scrap Wire",
            "Small Bolt",
            "Transistor"
        ]);
    });

    it("should handle expedition item collection", () => {
        const response = "success";
        const url = "worker.php?go=collectindvcharter&id=5243756&itemid=593";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();
        // ToDo add found items to inventory (probably should be stored in cache after getting viewexpedition)

        expect(result).toBe(response);
    });

});
