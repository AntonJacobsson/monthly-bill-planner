import { getBillDueDates, getPeriodStringFromEnum } from 'functions/date-functions';
import { Bill } from 'models/bill';
import { PayPeriodType } from 'enums/pay-period-type';

describe('getPeriodStringFromEnum', () => {

    test('Month', () => {
        const result = getPeriodStringFromEnum(PayPeriodType.Month);
        expect(result).toBe('month')
    })
    test('Week', () => {
        const result = getPeriodStringFromEnum(PayPeriodType.Week);
        expect(result).toBe('week')
    })
    test('undefined', () => {
        const result = getPeriodStringFromEnum(undefined);
        expect(result).toBe('month')
    })
    test('null', () => {
        const result = getPeriodStringFromEnum(null);
        expect(result).toBe('month')
    })
});

describe('getBillDueDates', () => {

    test('non recurring', () => {

        const bill : Bill = {
            color: '',
            createdDate: '',
            dueDates: [],
            totalCost: 0,
            id: '',
            name: '',
            nextDueDate: undefined,
            notes: '',
            paidDates: [],

            startDate: '2021-01-01',
            endDate: undefined,
            payPeriod: 0,
            payPeriodType: 0
        }

        const result = getBillDueDates(bill, '2030-01-01');
        expect(result).toHaveLength(1);
    })

    test('recurring monthly with endDate', () => {

        const bill : Bill = {
            color: '',
            createdDate: '',
            dueDates: [],
            totalCost: 0,
            id: '',
            name: '',
            nextDueDate: undefined,
            notes: '',
            paidDates: [],

            startDate: '2021-01-01',
            endDate: '2022-01-01',
            payPeriod: 1,
            payPeriodType: 0
        }

        const result = getBillDueDates(bill, '2030-01-01');
        expect(result).toHaveLength(12);
    })

    test('recurring weekly with endDate', () => {

        const bill : Bill = {
            color: '',
            createdDate: '',
            dueDates: [],
            totalCost: 0,
            id: '',
            name: '',
            nextDueDate: undefined,
            notes: '',
            paidDates: [],

            startDate: '2021-01-01',
            endDate: '2022-01-01',
            payPeriod: 1,
            payPeriodType: 1
        }

        const result = getBillDueDates(bill, '2030-01-01');
        expect(result).toHaveLength(53);
    })
});