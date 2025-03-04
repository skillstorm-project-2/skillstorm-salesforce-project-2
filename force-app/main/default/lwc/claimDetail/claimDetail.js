import { api, LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import CLAIM_TYPE_FIELD from '@salesforce/schema/Case.Claim_Type__c';
import CLAIM_SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import CLAIM_DESC_FIELD from '@salesforce/schema/Case.Description';

export default class ClaimDetail extends LightningElement {

    @api recordId;
    fields = [
        CLAIM_TYPE_FIELD,
        CLAIM_SUBJECT_FIELD,
        CLAIM_DESC_FIELD
    ];

    @wire(CurrentPageReference)
    getPath(pageRef) {
        if (pageRef) {
            console.log(pageRef);
            this.recordId = pageRef.state.recordId;
        }
    }

}