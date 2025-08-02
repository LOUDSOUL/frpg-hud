import { vi, expect } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up a basic DOM environment for tests with dark_mode enabled
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="dark_mode" style="display:none">1</div></body></html>', {
    url: 'http://localhost',
    contentType: 'text/html',
});

global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;

// Mock innerText which is not properly implemented in JSDOM
Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() {
        return this.textContent;
    },
    set(value) {
        this.textContent = value;
    },
    configurable: true,
});

// Mock GM functions & unsafeWindow (used in userscripts)
global.unsafeWindow = global.window;
global.GM_getValue = vi.fn().mockImplementation((key, defaultValue) => defaultValue);
global.GM_setValue = vi.fn();
global.GM_addStyle = vi.fn();
global.GM_addValueChangeListener = vi.fn();

vi.mock('../src/utils/listeners', () => ({
    setupEventListeners: vi.fn(),
}));

vi.mock('../src/utils/storage', () => ({
    setupStorageListeners: vi.fn(),
}));

vi.mock('../src/utils/production', () => ({
    scheduleProduction: vi.fn(),
}));

vi.mock('../src/utils/inventory', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {},
    itemNameIdMap: new Map(),
}));

expect.extend({
    toLogError(callback) {
        const originalError = console.error;
        const mockError = vi.fn();
        console.error = mockError;

        let errorCaught = null;

        try {
            callback();
        } catch (e) {
            // eslint-disable-next-line no-unused-vars
            errorCaught = e;
        } finally {
            console.error = originalError;
        }

        const called = mockError.mock.calls.length > 0;

        return {
            pass: called,
            message: () =>
                this.isNot
                    ? "Expected function NOT to log to console.error, but it did:\n" + 
                       mockError.mock.calls.map(call => call.join(' ')).join('\n')
                    : "Expected function to log to console.error, but it did not.",
        };
    },
});
