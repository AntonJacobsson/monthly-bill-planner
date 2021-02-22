import { Bill } from 'models/bill';
import { PayPeriodType } from 'models/pay-period-type';
import moment from 'moment';

// tslint:disable-next-line: typedef
export function getPeriodStringFromEnum(enumValue: PayPeriodType) {
  if (enumValue === undefined) {
    return 'month';
  }
  switch (enumValue) {
    case PayPeriodType.Month:
      return 'month'
    case PayPeriodType.Week:
      return 'week'
    default:
      return 'month'
  }
}

export function getBillDueDates(bill: Bill, fallbackEndDate: string): string[] {
  const dueDates = [];

  if (bill.payPeriod < 1) {
    const start = moment(bill.startDate);
    dueDates.push(start.format('YYYY-MM-DD'));
  }
  else {
    const start = moment(bill.startDate);
    const endDate = (bill.endDate !== undefined) ? moment(bill.endDate) : moment(fallbackEndDate);

    while (start.isBefore(endDate)) {
      dueDates.push(start.format('YYYY-MM-DD'))
      start.add(bill.payPeriod, getPeriodStringFromEnum(bill.payPeriodType));
    }
  }
  return dueDates
}