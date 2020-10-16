import { observable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import * as moment from 'moment'

@inject(BillService)

export class MonthlyExpenses {

  private _billService: BillService
  private _bills: Bill[];

  public months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public years: number[] = [];
  @observable selectedYear: number;

  public billMonthRows: BillMonthRow[] = []

  constructor(billService: BillService) {
    this._billService = billService;
  }

  selectedYearChanged(newValue: any, oldValue: any) {
    if(oldValue !== undefined) {
      this.billMonthRows.forEach(element => {
        element.bills = [];
     });
    
     this._bills.forEach(element => {
       this.filterBillMonthRows(element);
     });
    }
  }


  activate() {

    this.months.forEach(element => {
      var billMonthRow: BillMonthRow = {
        month: element,
        bills: []
      }
      this.billMonthRows.push(billMonthRow);
    });

    this._bills = this._billService.getBills();

    this.years = this.getBillYears(this._bills);

    this._bills.forEach(element => {
      this.filterBillMonthRows(element);
    });

  }


  filterBillMonthRows(bill: Bill): void {

    if(bill.payPeriod === 0) {
      var startDate = moment(bill.startDate);
      if(moment(bill.startDate).year() === this.selectedYear) {
        this.billMonthRows.find(x => x.month -1 === moment(startDate).month()).bills.push(bill)
      }
    } else {
      if (moment(bill.startDate).year() < this.selectedYear && moment(bill.endDate).year() < this.selectedYear) {
        return;
      }
  
      if (moment(bill.startDate).year() > this.selectedYear && moment(bill.endDate).year() > this.selectedYear) {
        return;
      }
  
      var billsActiveMonths = [];
      var costPerMonth = [];
  
  
      var startDate = moment(bill.startDate);
      var endDate = moment(bill.endDate);
    
      while (startDate.isBefore(endDate)) {
        billsActiveMonths.push(startDate.format("YYYY-MM-01"));
        startDate.add(1, 'month');
      }
  
      for (let i = 0; i < billsActiveMonths.length; i++) {
        const element = billsActiveMonths[i];
        
        var obj = {
          date: element,
          cost: 0
        }
  
        if(bill.payPeriod === 0 || i === 0) {
          obj.cost = Number((bill.totalCost / 1).toFixed(0));
        } else {
          obj.cost = Number((bill.totalCost / bill.payPeriod).toFixed(0));
        }
          
        costPerMonth.push(obj);
      };
  
      var costPerMonthWithinSelectedYear = costPerMonth.filter(x => moment(x.date).year() == this.selectedYear);
  
      costPerMonthWithinSelectedYear.forEach(element => {
  
        const currentBill = {
          payPeriod: bill.payPeriod,
          name: bill.name,
          totalCost: Number(element.cost)
        };
        this.billMonthRows.find(x => x.month -1 === moment(element.date).month()).bills.push(currentBill)
      });
    }
  }
  
  totalMonthCost(bills: Bill[]) {
    var totalCost = 0;
    bills.forEach(element => {
      totalCost += Number(element.totalCost);
    });
    return totalCost;
  }

  getMonthString(number: number) {
    var m = ["months.january", "months.february", "months.march", "months.april", "months.may", "months.june",
      "months.july", "months.august", "months.september", "months.october", "months.november", "months.december"];
    return m[number - 1];
  }

  getBillYears(bills: Bill[]) {

    const years: number[] = [];

    const billYears = bills.map(a => a.startDate);

    bills.map(a => a.endDate).forEach(element => {
      billYears.push(element);
    });

    billYears.forEach(element => {
      if(element !== undefined && element !== "") {
        years.push(Number(element.substring(0, 4)))
      }
    });


    var uniq = [...new Set(years)].sort();
    var currentYear = Number(new Date().toISOString().substring(0, 4));
    var yearsInRange = [];
    
    if (uniq.length === 0) {
      yearsInRange.push(currentYear);
    } else {

      for (var i = uniq[0]; i <= uniq[uniq.length - 1]; i++) {
          yearsInRange.push(i);
      }
    }

    if(yearsInRange.includes(currentYear)) {
      this.selectedYear = currentYear;
    } else {
      this.selectedYear = yearsInRange[0];
    }
    return yearsInRange
  }
}

export class BillMonthRow {
  public month: number;
  public bills: any[];
}