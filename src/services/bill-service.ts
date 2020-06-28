import { Bill } from "models/bill";
import {cloneDeep} from 'lodash';
import { Guid } from "guid-typescript";

export class BillService {
    
    public bills: Bill[] = []
    
    constructor() {

      var response = this.getBillsFromLocalStorage();
      if(response !== null) {
        this.bills = response;
      }

    }

    getBillsFromLocalStorage() {
      var data = localStorage.getItem('bills');
      if (data !== null) {
        try {
          return JSON.parse(data);
        } catch {
          localStorage.clear();
        }
      }
      return null
    }

    getBills() {
      return cloneDeep(this.bills);
    }

    createBill(bill: Bill) {
        bill.id = Guid.raw();
        bill.createdDate = new Date().toISOString();
        this.bills.push(bill);

        this.updateLocalStorage();
        return bill;
    }

    deleteBill(bill: Bill) {
      this.bills = this.bills.filter(x => x.id !== bill.id)
      this.updateLocalStorage();
    }

    updateBill(bill: Bill) {

      let billToUpdate = this.bills.find(x => x.id === bill.id);
      billToUpdate.name = bill.name;
      billToUpdate.payPeriod = bill.payPeriod;
      billToUpdate.payStartMonth = bill.payStartMonth;
      billToUpdate.totalCost = bill.totalCost;

      this.updateLocalStorage();
      }

    updateLocalStorage() {
      localStorage.removeItem('bills')
      localStorage.setItem('bills', JSON.stringify(this.bills));
    }
}