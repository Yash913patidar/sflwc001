import { LightningElement,api,wire } from 'lwc';
import CONTACT_NAME from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL from '@salesforce/schema/Contact.Email';
import { getRecord } from 'lightning/uiRecordApi';
export default class GetRecordDemo extends LightningElement {
    @api recordId;
    @wire(getRecord, {
        recordId: "$recordId",
         fields : [CONTACT_NAME,CONTACT_LASTNAME, CONTACT_EMAIL]})
    outputFunction({error,data}){

        if(data){
            console.log('data',data);
        }
        if(error){
            console.log('error',error);
        }
    }
}