import { LightningElement,api } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACCOUNT_DATE_FIELD from '@salesforce/schema/Account.SLAExpirationDate__c';
import {NavigationMixin} from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordEditFormDemo extends NavigationMixin(LightningElement) {

    @api recordID;
    @api objectApiName;

    fields = {
           name:ACCOUNT_NAME_FIELD,
           industry:ACCOUNT_INDUSTRY_FIELD,
           sladate:ACCOUNT_DATE_FIELD
};
   successHandler(event){
        const toastEvent = new ShowToastEvent({
            title: "Record Created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: this.objectApiName,
                actionName: 'view'
            }
        });
    }
    errorHandler(event){
        const toastEvent2= new ShowToastEvent({
            
            title: "Error",
            message: "Record Creation Failed, Error: " + event.detail.message,
            variant: "error"
        });
        this.dispatchEvent(toastEvent2);
    }
    
    submitHandler(event){
        event.preventDefault();
         console.log('Event Detail',event.detail);
        const fields = event.detail.fields;
        if(!fields.Industry){ 
            fields.Industry = "Energy";
        }
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    resetHandler(){
      let inputFields = this.template.querySelectorAll('lightning-input-field');
      inputFields.forEach((currItem)=>currItem.reset());
      
      
    }

}