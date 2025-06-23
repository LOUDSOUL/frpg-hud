import { describe, it, expect, vi, beforeEach } from 'vitest';

import { responseHandler, listeners } from '../src/main.js';
import { updateInventory } from '../src/utils/inventory';

// Make all listeners non-passive for testing
listeners.forEach(listener => {
  listener.passive = false;
});

describe('Main responseHandler functionality', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle errors gracefully', () => {
    const response = `<img src='/img/items/7843.png' alt='Flier' class='itemimg' ><br/>Flier<span style='display:none'>
      <div id="fishcnt">6,795</div>
      <div id="fishingpb">70.25</div>
      <div id="staminacnt">69</div>
      <div id="baitcnt">122</div>
    </span>`;
    const url = "worker.php?go=fishcaught&id=2&r=371131&bamt=1&p=308&q=851";
    const type = "ajax";

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Find the worker listener to throw Error inside of it
    const workerListener = listeners.find(l => l.name === "Worker Events");
    const originalCallback = workerListener.callback;
    workerListener.callback = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    expect(responseHandler(response, url, type)).toBe(response);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    workerListener.callback = originalCallback;
  });

  it('should not process unmatched URLs', () => {
    const response = 'Some response';
    const url = 'some-unmatched-url.php';
    
    expect(responseHandler(response, url)).toBe(response);
    expect(updateInventory).not.toHaveBeenCalled();
  });
});