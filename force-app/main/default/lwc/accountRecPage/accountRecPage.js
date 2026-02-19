import { LightningElement, track, wire } from 'lwc';
import findContacts from '@salesforce/apex/ContactRelationController.findContacts';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import recordSelectedId from '@salesforce/messageChannel/Counting_Update__c';

const columns = [
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'FirstName', fieldName: 'FirstName', type: 'text' },
    { label: 'LastName', fieldName: 'LastName', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class AccountRecPage extends LightningElement {

    @track columns = columns;
    @track recordId;
    @track contacts = []; // <-- Track contacts properly

    subscription = null;

    @wire(MessageContext)
    messageContext;

    // ---------------- LIFECYCLE ----------------
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    // ---------------- LMS SUBSCRIBE ----------------
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                recordSelectedId,
                (message) => this.handleMessage(message)
            );
        }
    }

    unsubscribeFromMessageChannel() {
        if (this.subscription) {
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }

    // ---------------- MESSAGE HANDLER ----------------
    handleMessage(message) {
        this.recordId = message.recordId; 
        // When recordId changes, refresh contacts
        this.fetchContacts();
    }

    // ---------------- APEX CALL ----------------
    fetchContacts() {
        if (!this.recordId) return;

        findContacts({ accountId: this.recordId })
            .then(result => {
                this.contacts = result;
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
                this.contacts = [];
            });
    }
}
