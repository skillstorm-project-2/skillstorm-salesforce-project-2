import { LightningElement, wire } from 'lwc';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';
import getClaims from '@salesforce/apex/ClaimsController.getClaims';

export default class ClaimsTableHomePageWrapper extends LightningElement {

    error;
    claims;
    personAccountId;
    showingClaimType = 'ACTIVE';

    @wire(getPersonAccountId)
    wiredAccountId({ data, error }) {
        if (data) {
            this.personAccountId = data;
        } else if (error) {
            console.error('err: ' + error);
            this.error = error;
        }
    }

    @wire(getClaims, {accountId: '$personAccountId'})
    wiredClaims(result) {
        if (result.data) {
            this.claims = result.data.map(claim => ({
                Id:  claim.Id,
                CaseNumber: claim.CaseNumber,
                IdLink: `/claims/claim-detail?recordId=${claim.Id}`,
                Type: claim.Claim_Type__c,
                Status: claim.Claim_Status__c,
                Created: claim.CreatedDate,
            }))
            
        } else {
            this.error = result.error;
            this.claims = [];
            console.error(result.error);
        }
    }
}