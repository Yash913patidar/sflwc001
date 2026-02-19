import { LightningElement, api } from 'lwc';

export default class ContactItem extends LightningElement {
    @api contact;

    clickHandler(event) {
        event.preventDefault();

        this.dispatchEvent(
            new CustomEvent('selected', {
                detail: this.contact.Id
            })
        );
    }
}
