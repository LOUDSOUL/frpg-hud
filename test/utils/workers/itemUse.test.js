import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

describe('Item Use response handler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle eating an apple', () => {
    const response = `<img src='/img/items/8297.png' style='width:40px'><br/>You ate an apple and regained some stamina!`;
    const url = "worker.php?go=eatapple&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { Apple: -1 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  it('should handle eating multiple apples', () => {
    const response = `<img src='/img/items/8297.png' style='width:40px'><br/>You ate 10 apples and regained stamina!`;
    const url = "worker.php?go=eatxapples&amt=10&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { Apple: -10 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  it('should handle drinking orange juice', () => {
    const response = `<img src='/img/items/orangejuice.png' style='width:40px'><br/>You drank orange juice and got 100 stamina!`;
    const url = "worker.php?go=drinkoj&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { "Orange Juice": -1 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  it('should handle drinking multiple orange juices', () => {
    const response = `<img src='/img/items/orangejuice.png' style='width:40px'><br/>You drank 10 orange juices and got 1,000 stamina!`;
    const url = "worker.php?go=drinkxojs&amt=10&id=5";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { "Orange Juice": -10 },
      { isAbsolute: false, resolveNames: true }
    );
  });
});