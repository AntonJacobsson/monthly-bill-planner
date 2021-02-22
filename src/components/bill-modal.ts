import { DialogController } from 'aurelia-dialog';
import { Bill } from 'models/bill';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { inject, NewInstance, observable, computedFrom } from 'aurelia-framework';
import moment from 'moment';
import { ColorScheme } from 'models/color-scheme';
import { PayPeriodType } from 'models/pay-period-type';

@inject(DialogController, NewInstance.of(ValidationController))
export class BillModal {

  @observable public payPeriod: number;
  @observable public repeatForever: boolean = false;
  @observable public isRecurring: boolean = false;

  public name: string;
  public totalCost: number;
  public startDate: string;
  public endDate: string;
  public notes: string;
  public colorScheme: ColorScheme;
  public paidDates: string[] = [];
  public payPeriodType: number;

  public originalStartDate: string;
  public originalPayPeriodType: number;
  public essentialTabActive: boolean = true;
  public controller: DialogController;
  public bill: Bill;
  public createOrEditTitle: string = '';
  public months = [
    { name: 'months.january', month: 1 },
    { name: 'months.february', month: 2 },
    { name: 'months.march', month: 3 },
    { name: 'months.april', month: 4 },
    { name: 'months.may', month: 5 },
    { name: 'months.june', month: 6 },
    { name: 'months.july', month: 7 },
    { name: 'months.august', month: 8 },
    { name: 'months.september', month: 9 },
    { name: 'months.october', month: 10 },
    { name: 'months.november', month: 11 },
    { name: 'months.december', month: 12 }];

  public payperiodstypes = [
    { name: 'Week', value: PayPeriodType.Week },
    { name: 'Month', value: PayPeriodType.Month }
  ]

  public colorSchemes: ColorScheme[] = [
    { name: 'primary', value: '#ebfffc', displayName: 'color.default' },
    { name: 'info', value: '#eef6fc', displayName: 'color.blue' },
    { name: 'success', value: '#effaf3', displayName: 'color.green' },
    { name: 'warning', value: '#fffbeb', displayName: 'color.yellow' },
    { name: 'danger', value: '#feecf0', displayName: 'color.red' }
  ]

  constructor(controller: DialogController, private _controller: ValidationController) {
    this.controller = controller;

    ValidationRules
      .ensure((m: BillModal) => m.name).required()
      .ensure((m: BillModal) => m.payPeriod).required().min(1).when(x => x.isRecurring === true)
      .ensure((m: BillModal) => m.payPeriodType).required().when(x => x.isRecurring === true)
      .ensure((m: BillModal) => m.totalCost).required()
      .ensure((m: BillModal) => m.startDate).required()
      .ensure((m: BillModal) => m.endDate).required().when(x => x.repeatForever !== true && x.payPeriod !== 0 && x.isRecurring === true)
      .on(this);
  }

  public activate(bill: Bill): void {
    if (bill !== null) {
      this.originalStartDate = bill.startDate;
      this.originalPayPeriodType = bill.payPeriodType
      this.name = bill.name;
      this.payPeriod = bill.payPeriod;
      this.totalCost = bill.totalCost;
      this.startDate = bill.startDate;
      this.endDate = bill.endDate;
      this.colorScheme = this.colorSchemes.find(x => x.name === bill.color);
      this.paidDates = bill.paidDates;
      this.payPeriodType = bill.payPeriodType

      if(bill.payPeriodType === undefined) {
        this.payPeriodType = PayPeriodType.Month;
        this.originalPayPeriodType = PayPeriodType.Month;
      }

      if(this.payPeriod !== 0) {
        this.isRecurring = true;
      }

      if (this.payPeriod !== 0 && this.endDate === undefined) {
        this.repeatForever = true;
      }

      this.notes = (bill.notes !== undefined) ? bill.notes : '';

      this.createOrEditTitle = 'change';
      this.bill = bill;
    } else {
      this.createOrEditTitle = 'create';
      this.bill = new Bill();
      this.payPeriodType = PayPeriodType.Month;
      this.payPeriod = 0;
    }
  }

  @computedFrom('startDate')
  get startDateChangedWithPaidDates(): boolean {
    return (this.createOrEditTitle === 'change' && this.originalStartDate !==  this.startDate &&  this.paidDates !== undefined &&  this.paidDates.length > 0);
  }

  @computedFrom('payPeriodType')
  get payPeriodTypeChangedWithPaidDates(): boolean {
    return (this.createOrEditTitle === 'change' && this.originalPayPeriodType !== undefined && this.originalPayPeriodType !== this.payPeriodType &&  this.paidDates !== undefined &&  this.paidDates.length > 0);
  }

  public async validateOnCreateOrEdit(): Promise<void> {

    const result = await this._controller.validate();

    if(this.payPeriod > 0 && this.payPeriod < 1) {
      return;
    }

    if (result.valid) {
      this.bill.createdDate = (this.bill.createdDate !== null || this.bill.createdDate !== undefined) ? this.bill.createdDate : null;
      this.bill.color = (this.colorScheme !== null || this.colorScheme !== undefined) ? this.colorScheme.name : 'Primary';
      this.bill.endDate = this.endDate,
      this.bill.startDate = this.startDate,
      this.bill.id = (this.bill.id !== null) ? this.bill.id : null,
      this.bill.name = this.name,
      this.bill.payPeriod = this.payPeriod,
      this.bill.totalCost = this.totalCost,
      this.bill.notes = this.notes
      this.bill.paidDates = this.paidDates;
      this.bill.payPeriodType = this.payPeriodType;

      if (this.repeatForever) {
        this.bill.endDate = undefined;
      }

      if (this.isRecurring !== true) {
        this.bill.payPeriod = 0
        this.bill.payPeriodType = PayPeriodType.Month
      }

      if(this.startDateChangedWithPaidDates || this.payPeriodTypeChangedWithPaidDates) {
        this.bill.paidDates = [];
      }

      this.controller.ok(this.bill);
    }
  }
  public setEssentialTabActive(value: boolean): void {
    this.essentialTabActive = (value) ? true : false;
  }
  public payPeriodChanged(newValue: number, oldValue: number): void {

    if (this.payPeriod === 0 || this.repeatForever) {
      this.endDate = undefined;
      return;
    }

    if (this.endDate === undefined || this.endDate === '') {
      this.endDate = moment(this.startDate).add(newValue, 'M').format('YYYY-MM-DD');
    }
  }

  public repeatForeverChanged(newValue: boolean, oldValue: boolean): void {
    if (newValue === true) {
      this.endDate = undefined;
    }
  }

  public isRecurringChanged(newValue: boolean, oldValue: boolean): void {
    if(oldValue !== undefined) {
      if (newValue === true) {
        if(this.payPeriod === undefined || this.payPeriod === 0) {
          this.payPeriod = 1;
        }
      }
    }
  }

  public addMonthsToEndDate(value: number): void {
    this.endDate = moment(this.endDate).add(value, 'M').format('YYYY-MM-DD');
  }
}
