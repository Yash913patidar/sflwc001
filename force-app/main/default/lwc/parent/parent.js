import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    countValues=0;
    handleDecrement(){
        this.countValues--;
    }
    handleIncrement(){
        this.countValues++;
    }
}