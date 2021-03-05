import { BillModal } from '../../components/bill-modal';
import { PlanningModal } from '../../components/planning-modal';
import { DialogCloseResult, DialogService } from 'aurelia-dialog';
import { inject, observable } from 'aurelia-framework';
import { BillService } from 'services/bill-service';
import { Bill } from 'models/bill';
import { DeletePrompt } from 'components/delete-prompt';
import { LanguageService } from 'services/language-service';
import { BillOrderDictionary, Planning, PlanningRequest } from 'models/planning';
import { I18N } from 'aurelia-i18n';
import moment from 'moment';
import { CalendarDay, CalendarDayBill } from 'models/calendar-day';
import { CurrentContext } from 'services/current-context';
import { NameValuePair } from 'models/name-value-pair';
import { getBillDueDates, getPeriodStringFromEnum } from 'functions/date-functions';
import { createCalendarFromDate, getBackgroundColorFromBills } from 'functions/calendar-functions';
import { CurrencyService } from 'services/currency-service';
import { WelcomeModal } from 'components/welcome-modal';
import { ExceptionService } from 'services/exception-service';

@inject(DialogService, BillService, LanguageService, I18N, CurrentContext, CurrencyService, ExceptionService)

export class BillHandler {

  @observable public selectedSort: string;

  public bills: Bill[] = [];
  public plannings: Planning[] = [];
  public dialogService: DialogService;
  public currentPlanning: Planning;
  public isReorderMode: boolean = false;

  public isCalendarMode: boolean = false;
  public weekArray: string[] = [];

  public currentMonth: string = '';
  public monthDays: CalendarDay[] = [];
  public selectedCalendarDay: CalendarDay;

  private _locale: string = '';
  private _currentMonth: Date;

  public sorts: NameValuePair[] = [
    { name: 'custom', value: '' },
    { name: 'due-date', value: 'dueDate' }
  ]

  constructor(dialogService: DialogService, private _billService: BillService, private _languageService: LanguageService, private _i18n: I18N, private _currentContext: CurrentContext, private _currencyService: CurrencyService, private _exceptionService: ExceptionService) {
    this.dialogService = dialogService;
  }

  public async attached(): Promise<void> {

    try {
      window.scroll({
        top: 0,
        behavior: 'auto'
      });

      this._locale = this._languageService.getLanguage();

      if (this._currencyService.getCurrencyFromLocalStorage() === null) {
        this.dialogService.open({ viewModel: WelcomeModal, model: this._locale, lock: true });
      }

      moment.locale(this._locale);

      this.plannings = this._billService.getPlannings();

      this.currentPlanning = (this._billService.currentPlanningId === undefined) ? this.plannings[0] : this.plannings.find(x => x.key === this._billService.currentPlanningId)

      this.selectedSort = (this.currentPlanning.sort !== undefined) ? this.currentPlanning.sort : '';

      const bills = this._billService.getBillsByPlanning(this.currentPlanning);

      bills.forEach(element => {
        element.nextDueDate = this.formatFromTomDateString(element);
      });

      this.bills = this.sortBills(bills, this.currentPlanning);
    } catch (error) {
      const message = await this._exceptionService.sendErrorAsync(error, BillHandler.name)
      alert(message);
    }
  }

  public toggleCalendarMode(): void {
    if (this.isCalendarMode === false) {
      this.setDueDates(this.bills);
      this.updateCalendar(moment().startOf('month').toDate());
      this.isCalendarMode = true;

      this._currentContext.calendarClicks += 1;

      if (this._currentContext.calendarClicks >= 3) {

        const event = new CustomEvent('openBannerAd', { 'detail': 'Opens banner ad' });
        document.dispatchEvent(event);
        this._currentContext.calendarClicks = 0;
      }

    } else {
      this.isCalendarMode = false;
      this._billService.updateBills(this.bills)
      this.selectedCalendarDay = undefined;
    }
  }

  public selectedSortChanged(newValue: string, oldValue: string): void {
    if (oldValue !== undefined) {
      this.currentPlanning.sort = newValue;
      this.bills = this.sortBills(this.bills, this.currentPlanning);
    }
  }

  public submit(): void {
    this.dialogService.open({ viewModel: BillModal, model: null, lock: false }).whenClosed((response: DialogCloseResult) => {
      if (!response.wasCancelled) {
        const createdBill = this._billService.createBill(response.output)
        this.bills.push(createdBill);
        createdBill.nextDueDate = this.formatFromTomDateString(createdBill);
        if (this.selectedSort !== '') {
          this.bills = this.sortBills(this.bills, this.currentPlanning);
        }
      }
    });
  }

