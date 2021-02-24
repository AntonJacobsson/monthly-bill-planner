import { Color } from 'enums/color';
import { createCalendarFromDate, getBackgroundColorFromBills } from 'functions/calendar-functions';
import { CalendarDayBill } from 'models/calendar-day';

describe('createCalendarFromDate', () => {

    test('January 2021', () => {

        const date = new Date('2021-01-01');

        const result = createCalendarFromDate(date);
        expect(result).toHaveLength(42);
        expect(result.filter(x => x.day !== undefined)).toHaveLength(31);
    })

    test('February 2021', () => {

        const date = new Date('2021-02-01');

        const result = createCalendarFromDate(date);
        expect(result).toHaveLength(35);
        expect(result.filter(x => x.day !== undefined)).toHaveLength(28);
    })
});

describe('getBackgroundColorFromBills', () => {

    test('Green', () => {
        const calendarDayBills: CalendarDayBill[] = [
            {id: '', name: '', totalCost: 0, isPaid: true, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: true, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: true, date: '2020-01-01'}
        ]
        const result = getBackgroundColorFromBills(calendarDayBills);
        expect(result).toBe(Color.Green);
    })

    test('Yellow', () => {
        const calendarDayBills: CalendarDayBill[] = [
            {id: '', name: '', totalCost: 0, isPaid: false, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: true, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: true, date: '2020-01-01'}
        ]
        const result = getBackgroundColorFromBills(calendarDayBills);
        expect(result).toBe(Color.Yellow);
    })

    test('Red', () => {
        const calendarDayBills: CalendarDayBill[] = [
            {id: '', name: '', totalCost: 0, isPaid: false, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: false, date: '2020-01-01'},
            {id: '', name: '', totalCost: 0, isPaid: false, date: '2020-01-01'}
        ]
        const result = getBackgroundColorFromBills(calendarDayBills);
        expect(result).toBe(Color.Red);
    })
});