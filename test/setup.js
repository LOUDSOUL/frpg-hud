import { vi } from 'vitest';
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

vi.mock('../src/utils/inventory', () => ({
    updateInventory: vi.fn(),
    inventoryCache: {},
    itemNameIdMap: new Map(),
}));