  public openDeletePrompt(bill: Bill): void {
    if (this.isReorderMode) { return; }

    navigator.vibrate(50);
    this.dialogService.open({ viewModel: DeletePrompt, model: bill, lock: false }).whenClosed((response: DialogCloseResult) => {
      if (!response.wasCancelled) {
        this.deleteBill(response.output);
      }
    });
  }

  public deleteBill(bill: Bill): void {
    this._billService.deleteBill(bill);
    this.bills = this.bills.filter(x => x !== bill);
  }

  public edit(bill: Bill): void {
    if (this.isReorderMode) { return; }

    this.dialogService.open({ viewModel: BillModal, model: bill, lock: false }).whenClosed((response: DialogCloseResult) => {
      if (!response.wasCancelled) {
        this._billService.updateBill(response.output);
        bill.nextDueDate = this.formatFromTomDateString(bill);
        if (this.selectedSort !== '') {
          this.bills = this.sortBills(this.bills, this.currentPlanning);
        }
      }
    });
  }

  public formatFromTomDateString(bill: Bill): Date {

    const today = moment().startOf('day');
    const start = moment(bill.startDate);

    if (today <= start) {
      return start.toDate()
    }

    if (bill.endDate === undefined && bill.payPeriod > 0) {
      const payPeriod = (bill.payPeriod < 1) ? 1 : bill.payPeriod;

      while (start.isBefore(today)) {
        start.add(payPeriod, getPeriodStringFromEnum(bill.payPeriodType));
      }
      return start.toDate();
    }

    const end = (bill.endDate !== null && bill.endDate !== '' && bill.endDate !== undefined) ? moment(bill.endDate) : moment(bill.startDate);
    const payperiod = (bill.payPeriod >= 1) ? bill.payPeriod : 1

    if (today > end) {
      return undefined;
    }

    const billDueDates: string[] = [];

    while (start.isBefore(end)) {
      billDueDates.push(start.format('YYYY-MM-DD'));
      start.add(payperiod, getPeriodStringFromEnum(bill.payPeriodType));
    }

    billDueDates.forEach(element => {
      const date = new Date(element);
      if (today.toDate() < date) {
        return date
      }
    });

    return undefined
  }

  public addPlanning(): void {
    if (this.isReorderMode) { return; }

    const name = this._i18n.tr('new');

    const planning: PlanningRequest = {
      name
    };
    const result = this._billService.createPlanning(planning);
    this.plannings.push(result);
  }

  public selectPlanning(planning: Planning): void {
    if (this.isCalendarMode) {
      this._billService.updateBills(this.bills)
      this.isCalendarMode = false;
      this.selectedCalendarDay = undefined;
    }

    if (this.isReorderMode) { return; }

    this.currentPlanning = planning;

    const bills = this._billService.getBillsByPlanning(this.currentPlanning);

    bills.forEach(element => {
      element.nextDueDate = this.formatFromTomDateString(element);
    });

    this.bills = this.sortBills(bills, this.currentPlanning);
  }

  public openReorderMode(): void {
    this.isReorderMode = true;
  }

  public saveReorder(): void {

    if (this.selectedSort === 'dueDate') {
      this.currentPlanning.sort = this.selectedSort
      this._billService.updatePlanning(this.currentPlanning);
    } else {
      const billOrderList: BillOrderDictionary[] = [];

      let count = 0;

      this.bills.forEach(element => {
        const billOrder: BillOrderDictionary = { id: element.id, value: count }
        billOrderList.push(billOrder);
        count++;
      });

      this.currentPlanning.billOrder = billOrderList;
      this.currentPlanning.sort = '';
      this._billService.updatePlanning(this.currentPlanning);
    }

    this.isReorderMode = false;
  }

  public reorderBill(bill: Bill, value: number): void {

    this.selectedSort = '';
    this.currentPlanning.sort = '';

    const index = this.bills.findIndex(x => x.id === bill.id);

    if (index === 0 && value === -1) {
      return;
    }

    if (index === (this.bills.length - 1) && value === 1) {
      return;
    }

    this.bills = this.moveItemInArrayFromIndexToIndex(this.bills, index, index + value);
  }

  public editPlanning(planning: Planning): void {
    if (this.isReorderMode) { return; }

    navigator.vibrate(50);
    this.dialogService.open({ viewModel: PlanningModal, model: planning, lock: false }).whenClosed((response: DialogCloseResult) => {
      if (!response.wasCancelled) {
        if (response.output.name !== undefined) {
          this._billService.updatePlanning(response.output);
        } else {
          this._billService.deletePlanning(response.output);
          this.plannings = this._billService.getPlannings();

          if (this.currentPlanning.key === response.output) {
            this.currentPlanning = this.plannings[0];
          }
          const bills = this._billService.getBillsByPlanning(this.currentPlanning);

          bills.forEach(element => {
            element.nextDueDate = this.formatFromTomDateString(element);
          });

          this.bills = this.sortBills(bills, this.currentPlanning);
        }
      }
    });
  }

