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
import CLAIM_DECISION_REASON from '@salesforce/schema/Case.Decision_Reason__c';

import CLAIM_INCOME_DETAILS from '@salesforce/schema/Case.Income_Details__c';
import CLAIM_HOUSING_STATUS from '@salesforce/schema/Case.Housing_Status__c';
import CLAIM_SERVICE_START_DATE from '@salesforce/schema/Case.Service_Start_Date__c';
import CLAIM_SERVICE_END_DATE from '@salesforce/schema/Case.Service_End_Date__c';
import CLAIM_DISABILITY_STATUS from '@salesforce/schema/Case.Disability_Status__c';
import CLAIM_CREDIT_SCORE from '@salesforce/schema/Case.Credit_Score__c';
import CLAIM_AGE from '@salesforce/schema/Case.Age__c';
import CLAIM_HEALTH_STATUS from '@salesforce/schema/Case.Current_Health_Status__c';
import CLAIM_TYPE_OF_TRAINING from '@salesforce/schema/Case.Type_of_training_education__c';
import CLAIM_EDUCATION_INSTITUTION from '@salesforce/schema/Case.Education_Training_Institution__c';
import CLAIM_SERVICE_INJURY from '@salesforce/schema/Case.Service_Connected_Injury__c';
import CLAIM_INJURY_DATE from '@salesforce/schema/Case.Date_of_Injury__c';

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
    CLAIM_IS_CLOSED_FIELD,
    CLAIM_DECISION_REASON,
    CLAIM_INCOME_DETAILS,
    CLAIM_HOUSING_STATUS,
    CLAIM_SERVICE_START_DATE,
    CLAIM_SERVICE_END_DATE,
    CLAIM_DISABILITY_STATUS,
    CLAIM_CREDIT_SCORE,
    CLAIM_AGE,
    CLAIM_HEALTH_STATUS,
    CLAIM_TYPE_OF_TRAINING,
    CLAIM_EDUCATION_INSTITUTION,
    CLAIM_SERVICE_INJURY,
    CLAIM_INJURY_DATE
];

export default class ClaimsTracker extends LightningElement {

    @api recordId;
    @api showHistory;
    
    claimObj;
    errorMessage;
    loading = true;
    fields = Object.values(CLAIM_FIELDS);
    recordTypeName;

    @wire(getRecord, { recordId: '$recordId', fields: CLAIM_FIELDS })
    wiredAccount(result) {
        if (result.data) {
            this.claimObj = result.data;
            console.log(this.claimObj);
            this.recordTypeName = this.claimObj.recordTypeInfo.name;
            this.loading = false;
        } else if (result.error){
            this.errorMessage = result.error.body.message;
        }
    }

    get closedMessage() {
        return 'Claim closed at ' + this.claimObj.fields.ClosedDate.displayValue;
    }

    get isDenied() {
        return this.claimObj.fields.Decision_Reason__c.value != null;
    }

    get isPension() {
        return this.recordTypeName === 'Pension';
    }

    get isHousingAssistance() {
        return this.recordTypeName === 'Housing Assistance';
    }

    get isHealthcareBenefits() {
        return this.recordTypeName === 'Healthcare Benefits';
    }

    get isEducationAndTraining() {
        return this.recordTypeName === 'Education & Training';
    }

    get isDisabilityCompensation() {
        return this.recordTypeName === 'Disability Compensation';
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