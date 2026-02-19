import { LightningElement } from 'lwc';

export default class Child extends LightningElement {
    handleSubstract() {
        this.dispatchEvent(new CustomEvent('substract'));
 
    }
    handleAdd(){
        this.dispatchEvent(new CustomEvent('add'));
    }
}