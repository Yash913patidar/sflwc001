import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ContactList extends LightningElement {
    @wire(getContactList)
    contacts;

    selectedContact;

    handleContactSelected(event) {
        const contactId = event.detail;
        console.log('Selected Contact Id:', contactId);

        this.selectedContact = this.contacts.data.find(
            contact => contact.Id === contactId
        );

        console.log('Selected Contact:', this.selectedContact);
    }
}
