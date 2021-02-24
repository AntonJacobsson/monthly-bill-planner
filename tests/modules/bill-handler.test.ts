import { I18N } from 'aurelia-i18n';
import { Guid } from 'guid-typescript';
import { Bill } from 'models/bill';
import { PayPeriodType } from 'enums/pay-period-type';
import { BillHandler } from 'modules/bill-handler/bill-handler';
import moment from 'moment';
import { BillService } from 'services/bill-service';
import { LanguageService } from 'services/language-service';

describe('reorderBill', () => {

    test('Move first bill down', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        Sut.currentPlanning = {
            billOrder: [],
            key: 0,
            name: 'planning',
            sort: ''
        }

        const firstGuid = Guid.raw();
        const secondGuid = Guid.raw();

        Sut.bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: firstGuid,
                name: 'My Bill Feb',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-02-01',
                totalCost: 0,
                payPeriodType: 0
            },
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: secondGuid,
                name: 'My Bill March',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-03-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.reorderBill(Sut.bills[0], 1);

        expect(Sut.bills[0].name).toBe('My Bill March')
        expect(Sut.bills[0].id).toBe(secondGuid);
    })

    test('Move last bill up', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        Sut.currentPlanning = {
            billOrder: [],
            key: 0,
            name: 'planning',
            sort: ''
        }

        const firstGuid = Guid.raw();
        const secondGuid = Guid.raw();

        Sut.bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: firstGuid,
                name: 'My Bill Feb',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-02-01',
                totalCost: 0,
                payPeriodType: 0
            },
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: secondGuid,
                name: 'My Bill March',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-03-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.reorderBill(Sut.bills[1], -1);

        expect(Sut.bills[0].name).toBe('My Bill March')
        expect(Sut.bills[0].id).toBe(secondGuid);
    })

    test('Move first bill up, should not crash', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        Sut.currentPlanning = {
            billOrder: [],
            key: 0,
            name: 'planning',
            sort: ''
        }

        const firstGuid = Guid.raw();

        Sut.bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: firstGuid,
                name: 'My Bill Feb',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-02-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.reorderBill(Sut.bills[0], -1);
        expect(Sut.bills[0].name).toBe('My Bill Feb')
        expect(Sut.bills[0].id).toBe(firstGuid);
    })

    test('Move last bill down, should not crash', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        Sut.currentPlanning = {
            billOrder: [],
            key: 0,
            name: 'planning',
            sort: ''
        }

        const firstGuid = Guid.raw();

        Sut.bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id: firstGuid,
                name: 'My Bill Feb',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-02-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.reorderBill(Sut.bills[0], 1);
        expect(Sut.bills[0].name).toBe('My Bill Feb')
        expect(Sut.bills[0].id).toBe(firstGuid);
    })
});

describe('setDueDates', () => {

    test('Set non recurring dueDates', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        const id = Guid.raw();

        const bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id,
                name: 'My January Bill',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2020-01-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.setDueDates(bills);

        const bill = bills[0];
        expect(bill.dueDates).toHaveLength(1);
        expect(bill.dueDates[0]).toBe(bill.startDate);

    })

    test('Set 1 month recurring dueDates', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        const id = Guid.raw();

        const bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: '2021-01-01',
                id,
                name: 'My January Bill',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 1,
                startDate: '2020-01-01',
                totalCost: 0,
                payPeriodType: PayPeriodType.Month
            }
        ]

        Sut.setDueDates(bills);

        const bill = bills[0];
        expect(bill.dueDates).toHaveLength(12);
        expect(bill.dueDates).toStrictEqual(['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01', '2020-06-01', '2020-07-01', '2020-08-01', '2020-09-01', '2020-10-01', '2020-11-01', '2020-12-01']);

    })

    test('Set 1 month recurring, no endDate dueDates', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        const id = Guid.raw();

        const bills = [
            {
                color: 'primary',
                createdDate: '2020-01-01',
                dueDates: [],
                endDate: undefined,
                id,
                name: 'My January Bill',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 1,
                startDate: '2020-01-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.setDueDates(bills);

        const bill = bills[0];
        expect(bill.dueDates).toHaveLength(60);
        expect(bill.dueDates).toStrictEqual(
            [
                '2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01', '2020-06-01', '2020-07-01', '2020-08-01', '2020-09-01', '2020-10-01', '2020-11-01', '2020-12-01',
                '2021-01-01', '2021-02-01', '2021-03-01', '2021-04-01', '2021-05-01', '2021-06-01', '2021-07-01', '2021-08-01', '2021-09-01', '2021-10-01', '2021-11-01', '2021-12-01',
                '2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01', '2022-07-01', '2022-08-01', '2022-09-01', '2022-10-01', '2022-11-01', '2022-12-01',
                '2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01', '2023-10-01', '2023-11-01', '2023-12-01',
                '2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01', '2024-06-01', '2024-07-01', '2024-08-01', '2024-09-01', '2024-10-01', '2024-11-01', '2024-12-01'
            ]);

    })
});

