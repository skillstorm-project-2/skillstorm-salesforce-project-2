import { api, LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class ClaimDetail extends LightningElement {

    @api recordId;

    @wire(CurrentPageReference)
    getPath(pageRef) {
        if (pageRef) {
            console.log(pageRef);
            this.recordId = pageRef.state.recordId;
        }
    }

}