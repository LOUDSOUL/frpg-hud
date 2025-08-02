import fs from 'fs';
import path from 'path';

import { describe, it, expect, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../src/main.js';
import { STORAGE_KEYS } from '../../src/constants.js';
import { setQuests } from '../../src/utils/quests.js';


listeners.forEach(listener => {
    listener.passive = false;
});

describe("Quests filtering functionality", () => {
    beforeEach(() => {
        setQuests({ "7532369": {}, "10": {} });
    });

    it("should filter out quests not currently showing", () => {
        const response = fs.readFileSync(path.join(__dirname, "quests.html"), "utf8");
        const url = "quests.php";
        const type = "ajax";

        let result;
        expect(() => {
            result = responseHandler(response, url, type);
        }).not.toLogError();

        expect(result).toBe(response);
        expect(global.GM_setValue).toBeCalledWith(STORAGE_KEYS.QUESTS, { "7532369": {}, })
    })
});
