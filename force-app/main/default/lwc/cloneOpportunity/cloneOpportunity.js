import { LightningElement, api } from 'lwc';
import cloneOpportunity from '@salesforce/apex/CloneOpportunityController.cloneOpportunity';
export default class CloneOpportunityQuickAction extends LightningElement {

    @api recordId;

    @api invoke() {
        // This is REQUIRED for actionType="Action"

        if (!this.recordId) {
            console.error('recordId not available');
            return;
        }

        cloneOpportunity({ recordId: this.recordId })
            .then(() => {
                console.log('Cloned successfully');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}