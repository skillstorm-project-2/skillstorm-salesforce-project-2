import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
// import SSN_FIELD from '@salesforce/schema/Account.SSN__pc';
import MILITARY_BRANCH_FIELD from '@salesforce/schema/Account.Military_Branch__c';
import SERVICE_DATE_START_FIELD from '@salesforce/schema/Account.Service_Date_Start__c';
import SERVICE_DATE_END_FIELD from '@salesforce/schema/Account.Service_Date_End__c';
import DISCHARGE_STATUS_FIELD from '@salesforce/schema/Account.Discharge_Status__c';
import DISABILITY_RATING_FIELD from '@salesforce/schema/Account.Disability_Rating__c';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';

export default class ProfilePage extends LightningElement {

    name = NAME_FIELD;
    email = EMAIL_FIELD;
    phone = PHONE_FIELD;
    // ssn = SSN_FIELD;
    militaryBranch = MILITARY_BRANCH_FIELD;
    serviceDateStart = SERVICE_DATE_START_FIELD;
    serviceDateEnd = SERVICE_DATE_END_FIELD;
    dischargeStatus = DISCHARGE_STATUS_FIELD;
    disabilityRating = DISABILITY_RATING_FIELD;

    personAccountId;

    @wire(getPersonAccountId)
    wiredAccountId({ data, error }) {
        if (data) {
            this.personAccountId = data;
        } else if (error) {
            console.error('err: ' + error);
            this.error = error;
        }
    }

    handleSuccess(event) {

        // Handle successful save
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Profile updated successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }


    handleError(event) {

        // Handle error
        const toastEvent = new ShowToastEvent({
            title: 'Error',
            message: 'Error updating profile',
            variant: 'error'
        });
        this.dispatchEvent(toastEvent);
    }

}