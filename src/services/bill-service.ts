import { Bill } from "models/bill";
import { cloneDeep } from 'lodash';
import { Guid } from "guid-typescript";
import { Planning, PlanningRequest } from "models/planning";
import { I18N } from "aurelia-i18n";
import { inject } from 'aurelia-framework';

@inject(I18N)
export class BillService {

  public plannings: Planning[] = [];
  public bills: Bill[] = []
  public currentPlanningId: number;

  constructor(private _i18n: I18N) {

    let plannings = this.getPlanningsFromLocalStorage();
    if (plannings !== null) {
      this.plannings = plannings;
    }
  }

  public getBillsFromLocalStorage(key: string): any {
    let data = localStorage.getItem(key);
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch {
        localStorage.clear();
      }
    }
    return null
  }

  public getPlanningsFromLocalStorage(): any {
    let data = localStorage.getItem('plannings');
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch {
        localStorage.clear();
      }
    } else {
      let name = this._i18n.tr("my-bills");

      let plannings: Planning[] = [
        { name: name, key: 0, billOrder: [], sort: '' }
      ]
      localStorage.setItem('plannings', JSON.stringify(plannings));
      return plannings;
    }
    return null
  }

  public getBills(): Bill[] {
    return cloneDeep(this.bills);
  }

  public getBillsByPlanning(planning: Planning): Bill[] {

    if (this.currentPlanningId != planning.key) {

      let response = (planning.key == 0) ? this.getBillsFromLocalStorage("bills") : this.getBillsFromLocalStorage("bills" + planning.key);

      if (response !== null) {
        this.bills = response;
      } else {
        this.bills = [];
      }
    }
    this.currentPlanningId = planning.key;
    return cloneDeep(this.bills);
  }

  public getPlannings(): Planning[] {
    return cloneDeep(this.plannings);
  }


  public createBill(bill: Bill) : Bill {
    bill.id = Guid.raw();
    bill.createdDate = new Date().toISOString();
    this.bills.push(bill);

    if (this.currentPlanningId === 0) {
      this.updateLocalStorage("bills", this.bills);
    } else {
      this.updateLocalStorage("bills" + this.currentPlanningId, this.bills);
    }
    return bill;
  }

  public deleteBill(bill: Bill): void {
    this.bills = this.bills.filter(x => x.id !== bill.id)
    if (this.currentPlanningId === 0) {
      this.updateLocalStorage("bills", this.bills);
    } else {
      this.updateLocalStorage("bills" + this.currentPlanningId, this.bills);
    }

  }

  public updateBill(bill: Bill): void {

    let billToUpdate = this.bills.find(x => x.id === bill.id);
    billToUpdate.name = bill.name;
    billToUpdate.payPeriod = bill.payPeriod;
    billToUpdate.totalCost = bill.totalCost;
    billToUpdate.startDate = bill.startDate;
    billToUpdate.endDate = bill.endDate;
    billToUpdate.notes = bill.notes;
    billToUpdate.color = bill.color;

    if (this.currentPlanningId === 0) {
      this.updateLocalStorage("bills", this.bills);
    } else {
      this.updateLocalStorage("bills" + this.currentPlanningId, this.bills);
    }
  }

  public updateLocalStorage(key: string, data: any): void {
    localStorage.removeItem(key)
    localStorage.setItem(key, JSON.stringify(data));
  }

  public createPlanning(planningRequest: PlanningRequest): Planning {
    let key = this.plannings.map(x => x.key).sort((y, z) => y - z).reverse().shift() + 1

    let planning: Planning = {
      name: planningRequest.name,
      key: key,
      billOrder: [],
      sort: ''
    }
    this.plannings.push(planning);

    this.updateLocalStorage("plannings", this.plannings);
    return planning;
  }

  public updatePlanning(planning: Planning): void {

    let planningToUpdate = this.plannings.find(x => x.key === planning.key);
    planningToUpdate.name = planning.name;
    planningToUpdate.billOrder = planning.billOrder;
    planningToUpdate.sort = (planning.sort != undefined) ? planning.sort : ""

    this.updateLocalStorage("plannings", this.plannings);
  }

  public deletePlanning(key: number): void {
    this.plannings = this.plannings.filter(x => x.key !== key);
    this.updateLocalStorage("plannings", this.plannings);
    if(key != 0) {
      localStorage.removeItem("bills" + key);
    } else {
      localStorage.removeItem("bills");
    }
  }

}