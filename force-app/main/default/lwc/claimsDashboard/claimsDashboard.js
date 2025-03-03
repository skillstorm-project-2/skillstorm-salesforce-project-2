import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import CURRENT_USER_ID from '@salesforce/user/Id';
import getPersonAccountId from '@salesforce/apex/UserUtility.getPersonAccountId';
import getClaims from '@salesforce/apex/ClaimsController.getClaims';

export default class ClaimsDashboard extends NavigationMixin(LightningElement) {

    userId = CURRENT_USER_ID;
    error;
    claims;
    personAccountId;
    showingClaimType = 'ALL';

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

    handleCreateClaim() {
        this[NavigationMixin.Navigate]({
            type:'standard__webPage',
            attributes: {
                url: '/claims/create-claim'
            }
        })
    }

    handlePDF() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/apex/VfAppeals' 
            }
        });
    }

    handleFilterClaims(event) {
        this.showingClaimType = event.detail;
    }
}
