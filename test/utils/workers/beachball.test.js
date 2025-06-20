import { describe, it, expect, vi, beforeEach } from 'vitest';
import { responseHandler, listeners } from '../../../src/main.js';
import { updateInventory } from '../../../src/utils/inventory.js';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

describe('Beachball response handler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle beachball response with Apple Cider reward', () => {
    const response = `{"result":"<img src='\\/img\\/items\\/8984.png' class='itemimg'> x23<br\\/>As you're whacking the ball you see a lucky <strong>Apple Cider<\\/strong> and grab it.<br\\/><br\\/>The ball flies towards <strong><a href=\"profile.php?user_name=Vaperrr94\">Vaperrr94<\\/a><\\/strong>."}`;
    const url = "worker.php?go=beachball";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { 'Apple Cider': 23 },
      { isAbsolute: false, resolveNames: true }
    );
  });

  it('should handle beachball response with Orange Juice reward', () => {
    const response = `{"result":"<img src='\\/img\\/items\\/orangejuice.png' class='itemimg'> x20<br\\/>As you're spiking the ball you see a shiny <strong>Orange Juice<\\/strong> and pick it up.<br\\/><br\\/>The ball bounces towards <strong><a href=\"profile.php?user_name=Kramers\">Kramers<\\/a><\\/strong>."}`;
    const url = "worker.php?go=beachball";
    const type = "ajax";

    const result = responseHandler(response, url, type);

    expect(result).toBe(response);
    expect(updateInventory).toHaveBeenCalledWith(
      { 'Orange Juice': 20 },
      { isAbsolute: false, resolveNames: true }
    );
  });
});