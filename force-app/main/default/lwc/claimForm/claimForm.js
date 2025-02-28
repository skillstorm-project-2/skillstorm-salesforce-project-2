import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Case.AccountId';
import CLAIM_TYPE_FIELD from '@salesforce/schema/Case.Claim_Type__c';
import CLAIM_STATUS_FIELD from '@salesforce/schema/Case.Claim_Status__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';


export default class ClaimForm extends LightningElement {
    personAccountId;
    claimId;
    currentStep = '1';
    uploadedFilesList = [];

    // fields for template
    accountIdField = ACCOUNT_ID_FIELD;
    claimTypeField = CLAIM_TYPE_FIELD;
    claimStatusField = CLAIM_STATUS_FIELD;
    descriptionField = DESCRIPTION_FIELD;
    subjectField = SUBJECT_FIELD;
    statusField = STATUS_FIELD;
    originField = ORIGIN_FIELD;



    get isFirstStep() {
        return this.currentStep === '1';
    }

    get isSecondStep() {
        return this.currentStep === '2';
    }

    get isThirdStep() {
        return this.currentStep === '3';
    }

    get isClaimCreated() {
        return this.claimId;
    }

    get attachedFileNames() {
        return this.uploadedFilesList.map(file => file.name).join(', ');
    }

    @wire(getPersonAccountId)
    wiredAccountId({ data, error}) {
        if (data) {
            this.personAccountId = data;
        } else if (error) {
            console.error('Failed to fetch the account for the current user.')
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;

        fields.claimStatusField = 'Under Review';
        fields.statusField = 'New';
        fields.originField = 'Web';

        this.template.querySelector('lightning-record-edit-form').submit(fields);

    }

    // Handler for successful form submission
    handleSuccess(event) {
        this.claimId = event.detail.id;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.apiName + ' created.',
                variant: 'success',
            })
        );

        // increment step
        this.incrementStep();
    }

    handleUpload(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        uploadedFiles.forEach(file => {
            this.uploadedFilesList = [...this.uploadedFilesList, {name: file.name, documentId: file.documentId}];
        });
    }

    handleNext() {
        this.incrementStep();
    }

    incrementStep() {
        let currStep = parseInt(this.currentStep);
        if (currStep < 3) {
            currStep += 1;
            this.currentStep = currStep.toString();
        }
    }

}