import { BillModal } from '../../components/bill-modal';
import { PlanningModal } from '../../components/planning-modal';
import { DialogService } from 'aurelia-dialog';
import { inject, observable } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import { DeletePrompt } from 'components/delete-prompt';
import { LanguageService } from 'services/language-service';
import { BillOrderDictionary, Planning, PlanningRequest } from 'models/planning';
import { I18N } from 'aurelia-i18n';
import * as moment from 'moment';

@inject(DialogService, BillService, LanguageService, I18N)

export class BillHandler {

  @observable public selectedSort: string;

  public bills: Bill[] = [];
  public plannings: Planning[] = [];
  public dialogService: DialogService;
  public currentPlanning: Planning;
  public isReorderMode: boolean = false;


  private _locale: string = '';

  public sorts: any[] = [
    { name: "custom", value: "" },
    { name: "due-date", value: "dueDate" }
  ]

  constructor(dialogService: DialogService, private _billService: BillService, private _languageService: LanguageService, private _i18n: I18N) {
    this.dialogService = dialogService;
  }

  public activate(): void {

    window.scroll({
      top: 0,
      behavior: 'auto'
    });

    this._locale = this._languageService.getLanguage();

    this.plannings = this._billService.getPlannings();
    if (this._billService.currentPlanningId === undefined) {
      this.currentPlanning = this.plannings[0];
    } else {
      this.currentPlanning = this.plannings.find(x => x.key == this._billService.currentPlanningId);
    }

    this.selectedSort = (this.currentPlanning.sort != undefined) ? this.currentPlanning.sort : '';

    let bills = this._billService.getBillsByPlanning(this.currentPlanning);

    this.bills = this.sortBills(bills, this.currentPlanning);
  }

  public selectedSortChanged(newValue: string, oldValue: string): void {
    if(oldValue != undefined) {
      this.currentPlanning.sort = newValue;
      this.bills = this.sortBills(this.bills, this.currentPlanning);
    }

  }

