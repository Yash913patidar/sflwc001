import { LightningElement } from 'lwc';

export default class ParentHook extends LightningElement {
    constructor() {
        super();
        console.log('Parent Constructor');
    }
      
connectedCallback() {
    console.log('Parent Connected Callback');
    
}

renderedCallback() {
    console.log('Parent Rendered Callback');
    
}

errorcallback(error, stack) {
    console.log('Parent Error Callback');
    
}
disconnectedCallback() {
    console.log('Parent Disconnected Callback');        
}
}