import { describe, it, expect, vi, beforeEach } from 'vitest';

// I've no idea why path is in localhost
vi.mock('../../../src/utils/hud.js', () => ({
    hudItems: [
        {"id":"114","name":"Marlin","image":"http://localhost/img/items/7816.png"},
        {"id":"119","name":"Jellyfish","image":"http://localhost/img/items/7808.png"},
        {"id":"133","name":"Blue Sea Bass","image":"http://localhost/img/items/7818.png"},
        {"id":"134","name":"Stingray","image":"http://localhost/img/items/7831.PNG"},
        {"id":"135","name":"MIAB","image":"http://localhost/img/items/7756.png"},
        {"id":"138","name":"Green Jellyfish","image":"http://localhost/img/items/7787.png"},
        {"id":"139","name":"Skipjack","image":"http://localhost/img/items/7790.png"},
        {"id":"140","name":"Giant Squid","image":"http://localhost/img/items/7726.PNG"},
        {"id":"141","name":"Shrimp","image":"http://localhost/img/items/7844.PNG"},
        {"id":"174","name":"Ruby Fish","image":"http://localhost/img/items/7838.png?1"},
        {"id":"198","name":"Mackerel","image":"http://localhost/img/items/5768.png"},
        {"id":"201","name":"Fluorifish","image":"http://localhost/img/items/5771.png"},
        {"id":"207","name":"Octopus","image":"http://localhost/img/items/8802.png"},
        {"id":"228","name":"Runestone 18","image":"http://localhost/img/items/rs18.png?1"},
        {"id":"466","name":"Goldjack","image":"http://localhost/img/items/goldjack.png?1"},
        {"id":"478","name":"Sea Dragon","image":"http://localhost/img/items/seadragon.png"}
    ]
}));

vi.mock('../../../src/utils/inventory.js', () => ({
  updateInventory: vi.fn(),
  inventoryCache: {
    'net_id': { count: 190 }
  },
  itemNameIdMap: new Map([
    ['Fishing Net', 'net_id']
  ]),
  inventoryLimit: 200
}));

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

describe('Fishing response handler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle single fish caught', () => {
    const response = `<img src='/img/items/7843.png' alt='Flier' class='itemimg' ><br/>Flier<span style='display:none'>
          <div id="fishcnt">6,795</div>
          <div id="fishingpb">70.25</div>
          <div id="staminacnt">69</div>
          <div id="baitcnt">122</div>
        </span>`;
    const url = "worker.php?go=fishcaught&id=2&r=371131&bamt=1&p=308&q=851";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { 'Flier': 1 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  // todo add real example
  it('should handle multiple fish caught', () => {
    const response = `<img src='/img/items/7843.png' alt='Flier' class='itemimg' ><br/>Flier (x3)`;
    const url = "worker.php?go=fishcaught&id=2";

    expect(responseHandler(response, url)).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { 'Flier': 3 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  it('should handle fishing with net', () => {
    const response = `<span style='font-size:11px'>Your net caught</span><br/><br/><span style="font-size:11px"><img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7844.PNG' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/5768.png' style='width:30px;'> <br/><img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/5768.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <br/><img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/7790.png' style='width:30px;'> <img src='/img/items/5771.png' style='width:30px;'> <img src='/img/items/7844.PNG' style='width:30px;'> </span><span style='display:none'>
        <div id="fishingpb">75.32</div>
        <div id="netcnt">189</div>
        <div id="nettyp">Fishing Net</div>
        <div id="fishcnt">6,455</div>
        <div id="netdata" data-img="/img/items/7748.png" data-can-lnl="0"></div>
        </span>`;
    const url = "worker.php?go=castnet&id=8&mult=1";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      {
        'Skipjack': 10,
        'Shrimp': 2,
        'Mackerel': 2,
        'Fluorifish': 1,
        'Fishing Net': -1
      },
      { isAbsolute: false, resolveNames: true }
    );
  });
});