import { Guid } from 'guid-typescript';
import { Bill } from 'models/bill';
import { BillMonthRow, MonthlyExpenses } from 'modules/monthly-expenses/monthly-expenses';

const defaultBill: Bill = {
    color: 'primary',
    createdDate: '2020-01-01',
    dueDates: [],
    endDate: undefined,
    id: Guid.EMPTY,
    name: 'My Bill',
    nextDueDate: undefined,
    notes: '',
    paidDates: [],
    payPeriod: 0,
    startDate: '2020-02-01',
    totalCost: 0,
    payPeriodType: 0
}

const defaultBillMonthRow: BillMonthRow = {
    bills: [],
    dataset: [],
    isFlipped: false,
    month: 1
}

describe('totalMonthCost', () => {

    test('Empty List', () => {

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.totalMonthCost([])).toBe(0)
    });

    test('Should be sum of all costs', () => {

        const bill1 = { ...defaultBill };
        bill1.totalCost = 3000;

        const bill2 = { ...defaultBill };
        bill2.totalCost = 500;

        const bills: Bill[] = [
            bill1, bill2
        ]

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.totalMonthCost(bills)).toBe(3500)
    });
});

describe('getBillYears', () => {
    test('Empty List', () => {

        const Sut = new MonthlyExpenses(null, null);

        const currentYear = new Date().getFullYear();

        expect(Sut.getBillYears([])).toEqual([currentYear])
    });

    test('Only startDate', () => {

        const bill = { ...defaultBill };

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.getBillYears([bill])).toEqual([2020])
    });

    test('Start and EndDate', () => {

        const bill = { ...defaultBill };
        bill.endDate = '2022-01-01'

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.getBillYears([bill])).toEqual([2020, 2021, 2022])
    });

    test('Start and EndDate With Gap', () => {

        const bill = { ...defaultBill };
        bill.endDate = '2022-01-01'

        const bill2 = { ...defaultBill };
        bill2.startDate = '2024-01-01'
        bill2.endDate = '2026-01-01'

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.getBillYears([bill, bill2])).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026])
    });

});

describe('flipCard', () => {
    test('No bills should not flip', () => {

        const Sut = new MonthlyExpenses(null, null);

        Sut.flipCard(defaultBillMonthRow, 0);

        expect(defaultBillMonthRow.isFlipped).toBe(false);
    });

    test('Bills in list, should flip', () => {

        const bill = { ...defaultBill };
        const billMonthRow = { ...defaultBillMonthRow };

        billMonthRow.bills = [bill]

        const Sut = new MonthlyExpenses(null, null);

        Sut.flipCard(billMonthRow, 0);

        expect(billMonthRow.isFlipped).toBe(true);
    });
});

describe('filterBillMonthRows', () => {

    test('1 non-recurring, do not split cost', () => {

        const bill = { ...defaultBill };

        const Sut = new MonthlyExpenses(null, null);
        Sut.selectedYear = 2020;
        Sut.billMonthRows = [
            { month: 1, dataset: [], bills: [], isFlipped: false },
            { month: 2, dataset: [], bills: [], isFlipped: false },
            { month: 3, dataset: [], bills: [], isFlipped: false },
            { month: 4, dataset: [], bills: [], isFlipped: false },
            { month: 5, dataset: [], bills: [], isFlipped: false },
            { month: 6, dataset: [], bills: [], isFlipped: false },
            { month: 7, dataset: [], bills: [], isFlipped: false },
            { month: 8, dataset: [], bills: [], isFlipped: false },
            { month: 9, dataset: [], bills: [], isFlipped: false },
            { month: 10, dataset: [], bills: [], isFlipped: false },
            { month: 11, dataset: [], bills: [], isFlipped: false },
            { month: 12, dataset: [], bills: [], isFlipped: false }
        ];

        Sut.filterBillMonthRows(bill);

        expect(Sut.billMonthRows[1].bills.length).toBeGreaterThan(0);
        expect(Sut.billMonthRows[1].bills[0].totalCost).toBe(bill.totalCost);
    });

    test('1 in other year', () => {

        const bill = { ...defaultBill };

        const Sut = new MonthlyExpenses(null, null);

        Sut.selectedYear = 2022;
        Sut.billMonthRows = [
            { month: 1, dataset: [], bills: [], isFlipped: false },
            { month: 2, dataset: [], bills: [], isFlipped: false },
            { month: 3, dataset: [], bills: [], isFlipped: false },
            { month: 4, dataset: [], bills: [], isFlipped: false },
            { month: 5, dataset: [], bills: [], isFlipped: false },
            { month: 6, dataset: [], bills: [], isFlipped: false },
            { month: 7, dataset: [], bills: [], isFlipped: false },
            { month: 8, dataset: [], bills: [], isFlipped: false },
            { month: 9, dataset: [], bills: [], isFlipped: false },
            { month: 10, dataset: [], bills: [], isFlipped: false },
            { month: 11, dataset: [], bills: [], isFlipped: false },
            { month: 12, dataset: [], bills: [], isFlipped: false }
        ];
        Sut.filterBillMonthRows(bill);

        Sut.billMonthRows.forEach(element => {
            expect(element.bills).toHaveLength(0);
        });

    });

    test('1 repeat every month', () => {

        const bill = { ...defaultBill };
        bill.startDate = '2020-01-01';
        bill.endDate = '2020-12-31';
        bill.payPeriod = 1;
        bill.totalCost = 1000;

        const Sut = new MonthlyExpenses(null, null);

        Sut.selectedYear = 2020;
        Sut.billMonthRows = [
            { month: 1, dataset: [], bills: [], isFlipped: false },
            { month: 2, dataset: [], bills: [], isFlipped: false },
            { month: 3, dataset: [], bills: [], isFlipped: false },
            { month: 4, dataset: [], bills: [], isFlipped: false },
            { month: 5, dataset: [], bills: [], isFlipped: false },
            { month: 6, dataset: [], bills: [], isFlipped: false },
            { month: 7, dataset: [], bills: [], isFlipped: false },
            { month: 8, dataset: [], bills: [], isFlipped: false },
            { month: 9, dataset: [], bills: [], isFlipped: false },
            { month: 10, dataset: [], bills: [], isFlipped: false },
            { month: 11, dataset: [], bills: [], isFlipped: false },
            { month: 12, dataset: [], bills: [], isFlipped: false }
        ];

        Sut.filterBillMonthRows(bill);

        Sut.billMonthRows.forEach(element => {
            expect(element.bills.length).toBe(1);
            expect(element.bills[0].totalCost).toBe(bill.totalCost);
        });
    });

});

describe('getMonthString', () => {

    test('All months', () => {

        const Sut = new MonthlyExpenses(null, null);

        expect(Sut.getMonthString(0)).toBe(undefined)
        expect(Sut.getMonthString(1)).toBe('months.january')
        expect(Sut.getMonthString(2)).toBe('months.february')
        expect(Sut.getMonthString(3)).toBe('months.march')
        expect(Sut.getMonthString(4)).toBe('months.april')
        expect(Sut.getMonthString(5)).toBe('months.may')
        expect(Sut.getMonthString(6)).toBe('months.june')
        expect(Sut.getMonthString(7)).toBe('months.july')
        expect(Sut.getMonthString(8)).toBe('months.august')
        expect(Sut.getMonthString(9)).toBe('months.september')
        expect(Sut.getMonthString(10)).toBe('months.october')
        expect(Sut.getMonthString(11)).toBe('months.november')
        expect(Sut.getMonthString(12)).toBe('months.december')
        expect(Sut.getMonthString(13)).toBe(undefined)
    });
});