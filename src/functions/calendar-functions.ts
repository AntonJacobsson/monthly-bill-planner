import { Color } from 'enums/color';
import { CalendarDay, CalendarDayBill } from 'models/calendar-day';
import moment from 'moment';

export function createCalendarFromDate(date: Date): CalendarDay[] {
  const monthDays: CalendarDay[] = [];

  const daysInMonth = moment(date).daysInMonth();
  const dayInWeek = moment(date).weekday();

  for (let i = 0; i < dayInWeek; i++) {
    const object: CalendarDay = { day: undefined, backgroundColor: '', isActive: false, bills: [] }
    monthDays.push(object);
  }

  for (let i = 0; i < daysInMonth; i++) {
    const object: CalendarDay = { day: i + 1, backgroundColor: '', isActive: false, bills: [] }
    monthDays.push(object);
  }

  if (monthDays.length % 7 !== 0) {
    const add = 7 - (monthDays.length % 7);
    for (let i = 0; i < add; i++) {
      const object: CalendarDay = { day: undefined, backgroundColor: '', isActive: false, bills: [] }
      monthDays.push(object);
    }
  }

  return monthDays
}

export function getBackgroundColorFromBills(bills: CalendarDayBill[]): string {
  if (bills.every(x => x.isPaid)) {
    return Color.Green
  }
  if (bills.some(x => x.isPaid === true)) {
    return Color.Yellow
  }
  return Color.Red;
}
