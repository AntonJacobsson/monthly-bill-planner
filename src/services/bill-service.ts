import { Bill } from 'models/bill';
import { cloneDeep } from 'lodash';
import { Guid } from 'guid-typescript';
import { Planning, PlanningRequest } from 'models/planning';
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';

@inject(I18N)
export class BillService {

  public plannings: Planning[] = [];
  public bills: Bill[] = []
  public currentPlanningId: number;

  constructor(private _i18n: I18N) {

    const plannings = this.getPlanningsFromLocalStorage();
    if (plannings !== null) {
      this.plannings = plannings;
    }
  }

  public getBillsFromLocalStorage(key: string): Bill[] {
    const data = localStorage.getItem(key);
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch {
        localStorage.clear();
      }
    }
    return null
  }

  public getPlanningsFromLocalStorage(): Planning[] {
    const data = localStorage.getItem('plannings');
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch {
        localStorage.clear();
      }
    } else {
      const name = this._i18n.tr('my-bills');

      const plannings: Planning[] = [
        { name, key: 0, billOrder: [], sort: '' }
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

    if (this.currentPlanningId !== planning.key) {

      const response = (planning.key === 0) ? this.getBillsFromLocalStorage('bills') : this.getBillsFromLocalStorage('bills' + planning.key);

      this.bills = (response !== null) ? response : [];

    }
    this.currentPlanningId = planning.key;
    return cloneDeep(this.bills);
  }

  public getPlannings(): Planning[] {
    return cloneDeep(this.plannings);
  }

  public createBill(bill: Bill): Bill {
    bill.id = Guid.raw();
    bill.createdDate = new Date().toISOString();
    bill.paidDates = [];
    bill.nextDueDate = undefined;
    bill.dueDates = undefined;
    this.bills.push(bill);

    if (this.currentPlanningId === 0) {
      this.updateLocalStorage('bills', this.bills);
    } else {
      this.updateLocalStorage('bills' + this.currentPlanningId, this.bills);
    }
    return bill;
  }

  public deleteBill(bill: Bill): void {
    this.bills = this.bills.filter(x => x.id !== bill.id)
    if (this.currentPlanningId === 0) {
      this.updateLocalStorage('bills', this.bills);
    } else {
      this.updateLocalStorage('bills' + this.currentPlanningId, this.bills);
    }

  }

  public updateBill(bill: Bill): void {

    const billToUpdate = this.bills.find(x => x.id === bill.id);
    billToUpdate.name = bill.name;
    billToUpdate.payPeriod = bill.payPeriod;
    billToUpdate.totalCost = bill.totalCost;
    billToUpdate.startDate = bill.startDate;
    billToUpdate.endDate = bill.endDate;
    billToUpdate.notes = bill.notes;
    billToUpdate.color = bill.color;
    billToUpdate.paidDates = bill.paidDates;
    billToUpdate.payPeriodType = bill.payPeriodType;

    if (this.currentPlanningId === 0) {
      this.updateLocalStorage('bills', this.bills);
    } else {
      this.updateLocalStorage('bills' + this.currentPlanningId, this.bills);
    }
  }

  public updateBills(bills: Bill[]): void {

    bills.forEach(element => {

      const billToUpdate = this.bills.find(x => x.id === element.id);

      billToUpdate.name = element.name;
      billToUpdate.payPeriod = element.payPeriod;
      billToUpdate.totalCost = element.totalCost;
      billToUpdate.startDate = element.startDate;
      billToUpdate.endDate = element.endDate;
      billToUpdate.notes = element.notes;
      billToUpdate.color = element.color;
      billToUpdate.paidDates = element.paidDates;
      billToUpdate.payPeriodType = element.payPeriodType;
    });

    if (this.currentPlanningId === 0) {
      this.updateLocalStorage('bills', this.bills);
    } else {
      this.updateLocalStorage('bills' + this.currentPlanningId, this.bills);
    }
  }

  // tslint:disable-next-line: no-any
  public updateLocalStorage(key: string, data: any): void {
    localStorage.removeItem(key)
    localStorage.setItem(key, JSON.stringify(data));
  }

  public createPlanning(planningRequest: PlanningRequest): Planning {
    const key = this.plannings.map(x => x.key).sort((y, z) => y - z).reverse().shift() + 1

    const planning: Planning = {
      name: planningRequest.name,
      key,
      billOrder: [],
      sort: ''
    }
    this.plannings.push(planning);

    this.updateLocalStorage('plannings', this.plannings);
    return planning;
  }

  public updatePlanning(planning: Planning): void {

    const planningToUpdate = this.plannings.find(x => x.key === planning.key);
    planningToUpdate.name = planning.name;
    planningToUpdate.billOrder = planning.billOrder;
    planningToUpdate.sort = (planning.sort !== undefined) ? planning.sort : ''

    this.updateLocalStorage('plannings', this.plannings);
  }

  public deletePlanning(key: number): void {
    this.plannings = this.plannings.filter(x => x.key !== key);
    this.updateLocalStorage('plannings', this.plannings);
    if (key !== 0) {
      localStorage.removeItem('bills' + key);
    } else {
      localStorage.removeItem('bills');
    }
  }
}