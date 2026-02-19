import { LightningElement, track, wire } from 'lwc';
import findAccounts from '@salesforce/apex/ContactRelationController.findAccounts';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelectedId from '@salesforce/messageChannel/Counting_Update__c';
// Messaging channel file name 

const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' }
];

export default class NewAccConFatch extends LightningElement {

    @track searchKey;
    @track accounts = [];
    error;

    columns = columns;

    @wire(MessageContext)
    messageContext;

    // ---------------- SEARCH INPUT ----------------
    handleChange(event) {
        this.searchKey = event.target.value;
        console.log('Search input changed:', this.searchKey);
    }

    // ---------------- APEX CALL ----------------
    @wire(findAccounts, { searchKey: '$searchKey' })
    wiredAccounts({ data, error }) {
        console.log('wiredAccounts called');

        if (data) {
            console.log('Accounts received from Apex');
            console.log('Accounts data:', data);

            this.accounts = data;
        } else if (error) {
            console.log('Error while fetching accounts');
            console.error(error);

            this.error = error;
        }
    }

    // ---------------- ROW CLICK / MESSAGE PUBLISH ----------------
   handleRowSelection(event) {
    console.log('Row selection fired');

    const selectedRows = event.detail.selectedRows;
    console.log('Selected rows:', selectedRows);

    if (selectedRows.length > 0) {
        const selectedRow = selectedRows[0];
       console.log('Selected 57 row data:', selectedRow.Id); 
        const payload = { recordId: selectedRow.Id };
        console.log('Publishing message with payload:', payload);

        publish(this.messageContext, recordSelectedId, payload);
    }
}
}