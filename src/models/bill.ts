export class Bill {
    public id: string;
    public payPeriod: number;
    public payPeriodType: number;
    public name: string;
    public totalCost: number;
    public createdDate: string;
    public startDate: string;
    public endDate: string;
    public notes: string;
    public color: string;
    public paidDates: string[];

    public nextDueDate: Date;
    public dueDates: string[];
}