export class Planning {
    public name: string;
    public key: number;
    public billOrder: BillOrderDictionary[];
    public sort: string;
}

export class PlanningRequest {
    public name: string;
}

export class BillOrderDictionary {
    public id: string;
    public value: number;
}