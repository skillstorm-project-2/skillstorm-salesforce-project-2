import { LightningElement, wire } from 'lwc';

export default class AppealsTable extends LightningElement {

    appeals = []
    error;

    tableRowData = [];
    tableColData = [
        {label: 'Id', fieldName: 'Id', type: 'url'},
        {label: 'Status', fieldName: 'Status', type: 'String'},
    ];

}


