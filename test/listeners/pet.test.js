import fs from 'fs';
import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../src/main.js';
import { updateInventory } from '../../src/utils/inventory.js';
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

let petItemsCache = {};
global.GM_getValue = vi.fn((key, defaultValue) => {
    if (key === 'frpg.pet-items-cache') return petItemsCache;
    return defaultValue;
});
global.GM_setValue = vi.fn((key, value) => {
    if (key === 'frpg.pet-items-cache') petItemsCache = value;
});

describe("Pet parsing functionality", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        petItemsCache = {};
    });

    it("should parse pet found items and cache them for HUD", () => {
        const response = fs.readFileSync(path.join(__dirname, "pet.html"), "utf8");
        const url = "pet.php?id=1";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
        expect(setHudItemsByName).toHaveBeenCalledWith([
            "Blue Catfish",
            "Blue Feathers",
            "Blue Shell",
            "Bluegill",
            "Carp",
            "Crappie",
            "Drum",
            "Feathers"
        ]);
    });

    it("should update inventory when pet items are collected successfully", () => {
        // First parse pet page to cache items
        const petResponse = fs.readFileSync(path.join(__dirname, "pet.html"), "utf8");
        responseHandler(petResponse, "pet.php?id=1", "ajax");
        
        // Then collect items
        const response = "success";
        const url = "worker.php?go=collectpetitems&id=1";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith({
            "89": 31,
            "171": 20,
            "90": 25,
            "131": 31,
            "132": 28,
            "39": 29,
            "17": 37,
            "42": 35,
        }, { isAbsolute: false });
    });
});