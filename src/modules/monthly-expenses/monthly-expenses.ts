import { observable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import * as moment from 'moment';
import Chartist from 'chartist-webpack';

@inject(BillService)

export class MonthlyExpenses {
  private _billService: BillService
  private _bills: Bill[];

  public months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public years: number[] = [];
  @observable public selectedYear: number;

  public billMonthRows: BillMonthRow[] = []

  constructor(billService: BillService) {
    this._billService = billService;
  }

  public selectedYearChanged(newValue: any, oldValue: any): void {
    if (oldValue !== undefined) {
      this.billMonthRows.forEach(element => {
        element.bills = [];
      });

      this._bills.forEach(element => {
        this.filterBillMonthRows(element);
      });
    }
  }

  public activate(): void {

    this.months.forEach(element => {
      let billMonthRow: BillMonthRow = {
        month: element,
        bills: [],
        isFlipped: false,
        dataset: []
      }
      this.billMonthRows.push(billMonthRow);
    });

    this._bills = this._billService.getBills();

    this.years = this.getBillYears(this._bills);

    this._bills.forEach(element => {
      this.filterBillMonthRows(element);
    });
  }

  public attached(): void {

    let currentMonth = moment(new Date()).month() + 1;
    if (currentMonth > 3) {
      let scrollToDiv = document.getElementById("month-" + currentMonth.toString());
      if (scrollToDiv !== null) {
        let position = scrollToDiv.getBoundingClientRect().top + window.scrollY;

        window.scroll({
          top: position,
          behavior: 'smooth'
        });
      }
    }
  }

  public flipCard(billMonthRow: BillMonthRow, index: number): void {
    if( billMonthRow.bills.length === 0) {
      return;
    }

    billMonthRow.isFlipped = !billMonthRow.isFlipped;

    if (billMonthRow.isFlipped) {

      let colors = [
      "#d70206",
      "#f05b4f",
      "#f4c63d",
      "#d17905",
      "#453d3f",
      "#59922b",
      "#0544d3",
      "#6b0392",
      "#f05b4f",
      "#dda458",
      "#eacf7d",
      "#86797d",
      "#b2c326",
      "#6188e2",
      "#a748ca"
      ]

      let dataset = [];

      for (let i = 0; i < billMonthRow.bills.length; i++) {
        dataset.push({
          name: billMonthRow.bills[i].name, cost: Number(billMonthRow.bills[i].totalCost), color: colors[i] ,
        });
      }

      billMonthRow.dataset = dataset;

      let data = {
        series: dataset.map(x => x.cost),
      };

      let sum = (a, b) => { return a + b };
      let labelInterpolationFnc = (value: number) => {
        return Math.round(value / data.series.reduce(sum) * 100) + '%';
      };
      let chartist = new Chartist.Pie('.ct-chart-' + index, data, { labelInterpolationFnc });
    }
  }

  public filterBillMonthRows(bill: Bill): void {
    if (bill.payPeriod === 0) {
      let startDate = moment(bill.startDate);
      if (moment(bill.startDate).year() === this.selectedYear) {
        this.billMonthRows.find(x => x.month - 1 === moment(startDate).month()).bills.push(bill)
      }
    } else {
      if (moment(bill.startDate).year() < this.selectedYear && moment(bill.endDate).year() < this.selectedYear) {
        return;
      }

      if (moment(bill.startDate).year() > this.selectedYear && moment(bill.endDate).year() > this.selectedYear) {
        return;
      }

      let billsActiveMonths = [];
      let costPerMonth = [];


      let startDate = moment(bill.startDate);
      let endDate = moment(bill.endDate);

      while (startDate.isBefore(endDate)) {
        billsActiveMonths.push(startDate.format("YYYY-MM-01"));
        startDate.add(1, 'month');
      }

      for (let i = 0; i < billsActiveMonths.length; i++) {
        const element = billsActiveMonths[i];

        let obj = {
          date: element,
          cost: 0
        }

        if (i === 0) {
          if (bill.payPeriod < 1) {
            obj.cost = Number((bill.totalCost / bill.payPeriod).toFixed(0));
          } else {
            obj.cost = Number((bill.totalCost / 1).toFixed(0));
          }
        } else {
          obj.cost = Number((bill.totalCost / bill.payPeriod).toFixed(0));
        }

        costPerMonth.push(obj);
      };

      let costPerMonthWithinSelectedYear = costPerMonth.filter(x => moment(x.date).year() == this.selectedYear);

      costPerMonthWithinSelectedYear.forEach(element => {

        const currentBill: Bill = {
          payPeriod: bill.payPeriod,
          name: bill.name,
          totalCost: Number(element.cost),
          color: bill.color,
          createdDate: bill.createdDate,
          endDate: bill.endDate,
          id: bill.id,
          notes: bill.notes,
          startDate: bill.startDate
        };
        this.billMonthRows.find(x => x.month - 1 === moment(element.date).month()).bills.push(currentBill)
      });
    }
  }

  public totalMonthCost(bills: Bill[]): number {
    let totalCost = 0;
    bills.forEach(element => {
      totalCost += Number(element.totalCost);
    });
    return totalCost;
  }

  public getMonthString(number: number): string {
    let m = ["months.january", "months.february", "months.march", "months.april", "months.may", "months.june",
      "months.july", "months.august", "months.september", "months.october", "months.november", "months.december"];
    return m[number - 1];
  }

  public getBillYears(bills: Bill[]): any {

    const years: number[] = [];

    const billYears = bills.map(a => a.startDate);

    bills.map(a => a.endDate).forEach(element => {
      billYears.push(element);
    });

    billYears.forEach(element => {
      if (element !== undefined && element !== "") {
        years.push(Number(element.substring(0, 4)))
      }
    });


    let uniq = [...new Set(years)].sort();
    let currentYear = Number(new Date().toISOString().substring(0, 4));
    let yearsInRange = [];

    if (uniq.length === 0) {
      yearsInRange.push(currentYear);
    } else {

      for (let i = uniq[0]; i <= uniq[uniq.length - 1]; i++) {
        yearsInRange.push(i);
      }
    }

    if (yearsInRange.includes(currentYear)) {
      this.selectedYear = currentYear;
    } else {
      this.selectedYear = yearsInRange[0];
    }
    return yearsInRange
  }
}

export class BillMonthRow {
  public month: number;
  public bills: Bill[];
  public isFlipped: boolean;
  public dataset: any[];
}