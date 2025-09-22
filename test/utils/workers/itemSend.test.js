import { describe, it, expect, beforeEach, vi } from 'vitest';
import itemSendWorkers from '../../../src/utils/workers/itemSend';
import { updateInventory } from '../../../src/utils/inventory';

vi.mock('../../../src/utils/inventory', () => ({
    updateInventory: vi.fn(),
}));

describe('itemSendWorkers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle HTML response format', () => {
        const htmlResponse = `
                    <span style='display:none'>
                        <div id="wk__in_mailbox">21,734</div>
                    </span>
                    `;
        const parameters = new URLSearchParams('id=303&to=38&qty=17');
        const worker = itemSendWorkers.find(w => w.action === 'givemailitem');
        
        worker.listener(htmlResponse, parameters);

        expect(updateInventory).toHaveBeenCalledWith(
            { '303': -17 },
            { isAbsolute: false }
        );
    });

    it('should not process failed response', () => {
        const parameters = new URLSearchParams('id=303&to=38&qty=17');
        const worker = itemSendWorkers.find(w => w.action === 'givemailitem');
        
        worker.listener('error', parameters);

        expect(updateInventory).not.toHaveBeenCalled();
    });
});