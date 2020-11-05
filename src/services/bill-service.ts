import { Bill } from "models/bill";
import {cloneDeep} from 'lodash';
import { Guid } from "guid-typescript";

export class BillService {

    public bills: Bill[] = []

    constructor() {

      let response = this.getBillsFromLocalStorage();
      if(response !== null) {
        this.bills = response;
      }

    }

    public getBillsFromLocalStorage() {
      let data = localStorage.getItem('bills');
      if (data !== null) {
        try {
          return JSON.parse(data);
        } catch {
          localStorage.clear();
        }
      }
      return null
    }

    public getBills() {
      return cloneDeep(this.bills);
    }

    public createBill(bill: Bill) {
        bill.id = Guid.raw();
        bill.createdDate = new Date().toISOString();
        this.bills.push(bill);

        this.updateLocalStorage();
        return bill;
    }

    public deleteBill(bill: Bill) {
      this.bills = this.bills.filter(x => x.id !== bill.id)
      this.updateLocalStorage();
    }

    public updateBill(bill: Bill) {

      let billToUpdate = this.bills.find(x => x.id === bill.id);
      billToUpdate.name = bill.name;
      billToUpdate.payPeriod = bill.payPeriod;
      billToUpdate.totalCost = bill.totalCost;
      billToUpdate.startDate = bill.startDate;
      billToUpdate.endDate = bill.endDate;
      billToUpdate.notes = bill.notes;
      billToUpdate.color = bill.color;

      this.updateLocalStorage();
      }

    public updateLocalStorage() {
      localStorage.removeItem('bills')
      localStorage.setItem('bills', JSON.stringify(this.bills));
    }
}