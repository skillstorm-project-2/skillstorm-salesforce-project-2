import { LightningElement, wire } from 'lwc';
import getActiveAppeals from '@salesforce/apex/ClaimsController.getActiveAppeals';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';

export default class AppealsTableHomePageWrapper extends LightningElement {

    error;
    activeAppeals = [];
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

    @wire(getActiveAppeals, {accountId: '$personAccountId'})
    wiredActiveAppeals({data, error}) {
        if (data) {
            this.activeAppeals = data.map(appeal => ({
                Id: appeal.Id,
                Name: appeal.Name,
                Status: appeal.Status__c,
                Claim: appeal.Claim__c
            }))
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.error('Error fetching appeals');
        }
    }
}