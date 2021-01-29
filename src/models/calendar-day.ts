export class CalendarDay {
    public day: number;
    public isActive: boolean;
    public backgroundColor: string;
    public bills: CalendarDayBill[];
}

export class CalendarDayBill {
    public name: string;
    public totalCost: number;
    public isPaid: boolean;
    public date: string;
    public id: string;
}