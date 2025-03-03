import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';
import CLAIM_LOOKUP_FIELD from '@salesforce/schema/Appeal__c.Claim__c';
import STATUS_FIELD from '@salesforce/schema/Appeal__c.Status__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Appeal__c.Appeal_Description__c';

export default class AppealForm extends LightningElement {
    personAccountId;
    appealId;
    @api currentStep = '1';
    uploadedFilesList = [];

    selectedAppealOption;
    appealTypeOptions = [
        {label: "Submit New Evidence", value: "1"},
        {label: "Request Review by Higher Authority", value: "2"},
        {label: "Request In Person Review Hearing", value: "3"},
    ];

    claimField = CLAIM_LOOKUP_FIELD;
    // statusField = STATUS_FIELD;
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

        const fields = event.detail.fields;
        fields[STATUS_FIELD.fieldApiName] = 'In Review';
        console.log(STATUS_FIELD.fieldApiName);

        // To Do
        // fields.AppealType = this.selectedAppealOption;

        console.log(this.selectedAppealOption);
        console.log(fields);

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