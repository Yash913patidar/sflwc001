import { LightningElement, api } from 'lwc';

export default class LightningDataService extends LightningElement {
    @api recordId;
    @api objectApiName;
}