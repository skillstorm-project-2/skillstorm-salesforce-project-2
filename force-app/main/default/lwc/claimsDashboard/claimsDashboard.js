import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ClaimsDashboard extends NavigationMixin(LightningElement) {

    handleCreateClaim() {
        this[NavigationMixin.Navigate]({
            type:'standard__webPage',
            attributes: {
                url: '/claims/create-claim'
            }
        })
    }
}
