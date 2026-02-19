import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
export default class RecordPageDemo extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    fieldList = [NAME_FIELD, EMAIL_FIELD, PHONE_FIELD, TITLE_FIELD];
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'Record Updated',
            message: 'The record has been updated successfully.',
            variant: 'success',
        });
        this.dispatchEvent(event);
    }
    navigateToRecordViewRecordPage(event) {
        console.log('Event Detail',event.detail); 
        
       let pageref={
        type:'standard__recordPage',
        attributes:{
            recordId: event.detail.id,
            objectApiName:this.objectApiName,
            actionName:'view'
       } 
};

this[NavigationMixin.Navigate](pageref);
}
}