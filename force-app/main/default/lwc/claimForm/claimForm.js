import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import CASE_OBJECT from "@salesforce/schema/Case";
import getPersonAccountDetails from '@salesforce/apex/UserUtility.getPersonAccountDetails';

// Fields on all forms
import ACCOUNT_ID_FIELD from '@salesforce/schema/Case.AccountId';
import CLAIM_TYPE_FIELD from '@salesforce/schema/Case.Claim_Type__c';
import CLAIM_STATUS_FIELD from '@salesforce/schema/Case.Claim_Status__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';

// Disability Compensation
import SERVICE_INJURY_FIELD from '@salesforce/schema/Case.Service_Connected_Injury__c';
import INJURY_DATE_FIELD from '@salesforce/schema/Case.Date_of_Injury__c'

// Pension
import INCOME_FIELD from '@salesforce/schema/Case.Income_Details__c';
import AGE_FIELD from '@salesforce/schema/Case.Age__c';
import DISABILITY_FIELD from '@salesforce/schema/Case.Disability_Status__c';
import SERVICE_START_DATE_FIELD from '@salesforce/schema/Case.Service_Start_Date__c';
import SERVICE_END_DATE_FIELD from '@salesforce/schema/Case.Service_End_Date__c'; 

// Healthcare Benefits
import CURRENT_HEALTH_STATUS_FIELD from '@salesforce/schema/Case.Current_Health_Status__c';

// Education & Training
import EDUCATION_TYPE_FIELD from '@salesforce/schema/Case.Type_of_training_education__c';
import EDUCATION_INSTITUTION_FIELD from '@salesforce/schema/Case.Education_Training_Institution__c';

// Housing Assistance
import HOUSING_STATUS_FIELD from '@salesforce/schema/Case.Housing_Status__c';
import CREDIT_SCORE_FIELD from '@salesforce/schema/Case.Credit_Score__c'

export default class ClaimForm extends LightningElement {
    // Read only fields
    personAccountId;
    serviceDateStart;
    serviceDateEnd;
    disabilityRating
    birthDate;
    age;

    // Fields on all claim types
    accountIdField = ACCOUNT_ID_FIELD;
    claimTypeField = CLAIM_TYPE_FIELD;
    claimStatusField = CLAIM_STATUS_FIELD;
    descriptionField = DESCRIPTION_FIELD;
    subjectField = SUBJECT_FIELD;
    statusField = STATUS_FIELD;
    originField = ORIGIN_FIELD;

    claimId;
    claimType;
    recordTypeId;
    recordTypeOptions;      // holds the record type details (label, id) for the combobox
    fieldsByRecordType;     // holds the additional fields that are rendered when the claim type is selected

    currentStep = '1';
    uploadedFilesList = [];

    @wire(getPersonAccountDetails)
    wiredAccountDetails({ data, error}) {
        if (data) {
            // Set the id of the running user
            this.personAccountId = data['Id'];

            // Set person account details to be used for read_only inputs in the form
            this.serviceDateStart = data['Service_Date_Start__c'];
            this.serviceDateEnd = data['Service_Date_End__c'];
            this.disabilityRating = data['Disability_Rating__c']
            this.birthDate = data['PersonBirthdate'];
            
            this.age = Math.floor((new Date() - new Date(this.birthDate).getTime()) / 3.15576e+10)
            
            // initialize fieldsByRecordType obj after read-only fields have been set 
            this.initializeFormFields();

        } else if (error) {
            console.error('Failed to fetch the account for the current user.')
        }
    }
    
    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    getRecordTypeIds({ data, error }) {
        if (data) {
            // Get all recordType info from Case obj. metatdata
            const recordTypeData = data.recordTypeInfos;

            // filter out inactive and 'Master' record types
            // Transform data for combobox options
            this.recordTypeOptions = Object.keys(recordTypeData)
                .filter(recordTypeId => recordTypeData[recordTypeId].available 
                    && !recordTypeData[recordTypeId].master 
                    && recordTypeData[recordTypeId].name !== 'VA Claim'
                )
                .map(recordTypeId => ({
                    label: recordTypeData[recordTypeId].name, // Record Type label
                    value: recordTypeData[recordTypeId].recordTypeId // Record Type Id
                }));
        } else if (error) {
            console.error('Failed to fetch object info for Case');
        }
    }

    // Getters
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

    // populate record type fields during initialization
    get serviceDateFields() {
        return [
            {
                field: SERVICE_START_DATE_FIELD,  // The actual field token
                label: 'Service Start Date',      // Custom label to display
                disabled: true,                   // Make it read-only
                value: this.serviceDateStart,     // Pre-populate value from wire function
            },
            {
                field: SERVICE_END_DATE_FIELD,  
                label: 'Service End Date',      
                disabled: true,                   
                value: this.serviceDateEnd,     
            },
        ]
    }

    get currentFieldsByRecordType() {
        // if no record type has been selected, return empty array
        if (!this.recordTypeId) return [];

        // Find the recordType option based on the Id
        const recordTypeOption = this.recordTypeOptions.find(option => option.value === this.recordTypeId);

        // Get corresponding fields for this record type
        // If no fields are mapped for this record type, return empty array
        return this.fieldsByRecordType[recordTypeOption.label] || [];
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;

        // Set fields that 
        fields[this.claimTypeField.fieldApiName] = this.claimType;
        fields[this.claimStatusField.fieldApiName] = 'Received';
        fields[this.statusField.fieldApiName] = 'New';
        fields[this.originField.fieldApiName] = 'Web';

        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleClaimTypeChange(event) {
        // Set the record type id to combobox value
        this.recordTypeId = event.detail.value;

        const recordTypeOption = this.recordTypeOptions.find(option => option.value === this.recordTypeId);
        this.claimType = recordTypeOption?.label
    }

    // If a claim is successfully created, increment the progress step
    handleSuccess(event) {
        this.claimId = event.detail.id;

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

    // helper functions
    incrementStep() {
        let currStep = parseInt(this.currentStep);
        if (currStep < 3) {
            currStep += 1;
            this.currentStep = currStep.toString();
        }
    }

    initializeFormFields() {
        this.fieldsByRecordType = {
            'Disability Compensation': [
                SERVICE_INJURY_FIELD,
                INJURY_DATE_FIELD
            ],
            'Pension': [
                ...this.serviceDateFields,
                {
                    field: AGE_FIELD,
                    label: 'Age',   
                    disabled: true,                   
                    value: this.age,
                },
                {
                    field: DISABILITY_FIELD,
                    label: 'Disability Rating',     
                    disabled: true,                   
                    value: this.disabilityRating,    
                },
                INCOME_FIELD
                
            ],
            'Healthcare Benefits': [
                ...this.serviceDateFields,
                INCOME_FIELD,
                CURRENT_HEALTH_STATUS_FIELD
            ],
            'Education & Training': [
                ...this.serviceDateFields,
                EDUCATION_TYPE_FIELD,
                EDUCATION_INSTITUTION_FIELD
            ],
            'Housing Assistance': [
                ...this.serviceDateFields,
                {
                    field: DISABILITY_FIELD,
                    label: 'Disability Rating',     
                    disabled: true,                   
                    value: this.disabilityRating,    
                },
                HOUSING_STATUS_FIELD,
                INCOME_FIELD,
                CREDIT_SCORE_FIELD
            ],
        }
    }
    
}