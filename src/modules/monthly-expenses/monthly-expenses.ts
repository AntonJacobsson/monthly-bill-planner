import { observable, inject } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import moment from 'moment';
import Chartist from 'chartist-webpack';
import { PayPeriodType } from 'enums/pay-period-type';
import { getBillDueDates } from 'functions/date-functions';

@inject(BillService)

export class MonthlyExpenses {
  private _bills: Bill[];
  private lastDateForBills: string = '';

  public months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public years: number[] = [];
  @observable public selectedYear: number;

  public billMonthRows: BillMonthRow[] = []

  constructor(private _billService: BillService) {}

  public selectedYearChanged(newValue: number, oldValue: number): void {
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
      const billMonthRow: BillMonthRow = {
        month: element,
        bills: [],
        isFlipped: false,
        dataset: []
      }
      this.billMonthRows.push(billMonthRow);
    });

    this._bills = this._billService.getBills();

    this.years = this.getBillYears(this._bills);

    const years = [... this.years].sort((a, b) => b - a);
    const year = (years.length > 0) ? years[0] : this.selectedYear;

    this.lastDateForBills = (year + '-12-31');

    this._bills.forEach(element => {
      this.filterBillMonthRows(element);
    });

    this.billMonthRows.forEach(x => x.bills.sort((n1,n2) => n1.totalCost - n2.totalCost).reverse());
  }

  public attached(): void {

    const currentMonth = moment(new Date()).month() + 1;
    if (currentMonth > 3) {
      const scrollToDiv = document.getElementById('month-' + currentMonth.toString());
      if (scrollToDiv !== null) {
        const position = scrollToDiv.getBoundingClientRect().top + window.scrollY;

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

    billMonthRow.bills = billMonthRow.bills.sort((n1,n2) => n1.totalCost - n2.totalCost).reverse();

    if (billMonthRow.isFlipped) {

      const colors = [
        '#00d1b2',
        '#3273dc',
        '#209cee',
        '#48c774',
        '#ffdd57',
        '#59922b',
        '#ff3860',
        '#6b0392',
        '#f05b4f',
        '#dda458',
        '#eacf7d',
        '#86797d',
        '#b2c326',
        '#6188e2',
        '#a748ca'
      ]

      let dataset: Dataset[] = [];

      for (let i = 0; i < billMonthRow.bills.length; i++) {
        dataset.push({name: billMonthRow.bills[i].name, cost: Number(billMonthRow.bills[i].totalCost), color: colors[i], percent: undefined});
      }

      dataset = dataset.sort((n1,n2) => n1.cost - n2.cost).reverse();

      const data = {
        series: dataset.map(x => x.cost)
      };

      const sum = (a, b) => { return a + b };
      const labelInterpolationFnc = (value: number) => {
        const percent = Math.round(value / data.series.reduce(sum) * 100);

        return (percent < 5) ? '' : percent + '%';

      };

      dataset.forEach(element => {
        const percent = Math.round(element.cost / data.series.reduce(sum) * 100)
        if(percent < 5) {
          element.percent =  ' - ' + Math.round(element.cost / data.series.reduce(sum) * 100) + '%';
        }
      });

      billMonthRow.dataset = dataset;

      const chartist = new Chartist.Pie('.ct-chart-' + index, data, { labelInterpolationFnc });
    }
  }

  public filterBillMonthRows(bill: Bill): void {
    if (bill.payPeriod === 0) {
      const startDate = moment(bill.startDate);
      if (moment(bill.startDate).year() === this.selectedYear) {
        this.billMonthRows.find(x => x.month - 1 === moment(startDate).month()).bills.push(bill)
      }
    } else {

      if(bill.endDate === undefined) {
        bill.endDate = this.lastDateForBills
      }

      if (moment(bill.startDate).year() < this.selectedYear && moment(bill.endDate).year() < this.selectedYear) {
        return;
      }

      if (moment(bill.startDate).year() > this.selectedYear && moment(bill.endDate).year() > this.selectedYear) {
        return;
      }

      let billsActiveMonths = [];
      const costPerMonth = [];

      const startDate = moment(bill.startDate);
      const endDate = moment(bill.endDate);

      while (startDate.isBefore(endDate)) {
        billsActiveMonths.push(startDate.format('YYYY-MM-01'));
        startDate.add(1, 'month');
      }

      billsActiveMonths = billsActiveMonths.filter(x => moment(x).year() === this.selectedYear)

      for (let i = 0; i < billsActiveMonths.length; i++) {
        const element = billsActiveMonths[i];
        const obj = {
          date: element,
          cost: 0,
          information: ''
        }

        if(bill.payPeriodType === undefined) {
          bill.payPeriodType = PayPeriodType.Month
        }

        if(bill.payPeriodType === PayPeriodType.Month) {
          if (i === 0) {
            if (bill.payPeriod < 1) {
              obj.cost = Number((bill.totalCost / bill.payPeriod).toFixed(0));
            } else {
              obj.cost = Number((bill.totalCost / 1).toFixed(0));
            }
          } else {
            obj.cost = Number((bill.totalCost / bill.payPeriod).toFixed(0));
          }
        }

        if(bill.payPeriodType === PayPeriodType.Week) {
          const payDatesInMonth = getBillDueDates(bill, this.lastDateForBills).filter(x => moment(x).month() === moment(element).month() && moment(x).year() === this.selectedYear).length;
          obj.cost = Number((bill.totalCost * payDatesInMonth).toFixed(0));
          if(payDatesInMonth > 1) {
            obj.information = ' (' + payDatesInMonth + ')';
          }
        }

        costPerMonth.push(obj);
      };

      const costPerMonthWithinSelectedYear = costPerMonth.filter(x => moment(x.date).year() === this.selectedYear);
      costPerMonthWithinSelectedYear.forEach(element => {

        const currentBill: Bill = {
          payPeriod: bill.payPeriod,
          name: bill.name + element.information,
          totalCost: Number(element.cost),
          color: bill.color,
          createdDate: bill.createdDate,
          endDate: bill.endDate,
          id: bill.id,
          notes: bill.notes,
          startDate: bill.startDate,
          nextDueDate: bill.nextDueDate,
          dueDates: bill.dueDates,
          paidDates: bill.paidDates,
          payPeriodType: bill.payPeriodType
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

  public getMonthString(value: number): string {
    const m = ['months.january', 'months.february', 'months.march', 'months.april', 'months.may', 'months.june',
      'months.july', 'months.august', 'months.september', 'months.october', 'months.november', 'months.december'];
    return m[value - 1];
  }

  public getBillYears(bills: Bill[]): number[] {

    const years: number[] = [];

    const billYears = bills.map(a => a.startDate);

    bills.map(a => a.endDate).forEach(element => {
      billYears.push(element);
    });

    billYears.forEach(element => {
      if (element !== undefined && element !== '') {
        years.push(Number(element.substring(0, 4)))
      }
    });

    const uniq = [...new Set(years)].sort();
    const currentYear = Number(new Date().toISOString().substring(0, 4));

    const yearsInRange: number[] = [];

    if (uniq.length === 0) {
      yearsInRange.push(currentYear);
    } else {

      for (let i = uniq[0]; i <= uniq[uniq.length - 1]; i++) {
        yearsInRange.push(i);
      }
    }

    this.selectedYear = (yearsInRange.includes(currentYear)) ? currentYear : yearsInRange[0]

    return yearsInRange
  }
}

export class BillMonthRow {
  public month: number;
  public bills: Bill[];
  public isFlipped: boolean;
  public dataset: Dataset[];
}

export class Dataset {
  public name: string;
  public cost: number;
  public color: string;
  public percent: string;
}