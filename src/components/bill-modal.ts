import {DialogController} from 'aurelia-dialog';
import {inject } from 'aurelia-framework';
import { Bill } from 'models/bill';
import {NewInstance} from 'aurelia-framework';
import {ValidationRules, ValidationController} from "aurelia-validation";
import { observable } from 'aurelia-framework';
import * as moment from 'moment'

@inject(DialogController, NewInstance.of(ValidationController))
export class BillModal {

  @observable public payPeriod: number;
  public name: string;
  public totalCost: number;
  public startDate: string;
  public endDate: string;
  public notes: string;
  public colorScheme: any;

  public essentialTabActive: boolean = true;
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
    {name: "payperiod.every1week", value: 0.25},
    {name: "payperiod.every2week", value: 0.5},
    {name: "payperiod.every1month", value: 1},
    {name: "payperiod.every2month", value: 2},
    {name: "payperiod.every3month", value: 3},
    {name: "payperiod.every6month", value: 6},
    {name: "payperiod.every12month", value: 12},
  ]

  public colorSchemes = [
    {name: "primary", value: "#ebfffc", displayName: "color.default"},
    {name: "info", value: "#eef6fc", displayName: "color.blue"},
    {name: "success", value: "#effaf3", displayName: "color.green"},
    {name: "warning", value: "#fffbeb", displayName: "color.yellow"},
    {name: "danger", value: "#feecf0", displayName: "color.red"},
  ]

  constructor(controller: DialogController, private _controller: ValidationController){
    this.controller = controller;

    ValidationRules
      .ensure((m: BillModal) => m.name).required()
      .ensure((m: BillModal) => m.payPeriod).required()
      .ensure((m: BillModal) => m.totalCost).required()
      .ensure((m: BillModal) => m.startDate).required()
      .ensure((m: BillModal) => m.endDate).required().when(x => x.payPeriod !== 0)
      .on(this);
  }

  public activate(bill: Bill): void {
    if(bill !== null) {
      this.name = bill.name;
      this.payPeriod = bill.payPeriod;
      this.totalCost = bill.totalCost;
      this.startDate = bill.startDate;
      this.endDate = bill.endDate;
      this.colorScheme = this.colorSchemes.find(x => x.name == bill.color);

      if (bill.notes !== undefined) {
        this.notes = bill.notes;
      } else {
        this.notes = "";
      }

      this.createOrEditTitle = "change";
      this.bill = bill;
    } else {
      this.createOrEditTitle = "create";
      this.bill = new Bill();
    }
  }


  public async validateOnCreateOrEdit(): Promise<void> {

    let result = await this._controller.validate();

    if(result.valid) {
        this.bill.createdDate = (this.bill.createdDate !== null || this.bill.createdDate !== undefined) ? this.bill.createdDate : null;
        this.bill.color = (this.colorScheme !== null || this.colorScheme !== undefined) ? this.colorScheme.name : "Primary";
        this.bill.endDate = this.endDate,
        this.bill.startDate = this.startDate,
        this.bill.id = (this.bill.id !== null) ? this.bill.id : null,
        this.bill.name = this.name,
        this.bill.payPeriod = this.payPeriod,
        this.bill.totalCost = this.totalCost,
        this.bill.notes = this.notes,

        this.controller.ok(this.bill);
      }
  }
  public setEssentialTabActive(value: boolean): void {
    if(value) {
      this.essentialTabActive = true;
    } else {
      this.essentialTabActive = false;
    }
  }
  public payPeriodChanged(newValue, oldValue): void {

    if(this.payPeriod === 0) {
      this.endDate = undefined;
      return;
    }

    if(this.endDate === undefined || this.endDate === '') {
      this.endDate = moment(this.startDate).add(newValue, "M").format("YYYY-MM-DD");
    }
  }

  public addMonthsToEndDate(value: number): void {
    this.endDate = moment(this.endDate).add(value, 'M').format("YYYY-MM-DD");
  }
}


