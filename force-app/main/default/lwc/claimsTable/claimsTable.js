import getClaims from '@salesforce/apex/ClaimsController.getClaims';
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';

export default class ClaimsTable extends LightningElement {

    claims = []
    error;

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


    fieldNames = ['Id', 'Claim_Type__c', 'Claim_Status__c', 'CreatedDate'];

    @wire(getClaims, {fieldNames: '$fieldNames'})
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

    refreshTable() {
        refreshApex(this.wiredClaims);
    }
    
}


