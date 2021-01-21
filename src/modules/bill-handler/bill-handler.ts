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

    bills.forEach(element => {
      element.nextDueDate = this.formatFromTomDateString(element);
    });

    this.bills = this.sortBills(bills, this.currentPlanning);
  }

  public selectedSortChanged(newValue: string, oldValue: string): void {
    if (oldValue != undefined) {
      this.currentPlanning.sort = newValue;
      this.bills = this.sortBills(this.bills, this.currentPlanning);
    }
  }

  public submit(): void {
    this.dialogService.open({ viewModel: BillModal, model: null, lock: false }).whenClosed((response: { wasCancelled: any; output: Bill; }) => {
      if (!response.wasCancelled) {
        let createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
        createdBill.nextDueDate = this.formatFromTomDateString(createdBill);
        if (this.selectedSort != "") {
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
        bill.nextDueDate = this.formatFromTomDateString(bill);
        if (this.selectedSort != "") {
          this.bills = this.sortBills(this.bills, this.currentPlanning);
        }
      }
    });
  }

  public formatFromTomDateString(bill: Bill): Date {

    let today = moment().startOf('day');
    let start = moment(bill.startDate);

    if (today <= start) {
      return start.toDate()
    }

    if (bill.endDate === undefined && bill.payPeriod > 0) {
      let payPeriod = (bill.payPeriod < 1) ? 1 : bill.payPeriod;
      while (start.isBefore(today)) {
        start.add(payPeriod, 'month');
      }
      return start.toDate();
    }

    let end = (bill.endDate !== null && bill.endDate !== "" && bill.endDate !== undefined) ? moment(bill.endDate) : moment(bill.startDate);
    let payperiod = (bill.payPeriod >= 1) ? bill.payPeriod : 1

    if (today > end) {
      return undefined;
    }

    let billDueDates = [];

    while (start.isSameOrBefore(end)) {
      billDueDates.push(start.format("YYYY-MM-DD"));
      start.add(payperiod, 'month');
    }

    for (let i = 0; i < billDueDates.length; i++) {
      const element = billDueDates[i];
      if (today.toDate() < new Date(element)) {
        return new Date(element);
      }
    }
    return undefined
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

    bills.forEach(element => {
      element.nextDueDate = this.formatFromTomDateString(element);
    });

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
        let orderedBills = [];

        let billsCopy = [...bills];

        let billsWithDates = billsCopy.filter(x => x.nextDueDate !== undefined);

        billsWithDates
          .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
          .forEach(x => orderedBills
            .push(x));

        billsCopy.filter(x => x.nextDueDate === undefined).forEach(x => orderedBills.push(x));
        return orderedBills;
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