  public submit(): void {
    this.dialogService.open({ viewModel: BillModal, model: null, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        let createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
        if(this.selectedSort != "") {
          this.bills = this.sortBills(this.bills, this.currentPlanning);
        }
      }
    });
  }

  public openDeletePrompt(bill: Bill): void {
    if (this.isReorderMode) { return; }

    navigator.vibrate(50);
    this.dialogService.open({ viewModel: DeletePrompt, model: bill, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this.deleteBill(response.output);
      }
    });
  }

  public deleteBill(bill: Bill): void {
    this._billService.deleteBill(bill);
    this.bills = this.bills.filter(x => x !== bill);
  }

  public edit(bill: Bill): void {
    if (this.isReorderMode) { return; }

    this.dialogService.open({ viewModel: BillModal, model: bill, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        this._billService.updateBill(response.output);
        if(this.selectedSort != "") {
          this.bills = this.sortBills(this.bills, this.currentPlanning);
        }
      }
    });
  }

  public formatFromTomDateString(startDate: string, endDate: string, payPeriod: number): string {

    let today = moment().startOf('day');

    let start = moment(startDate);
    let end = (endDate !== null && endDate !== "" && endDate !== undefined) ? moment(endDate) : moment(startDate);
    let payperiod = (payPeriod >= 1) ? payPeriod : 1

    let options = { year: 'numeric', month: 'short', day: 'numeric' };

    if (today <= start) {
      return start.toDate().toLocaleString(this._locale, options);
    }

    if (today > end) {
      return '';
    }

    let billDueDates = [];

    while (start.isSameOrBefore(end)) {
      billDueDates.push(start.format("YYYY-MM-DD"));
      start.add(payperiod, 'month');
    }

    for (let i = 0; i < billDueDates.length; i++) {
      const element = billDueDates[i];
      if (today.toDate() < new Date(element)) {
        return new Date(element).toLocaleString(this._locale, options);
      }
    }
    return '';
  }

  public addPlanning(): void {
    if (this.isReorderMode) { return; }

    let name = this._i18n.tr("new");

    let planning: PlanningRequest = {
      name: name,
    };
    let result = this._billService.createPlanning(planning);
    this.plannings.push(result);
  }

  public selectPlanning(planning: Planning): void {
    if (this.isReorderMode) { return; }

    this.currentPlanning = planning;

    let bills = this._billService.getBillsByPlanning(this.currentPlanning);

    this.bills = this.sortBills(bills, this.currentPlanning);
  }

  public openReorderMode(): void {
    this.isReorderMode = true;
  }

  public saveReorder(): void {

    if (this.selectedSort === "dueDate") {
      this.currentPlanning.sort = this.selectedSort
      this._billService.updatePlanning(this.currentPlanning);
    } else {
      let billOrderList: BillOrderDictionary[] = [];

      let count = 0;

      this.bills.forEach(element => {
        let billOrder: BillOrderDictionary = { id: element.id, value: count }
        billOrderList.push(billOrder);
        count++;
      });

      this.currentPlanning.billOrder = billOrderList;
      this.currentPlanning.sort = "";
      this._billService.updatePlanning(this.currentPlanning);
    }

    this.isReorderMode = false;
  }

  public reorderBill(bill: Bill, number: number): void {

    this.selectedSort = "";
    this.currentPlanning.sort = "";

    let index = this.bills.findIndex(x => x.id == bill.id);

    if (index === 0 && number === -1) {
      return;
    }

    if (index === (this.bills.length - 1) && number === 1) {
      return;
    }

    this.bills = this.moveItemInArrayFromIndexToIndex(this.bills, index, index + number);
  }

  public editPlanning(planning: Planning): void {
    if (this.isReorderMode) { return; }

    navigator.vibrate(50);
    this.dialogService.open({ viewModel: PlanningModal, model: planning, lock: false }).whenClosed((response: { wasCancelled: any; output: any; }) => {
      if (!response.wasCancelled) {
        if (response.output.name != undefined) {
          this._billService.updatePlanning(response.output);
        } else {
          this._billService.deletePlanning(response.output);
          this.plannings = this._billService.getPlannings();

          if (this.currentPlanning.key == response.output) {
            this.currentPlanning = this.plannings[0];
          }
          this.bills = this._billService.getBillsByPlanning(this.currentPlanning);
        }
      }
    });
  }

  public deactivate(): void {
    this.dialogService.closeAll();
  }

  private sortBills(bills: Bill[], planning: Planning): Bill[] {

    if (planning.sort !== undefined && planning.sort !== "") {

      if (planning.sort = "duedate") {

        let billsWithDate: any[] = []

        bills.forEach(element => {

          let billDueDates = [];

          let startDate = moment(element.startDate);
          let endDate = (element.endDate !== null && element.endDate !== "" && element.endDate !== undefined) ? moment(element.endDate) : moment(startDate);

          let payPeriod = (element.payPeriod >= 1) ? element.payPeriod : 1


          while (startDate.isSameOrBefore(endDate)) {
            billDueDates.push(startDate.format("YYYY-MM-DD"));
            startDate.add(payPeriod, 'month');
          }

          let now = moment().startOf('day').toDate();

          let closest = new Date("2025-01-01");

          billDueDates.forEach((d) => {
            const date = new Date(d);

            if (date >= now && (date < new Date(closest) || date < closest)) {
              closest = d;
            }
          });

          billsWithDate.push({ bill: element, date: moment(closest) });
        });

        billsWithDate = billsWithDate.sort((a, b) => a.date - b.date);
        return billsWithDate.map(a => a.bill);
      }

    };

    //sort by billOrder Custom sort
    if (planning.billOrder !== undefined && planning.billOrder.length > 0) {
      let sortedBills: Bill[] = [];
      let billOrders = planning.billOrder.sort(x => x.value);

      billOrders.forEach(element => {
        let bill = bills.find(x => x.id === element.id);
        if (bill != undefined) {
          sortedBills.push(bill);
          bills = bills.filter(x => x.id !== bill.id)
        }
      });

      bills.forEach(element => {
        sortedBills.push(element);
      });

      return sortedBills;
    }

    return bills;
  }


  private moveItemInArrayFromIndexToIndex(array, fromIndex, toIndex): any {
    if (fromIndex === toIndex) return array;

    const newArray = [...array];

    const target = newArray[fromIndex];
    const inc = toIndex < fromIndex ? -1 : 1;

    for (let i = fromIndex; i !== toIndex; i += inc) {
      newArray[i] = newArray[i + inc];
    }

    newArray[toIndex] = target;

    return newArray;
  };
}