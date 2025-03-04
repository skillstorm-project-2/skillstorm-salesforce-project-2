import { LightningElement, api } from 'lwc';

export default class AppealsTable extends LightningElement {

    @api appeals;
    error;

    tableRowData = [];
    tableColData = [
        {label: 'Name', fieldName: 'Name', type: 'text', hideDefaultActions: 'true'},
        {label: 'Status', fieldName: 'Status', type: 'text', hideDefaultActions: 'true'},
    ];

}