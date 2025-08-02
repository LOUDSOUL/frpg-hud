import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';
import { setQuests } from '../../../src/utils/quests.js';

listeners.forEach(listener => {
    listener.passive = false;
});

vi.mock('../../../src/utils/inventory.js', () => ({
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

describe('Quest claim functionality', () => {
    beforeEach(() => {
        setQuests({ "5000": { request: { "Board": 50 }, reward: { "Wood": 100 } } });
        vi.resetAllMocks();
    });

    it('should handle claiming quests', () => {
        const response = `success`;
        const url = "worker.php?go=collectquest&id=5000";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).toHaveBeenCalledWith(
            {
                "Wood": 100,
                "Board": -50,
            },
            { isAbsolute: false, resolveNames: true, }
        );
    });

    it('should handle already claimed quests', () => {
        const response = `already`;
        const url = "worker.php?go=collectquest&id=5000";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    });

    it('should handle claiming without enough items', () => {
        const response = ``;
        const url = "worker.php?go=collectquest&id=5000";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    });

    it('should handle unknown quests', () => {
        const response = `success`;
        const url = "worker.php?go=collectquest&id=5001";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(updateInventory).not.toHaveBeenCalled();
    })
});