  public deactivate(): void {
    this.dialogService.closeAll();

    if (this.isCalendarMode) {
      this._billService.updateBills(this.bills)
    }
  }

  private sortBills(bills: Bill[], planning: Planning): Bill[] {

    if (planning.sort !== undefined && planning.sort !== '') {
      if (planning.sort === 'dueDate') {
        const orderedBills = [];

        const billsCopy = [...bills];

        const billsWithDates = billsCopy.filter(x => x.nextDueDate !== undefined);

        billsWithDates
          .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
          .forEach(x => orderedBills
            .push(x));

        billsCopy.filter(x => x.nextDueDate === undefined).forEach(x => orderedBills.push(x));
        return orderedBills;
      }
    };

    // sort by billOrder Custom sort
    if (planning.billOrder !== undefined && planning.billOrder.length > 0) {
      const sortedBills: Bill[] = [];
      const billOrders = planning.billOrder.sort(x => x.value);

      billOrders.forEach(element => {
        const bill = bills.find(x => x.id === element.id);
        if (bill !== undefined) {
          sortedBills.push(bill);
          bills = bills.filter(x => x.id !== bill.id)
        }
      });

      bills.forEach(element => {
        sortedBills.push(element);
      });

      return sortedBills;
    }

    return bills;
  }

  private moveItemInArrayFromIndexToIndex(array, fromIndex, toIndex): Bill[] {
    if (fromIndex === toIndex) return array;

    const newArray = [...array];

    const target = newArray[fromIndex];
    const inc = toIndex < fromIndex ? -1 : 1;

    for (let i = fromIndex; i !== toIndex; i += inc) {
      newArray[i] = newArray[i + inc];
    }

    newArray[toIndex] = target;

    return newArray;
  };

  public updateCalendar(date: Date): void {

    const options = { year: 'numeric', month: 'long' };
    this._currentMonth = date;
    this.currentMonth = this._currentMonth.toLocaleDateString(this._locale, options);

    this.weekArray = [];
    const weekDays = moment.weekdays(true);
    weekDays.forEach(element => {
      this.weekArray.push(element.substr(0, 3));
    });

    this.monthDays = createCalendarFromDate(date)

    this.bills.forEach(element => {
      const dueDatesWithinMonth = element.dueDates.filter(x => moment(x).isSameOrAfter(moment(this._currentMonth)) && moment(x).isSameOrBefore(moment(this._currentMonth).endOf('month')));
      dueDatesWithinMonth.forEach(dueDate => {
        const monthDay = this.monthDays.find(x => x.day === moment(dueDate).date());
        if (monthDay !== undefined) {
          element.paidDates = (element.paidDates === undefined) ? [] : element.paidDates
          const currentDate = (moment(this._currentMonth).set('date', monthDay.day).format('YYYY-MM-DD'));

          let isPaid = false;
          if (element.paidDates.includes(currentDate)) {
            isPaid = true;
          }
          monthDay.bills.push({ name: element.name, totalCost: element.totalCost, isPaid, date: currentDate, id: element.id });
        }
      });
    });

    const monthDaysWithBills = this.monthDays.filter(x => x.bills.length > 0);

    monthDaysWithBills.forEach(element => {
      element.backgroundColor = getBackgroundColorFromBills(element.bills);
    });
  }

  public changeMonth(value: number): void {
    this.selectedCalendarDay = undefined
    this.updateCalendar(moment(this._currentMonth).add(value, 'month').toDate());
  }

  public daySelect(data: CalendarDay): void {
    if (data.day !== undefined) {
      this.monthDays.forEach(element => {
        element.isActive = false;
      });
      data.isActive = true;
      this.selectedCalendarDay = data;
    }
  }

  public setDueDates(bills: Bill[]): void {
    bills.forEach(element => {
      element.dueDates = getBillDueDates(element, '2025-01-01');
    });
  }

  public updatePaidDates(bill: CalendarDayBill, selectedCalendarDay: CalendarDay): void {
    const result = this.bills.find(x => x.id === bill.id);

    if (bill.isPaid === false) {

      result.paidDates.push(bill.date);
    } else {
      result.paidDates = result.paidDates.filter(x => x !== bill.date);
    }

    bill.isPaid = !bill.isPaid;
    selectedCalendarDay.backgroundColor = getBackgroundColorFromBills(selectedCalendarDay.bills);
  }
}