import {DialogController} from 'aurelia-dialog';
import {inject } from 'aurelia-framework';
import { Bill } from 'models/bill';
import './bill-modal.scss';

@inject(DialogController)
export class BillModal {
  public controller: DialogController;
  public bill: Bill;
  public createOrEditTitle: string = "";
  public months = [ 
    {name: "months.january", month: 1},
    {name: "months.february", month: 2},
    {name: "months.march", month: 3},
    {name: "months.april", month: 4},
    {name: "months.may", month: 5},
    {name: "months.june", month: 6},
    {name: "months.july", month: 7},
    {name: "months.august", month: 8},
    {name: "months.september", month: 9},
    {name: "months.october",  month: 10},
    {name: "months.november", month: 11},
    {name: "months.december", month: 12}];

  public payperiods = [
    {name: "payperiod.never", value: 0},
    {name: "payperiod.every1month", value: 1},
    {name: "payperiod.every2month", value: 2},
    {name: "payperiod.every3month", value: 3},
    {name: "payperiod.every6month", value: 6},
    {name: "payperiod.every12month", value: 12},
  ]
  
  constructor(controller: DialogController){
    this.controller = controller;
  }
  activate(bill: Bill){

    if(bill !== null) {
      this.createOrEditTitle = "change";
    } else {
      this.createOrEditTitle = "create";
    }

    this.bill = bill;
  }
}


