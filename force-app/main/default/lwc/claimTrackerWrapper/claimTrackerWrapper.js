import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class ClaimTrackerWrapper extends LightningElement {
    @api recordId;

    @wire(CurrentPageReference)
    getPath(pageRef) {
        if (pageRef) {
            this.recordId = pageRef.state.recordId;
        }
    }
}