describe('updateCalendar', () => {

    let Sut: BillHandler = null;

    beforeEach(() => {
        window.scroll = jest.fn();

        const languageService = new LanguageService();
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('en');

        const i18n = new I18N(null, null);
        jest.spyOn(i18n, 'tr').mockReturnValue('translated');

        const billService = new BillService(i18n);
        jest.spyOn(billService, 'getPlannings').mockReturnValue([{ billOrder: [], key: 0, name: 'planning', sort: '' }]);

        Sut = new BillHandler(null, billService, languageService, i18n, null);
        Sut.attached();
    });

    test('3 bills - 1 January 2021 - Non Paid', () => {

        Sut.bills = [
            {
                color: 'primary',
                createdDate: '2021-01-01',
                dueDates: ['2021-01-01'],
                endDate: undefined,
                id: Guid.raw(),
                name: 'Rent',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2021-01-01',
                totalCost: 0,
                payPeriodType: 0
            },
            {
                color: 'primary',
                createdDate: '2021-01-01',
                dueDates: ['2021-01-01'],
                endDate: undefined,
                id: Guid.raw(),
                name: 'Car',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2021-01-01',
                totalCost: 0,
                payPeriodType: 0
            },
            {
                color: 'primary',
                createdDate: '2021-01-01',
                dueDates: ['2021-01-01'],
                endDate: undefined,
                id: Guid.raw(),
                name: 'Food',
                nextDueDate: undefined,
                notes: '',
                paidDates: [],
                payPeriod: 0,
                startDate: '2021-01-01',
                totalCost: 0,
                payPeriodType: 0
            }
        ]

        Sut.updateCalendar(moment('2021-01-01').startOf('month').toDate());

        const monthDay = Sut.monthDays.find(x => x.day === 1);
        expect(monthDay.bills.length).toBe(3);
        expect(monthDay.backgroundColor).toBe('red');

    });

});

describe('formatFromTomDateString', () => {

    test('StartDate after today', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        const futureDate = moment().startOf('day').add(2, 'day');

        const bill: Bill = {
            color: 'primary',
            createdDate: '2020-01-01',
            dueDates: [],
            endDate: undefined,
            id: Guid.raw(),
            name: 'My January Bill',
            nextDueDate: undefined,
            notes: '',
            paidDates: [],
            payPeriod: 0,
            startDate: futureDate.format('YYYY-MM-DD'),
            totalCost: 0,
            payPeriodType: 0
        }

        const result = Sut.formatFromTomDateString(bill);

        expect(result).toStrictEqual(futureDate.toDate());

    });

    test('start date - days before today', () => {

        const Sut = new BillHandler(null, null, null, null, null);

        const futureDate = moment().startOf('day').subtract(10, 'day');

        const bill: Bill = {
            color: 'primary',
            createdDate: '2020-01-01',
            dueDates: [],
            endDate: undefined,
            id: Guid.raw(),
            name: 'My January Bill',
            nextDueDate: undefined,
            notes: '',
            paidDates: [],
            payPeriod: 1,
            startDate: futureDate.format('YYYY-MM-DD'),
            totalCost: 0,
            payPeriodType: 0
        }

        const result = Sut.formatFromTomDateString(bill);

        expect(result).toStrictEqual(futureDate.add(1, 'month').toDate());

    });

});