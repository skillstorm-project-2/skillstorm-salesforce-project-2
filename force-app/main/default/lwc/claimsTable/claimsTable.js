import { api, LightningElement } from 'lwc';

export default class ClaimsTable extends LightningElement {
    @api claims;

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
}


