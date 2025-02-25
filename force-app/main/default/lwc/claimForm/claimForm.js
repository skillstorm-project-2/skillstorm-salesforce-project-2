import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ClaimForm extends LightningElement {

    userAccountId;

    // @wire(getRecord, { recordId: USER_ID, fields: [ACCOUNT_ID] })
    // wiredUser({ error, data }) {
    //     if (data) {
    //         console.log(data);
    //         this.userAccountId = data.fields.AccountId.value;
    //     } else if (error) {
    //         console.error('Error fetching user Account ID:', error);
    //     }
    // }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;

        fields.Claim_Status__c = 'Under Review';
        fields.Status = 'New';
        fields.Origin = 'Web';

        this.template.querySelector('lightning-record-edit-form').submit(fields);

    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.apiName + ' created.',
                variant: 'success',
            })
        );
    }

}