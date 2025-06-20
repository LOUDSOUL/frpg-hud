import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

describe('Item Sell response handler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle selling blue feathers', () => {
    const response = `4432`;
    const url = "worker.php?go=sellitem&id=171&qty=277";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { "171": -277 },
      { isAbsolute: false }
    );
  });
});