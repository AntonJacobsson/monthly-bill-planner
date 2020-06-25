import { observable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
@inject(BillService)

export class SavingStatistics {

  private _billService: BillService

  public months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  @observable currentMonth: number;

  public billMonthRows: BillMonthRow[] = []

  constructor(billService: BillService) {
    this._billService = billService;
  }


  activate() {

    var currentDate = new Date();
    this.currentMonth = currentDate.getMonth() + 1;

    this.months.forEach(element => {
      var billMonthRow: BillMonthRow = {
        month: element,
        bills: []
      }
      this.billMonthRows.push(billMonthRow);
    });

    const bills = this._billService.getBills();
    bills.forEach(element => {
      this.filterBillMonthRows(element);
    });

  }


  filterBillMonthRows(bill: any): void {

    const totalCost: number = bill.totalCost;

    let newArr = [];

    newArr = this.billMonthRows.filter(x => x.month >= bill.payStartMonth);

    if (bill.payPeriod > 0) {
      newArr.forEach(element => {

        const currentBill = {
          payPeriod: bill.payPeriod,
          name: bill.name,
          totalCost: Number((totalCost / bill.payPeriod).toFixed(0)),
          payStartMonth: bill.payStartMonth,
        }

        if (element.month === currentBill.payStartMonth) {
          currentBill.name += '*'
        }

        element.bills.push(currentBill);
      });
    }

    var rowsBeforeBill = this.billMonthRows.filter(x => x.month <= bill.payStartMonth && x.month >= this.currentMonth);

    rowsBeforeBill.forEach(element => {

        var obj = {
        payPeriod: bill.payPeriod,
        name: bill.name,
        totalCost: Number((totalCost / rowsBeforeBill.length).toFixed(0)),
        payStartMonth: bill.payStartMonth
      }
      element.bills.push(obj);
    });
  }

  totalMonthCost(bills: any[]) {
    var totalCost = 0;
    bills.forEach(element => {
      totalCost += element.totalCost;
    });
    return totalCost;
  }

  getMonthString(number: number) {
    var m = [ "months.january", "months.february", "months.march", "months.april", "months.may", "months.june",
    "months.july", "months.august", "months.september", "months.october", "months.november", "months.december" ];
    return m[number - 1];
  }

}

export class BillMonthRow {
  public month: number;
  public bills: any[];
}