import { Bill } from "models/bill";
import {cloneDeep} from 'lodash';
import { Guid } from "guid-typescript";

export class BillService {
    
    public bills: Bill[] = []
    
    constructor() {
      this.bills = this.createMockData();
    }

    getBills() {
      return cloneDeep(this.bills);
    }

    createBill(bill: Bill) {
        bill.id = Guid.raw();
        this.bills.push(bill);
        return bill;
    }

    deleteBill(bill: Bill) {
      this.bills = this.bills.filter(x => x.id !== bill.id)
    }

    updateBill(bill: Bill) {

      let billToUpdate = this.bills.find(x => x.id === bill.id);
      billToUpdate.name = bill.name;
      billToUpdate.newBill = bill.newBill;
      billToUpdate.payPeriod = bill.payPeriod;
      billToUpdate.payStartMonth = bill.payStartMonth;
      billToUpdate.totalCost = bill.totalCost;
    }

    private createMockData(): Bill[] {
        const bills: Bill[] = []
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 1,
          name: "Hyra",
          totalCost: 3250,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 1,
          name: "Mat",
          totalCost: 3000,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 12,
          name: "Bostadsförsäkring",
          totalCost: 1197,
          payStartMonth: 7,
          newBill: false
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 1,
          name: "Bensin",
          totalCost: 3000,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 12,
          name: "NY årlig räkning",
          totalCost: 3200,
          payStartMonth: 4,
          newBill: true
        });
    
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 12,
          name: "12mån gammal",
          totalCost: 1200,
          payStartMonth: 3,
          newBill: false
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 3,
          name: "kvartal ny",
          totalCost: 300,
          payStartMonth: 7,
          newBill: true
        });
    
        bills.push({
          id: Guid.raw(),
          payPeriod: 0,
          name: "inte återkommande räk",
          totalCost: 5000,
          payStartMonth: 9,
          newBill: true
        });
    
        return bills;
      }
}