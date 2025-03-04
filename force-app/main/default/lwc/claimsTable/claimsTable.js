import { api, LightningElement } from 'lwc';

export default class ClaimsTable extends LightningElement {
    @api claims;
    @api showClaimType = ClaimType.ALL;

    tableRowData = [];
    tableColData = [
        {label: 'Id', fieldName: 'IdLink', type: 'url', hideDefaultActions: 'true', resizable: 'false', typeAttributes: {
            label: {fieldName: 'Id'},
            target: '_self'
        } },
        {label: 'Type', fieldName: 'Type', type: 'text', hideDefaultActions: 'true', resizable: 'false' },
        {label: 'Status', fieldName: 'Status', type: 'text', hideDefaultActions: 'true', resizable: 'false' },
        {label: 'Date Opened', fieldName: 'Created', type: 'date', hideDefaultActions: 'true', resizable: 'false' }
    ];

    get availableClaims() {
        if (this.showClaimType === 'ACTIVE') {
            return this.claims.filter(claim => claim.Status !== 'Decision Made');
        } else if (this.showClaimType === 'CLOSED') {
            return this.claims.filter(claim => claim.Status === 'Decision Made');
        }

        return this.claims;
    }
}

export const ClaimType = Object.freeze({
    ALL: 'ALL',
    ACTIVE: 'ACTIVE',
    CLOSED: 'CLOSED'
});