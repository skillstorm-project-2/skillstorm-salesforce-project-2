import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import CLAIM_STATUS_FIELD from '@salesforce/schema/Case.Claim_Status__c';
import CLAIM_TYPE_FIELD from '@salesforce/schema/Case.Claim_Type__c';
import CLAIM_DECISION_STATUS_FIELD from '@salesforce/schema/Case.Decision_Status__c';
import CLAIM_SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import CLAIM_DESC_FIELD from '@salesforce/schema/Case.Description';
import CLAIM_OPENED_TIME_FIELD from '@salesforce/schema/Case.CreatedDate';
import CLAIM_CLOSED_TIME_FIELD from '@salesforce/schema/Case.ClosedDate';
import CLAIM_IS_CLOSED_FIELD from '@salesforce/schema/Case.IsClosed';

/**
 * Don't just import everything, because then users can see what they shouldn't
 */
const CLAIM_FIELDS = [
    CLAIM_STATUS_FIELD,
    CLAIM_TYPE_FIELD,
    CLAIM_DECISION_STATUS_FIELD,
    CLAIM_SUBJECT_FIELD,
    CLAIM_DESC_FIELD,
    CLAIM_OPENED_TIME_FIELD,
    CLAIM_CLOSED_TIME_FIELD,
    CLAIM_IS_CLOSED_FIELD
];

export default class ClaimsTracker extends LightningElement {

    @api recordId;
    @api showHistory;
    
    claimObj;
    errorMessage;
    loading = true;
    fields = Object.values(CLAIM_FIELDS);

    @wire(getRecord, { recordId: '$recordId', fields: CLAIM_FIELDS })
    wiredAccount(result) {
        if (result.data) {
            this.claimObj = result.data;
            this.loading = false;
        } else if (result.error){
            this.errorMessage = result.error.body.message;
        }
    }

    get closedMessage() {
        return 'Claim closed at ' + this.claimObj.fields.ClosedDate.displayValue;
    }

    claimSteps = [
        {
            id: 1,
            value: "Received"
        },
        {
            id: 2,
            value: "Under Review"
        },
        {
            id: 3,
            value: "Evidence Gathering"
        },
        {
            id: 4,
            value: "Decision Made"
        }
    ];
}