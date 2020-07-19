import {DialogController} from 'aurelia-dialog';
import {inject } from 'aurelia-framework';
import { Bill } from 'models/bill';

@inject(DialogController)
export class DeletePrompt {
    public controller: DialogController;
    public bill: Bill;

    constructor(controller: DialogController){
      this.controller = controller;     
    }

    activate(bill: Bill){
        console.log(bill);
          this.bill = bill;
    }

}