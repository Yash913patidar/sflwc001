import { LightningElement } from 'lwc';

export default class ChildHook extends LightningElement {
    displayChild = false;
        constructor() {
        super();
        console.log('Child Constructor');
}

connectedCallback() {
    console.log('Child Connected Callback');
    
}

renderedCallback() {
    console.log('Child Rendered Callback');
    
}

errorcallback(error, stack) {
    console.log('Child Error Callback');
    
}
disconnectedCallback() {
    console.log('Child Disconnected Callback');        
}
changeHandler(event){
    this.displayChild = event.target.checked;
    
}  
}
