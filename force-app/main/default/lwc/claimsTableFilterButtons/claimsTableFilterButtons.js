import { LightningElement } from 'lwc';

export default class ClaimsTableFilterButtons extends LightningElement {
 
    showingClaimType = 'ALL';

    handleFilterAll() {
        const event = new CustomEvent('filterclaims', {
            detail: 'ALL'
        });

        this.dispatchEvent(event);
        this.showingClaimType = 'ALL';
    }

    handleFilterActive() {
        const event = new CustomEvent('filterclaims', {
            detail: 'ACTIVE'
        });

        this.dispatchEvent(event);
        this.showingClaimType = 'ACTIVE';
    }

    handleFilterClosed() {
        const event = new CustomEvent('filterclaims', {
            detail: 'CLOSED'
        });

        this.dispatchEvent(event);
        this.showingClaimType = 'CLOSED';
    }

    get isShowingAll() { return this.showingClaimType === 'ALL'; }
    get isShowingActive() { return this.showingClaimType === 'ACTIVE'; }
    get isShowingClosed() { return this.showingClaimType === 'CLOSED'; }
}