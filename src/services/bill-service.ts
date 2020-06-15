import { Bill } from "models/bill";

export class BillService {
    
    public bills: Bill[] = []
    
    constructor() {
        this.bills = this.createMockData();
    }

    getBills() {
        return this.bills;
    }

    createBill(bill: Bill) {
        this.bills.push(bill);
    }

    private createMockData(): Bill[] {
        const bills: Bill[] = []
    
    
        bills.push({
          payPeriod: 1,
          name: "Hyra",
          totalCost: 3250,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          payPeriod: 1,
          name: "Mat",
          totalCost: 3000,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          payPeriod: 12,
          name: "Bostadsförsäkring",
          totalCost: 1197,
          payStartMonth: 7,
          newBill: false
        });
    
        bills.push({
          payPeriod: 1,
          name: "Bensin",
          totalCost: 3000,
          payStartMonth: 1,
          newBill: false
        });
    
        bills.push({
          payPeriod: 12,
          name: "NY årlig räkning",
          totalCost: 3200,
          payStartMonth: 4,
          newBill: true
        });
    
    
        bills.push({
          payPeriod: 12,
          name: "12mån gammal",
          totalCost: 1200,
          payStartMonth: 3,
          newBill: false
        });
    
        bills.push({
          payPeriod: 3,
          name: "kvartal ny",
          totalCost: 300,
          payStartMonth: 7,
          newBill: true
        });
    
        bills.push({
          payPeriod: 0,
          name: "inte återkommande räk",
          totalCost: 5000,
          payStartMonth: 9,
          newBill: true
        });
    
        return bills;
      }
}