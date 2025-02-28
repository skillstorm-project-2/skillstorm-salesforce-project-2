import { createElement } from 'lwc';
import ClaimsTracker from 'c/claimsTracker';
import { getRecord } from 'lightning/uiRecordApi';
import ClosedDate from '@salesforce/schema/Case.ClosedDate';

const mockRecord = require('./data/data.json');
const mockRecordClosed = require('./data/dataClosed.json');

describe('c-claims-tracker', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('Claim record displayed successfully', () => {

        const element = createElement('c-claims-tracker', {
            is: ClaimsTracker
        });

        document.body.appendChild(element);

        getRecord.emit(mockRecord);

        return Promise.resolve().then(() => {
            const root = element.shadowRoot;

            const claimType = root.querySelector('.claim-type');
            const claimStatus = root.querySelector('.claim-status');

            expect(claimType.textContent).toBe("Test Text");
            expect(claimStatus.textContent).toBe("Test Text");
        });
    });

    it('Claim record closed', () => {

        const element = createElement('c-claims-tracker', {
            is: ClaimsTracker
        });

        document.body.appendChild(element);

        getRecord.emit(mockRecordClosed);

        return Promise.resolve().then(() => {
            const root = element.shadowRoot;

            const infoMessage = root.querySelector('lightning-formatted-rich-text');

            expect(infoMessage.value).toBe("Claim closed at Test Text");
        });
    });
});