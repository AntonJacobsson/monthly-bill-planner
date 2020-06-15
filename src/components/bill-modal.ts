import {DialogController} from 'aurelia-dialog';
import {inject } from 'aurelia-framework';
import { Bill } from 'models/bill';

@inject(DialogController)
export class BillModal {
  public controller: DialogController;
  public bill: Bill;
  public createOrEditTitle: string = "";
  
  constructor(controller: DialogController){
    this.controller = controller;
  }
  activate(bill: Bill){

    if(bill !== null) {
      this.createOrEditTitle = "Ändra";
    } else {
      this.createOrEditTitle = "Skapa";
    }

    this.bill = bill;
  }
}


