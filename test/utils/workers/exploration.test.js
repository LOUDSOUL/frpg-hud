import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

vi.mock('../../../src/utils/inventory.js', () => ({
  updateInventory: vi.fn(),
  inventoryCache: {
    'apple_id': { count: 0 },
    'lemonade_id': { count: 5 }
  },
  itemNameIdMap: new Map([
    ['Apple', 'apple_id'],
    ['Lemonade', 'lemonade_id']
  ]),
  inventoryLimit: 200
}));

describe('Exploration response handler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle regular exploration with multiple items', () => {
    const response = `<br/>You continued and used <strong>5x</strong> stamina<br/><img src='/img/items/fern.png' alt='Fern Leaf' style='width:30px;'><img src='/img/items/mushroom.png' alt='Mushroom' style='width:30px;'><span style='display:none'>
                <div id="explorepb">60.76</div>
                <div id="explorestam">16</div>
                <div id="applecnt">128</div>
                <div id="cidercnt">0</div>
                <div id="cidermult"></div>
            </span>`;
    const url = "worker.php?go=explore&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      {
        'Fern Leaf': 1,
        'Mushroom': 1,
        'Apple': 128
      },
      { isAbsolute: false, resolveNames: true, processCraftworks: true }
    );
  });

  it('should handle exploration with no items found, but apple synchronized', () => {
    const response = `It feels humid and warm here.  That must have something to do with the mist.<span style='display:none'>
                <div id="explorepb">60.85</div>
                <div id="explorestam">1</div>
                <div id="applecnt">128</div>
                <div id="cidercnt">0</div>
                <div id="cidermult"></div>
            </span>`;
    const url = "worker.php?go=explore&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      {
        'Apple': 128
      },
      { isAbsolute: false, resolveNames: true, processCraftworks: true }
    );
  });

  it('should handle lemonade exploration', () => {
    const response = `Lemonade helped you find:<br/><strong><img src='/img/items/5759.PNG' alt='Acorn' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5963.png' alt='Blue Feathers' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5759.PNG' alt='Acorn' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/fern.png' alt='Fern Leaf' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/6143.PNG' alt='Wood' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5963.png' alt='Blue Feathers' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5685.png' alt='Sweet Root' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5759.PNG' alt='Acorn' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/mushroom.png' alt='Mushroom' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5963.png' alt='Blue Feathers' style='width:25px;padding:2px;'></strong><br/> <strong><img src='/img/items/fern.png' alt='Fern Leaf' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5992.png' alt='Unpolished Ruby' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5908.png' alt='Straw' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5963.png' alt='Blue Feathers' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/6143.PNG' alt='Wood' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5685.png' alt='Sweet Root' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/fern.png' alt='Fern Leaf' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5759.PNG' alt='Acorn' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/5963.png' alt='Blue Feathers' style='width:25px;padding:2px;'></strong> <strong><img src='/img/items/6143.PNG' alt='Wood' style='width:25px;padding:2px;'></strong><span style='display:none'>
                    <div id="explorepb">69.2</div>
                    <div id="explorestam">0</div>
                    <div id="applecnt">7</div>
                    <div id="lmtyp">Lemonade</div>
                    <div id="lmcnt">4</div>
                </span>`;
    const url = "worker.php?go=drinklm&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      {
        'Acorn': 4,
        'Blue Feathers': 5,
        'Fern Leaf': 3,
        'Wood': 3,
        'Sweet Root': 2,
        'Mushroom': 1,
        'Unpolished Ruby': 1,
        'Straw': 1,
        'Apple': 7,
        'Lemonade': -1
      },
      { isAbsolute: false, resolveNames: true, processCraftworks: true }
    );
  });
});