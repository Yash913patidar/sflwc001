import { LightningElement,api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';

export default class RecordViewFormDemo extends LightningElement {

    @api recordId;
    @api objectApiName;

    fieldList = {
         Name: NAME_FIELD,
         Email: EMAIL_FIELD,
         Phone: PHONE_FIELD, 
         Title: TITLE_FIELD
        };

}