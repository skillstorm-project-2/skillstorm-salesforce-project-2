import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';
import CLAIM_LOOKUP_FIELD from '@salesforce/schema/Appeal__c.Claim__c';
import STATUS_FIELD from '@salesforce/schema/Appeal__c.Status__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Appeal__c.Appeal_Description__c';
import SUBMIT_EVIDENCE_FIELD from '@salesforce/schema/Appeal__c.Submit_New_Evidence__c';
import REQUEST_HIGHER_REVIEW from '@salesforce/schema/Appeal__c.Request_for_Higher_Review__c';
import REQUEST_IN_PERSON_FIELD from '@salesforce/schema/Appeal__c.Request_for_In_Person_Hearing__c';


export default class AppealForm extends LightningElement {
    personAccountId;
    appealId;
    @api currentStep = '1';
    uploadedFilesList = [];

    selectedAppealOption; 
    appealTypeOptions = [
        {label: "Submit New Evidence", value: SUBMIT_EVIDENCE_FIELD.fieldApiName},
        {label: "Request Review by Higher Authority", value: REQUEST_HIGHER_REVIEW.fieldApiName},
        {label: "Request In Person Review Hearing", value: REQUEST_IN_PERSON_FIELD.fieldApiName},
    ];

    claimField = CLAIM_LOOKUP_FIELD;
    descriptionField = DESCRIPTION_FIELD;

    get isFirstStep() {
        return this.currentStep === '1';
    }

    get isSecondStep() {
        return this.currentStep === '2';
    }

    get isThirdStep() {
        return this.currentStep === '3';
    }

    get attachedFileNames() {
        return this.uploadedFilesList.map(file => file.name).join(', ');
    }

    get isFileUploadRequired() {
        return this.selectedAppealOption === '1'
    }

    @wire(getPersonAccountId)
    wiredAccountId({ data, error}) {
        if (data) {
            this.personAccountId = data;
        } else if (error) {
            console.error('Failed to fetch the account for the current user.')
        }
    }

    // handle step 1: appeal submission
    handleSubmit(event) {
        event.preventDefault();

        // validate that a radio button was selected
        if (!this.selectedAppealOption) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'You must select a Type of Appeal before continuing.',
                    variant: 'error'
                })
            );
            return;
        }
        const fields = event.detail.fields;

        fields[STATUS_FIELD.fieldApiName] = 'Awaiting Review';
        fields[this.selectedAppealOption] = true;
    
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        // sets the appealId to its id from successful creation
        this.appealId = event.detail.id;

        // increments to step 2
        this.incrementStep();
    }

    handleUpload(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        uploadedFiles.forEach(file => {
            this.uploadedFilesList = [...this.uploadedFilesList, {name: file.name, documentId: file.documentId}];
        });
    }

    handleAppealChange(event) {
        this.selectedAppealOption = event.detail.value;
    }

    // Handler for button on step 2
    handleNext() {
        if (this.isFileUploadRequired && this.uploadedFilesList.length  == 0) {
            // display error message if no files are present and an appeal type that requires additional files is selected
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Files are required for this appeal type',
                    variant: 'error'
                })
            )
        } else {
            this.incrementStep();
        }
    }

    incrementStep() {
        let currStep = parseInt(this.currentStep);
        if (currStep < 3) {
            currStep += 1;
            this.currentStep = currStep.toString();
        }
    }
}