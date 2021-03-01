import { Currency } from 'enums/currency';

export class CurrencyService {

    private selectedCurrency: string;

    constructor() {
        const response = this.getCurrencyFromLocalStorage();
        this.selectedCurrency = (response !== null) ? response : Currency.USD;
    }

    public getCurrencyFromLocalStorage(): string {
        const data = localStorage.getItem('currency');
        if (data !== null) {
            return data;
        }
        return null;
    }

    public getCurrency(): string {
        return this.selectedCurrency;
    }

    public setCurrencyToLocalStorage(currency: string): void {
        this.selectedCurrency = currency
        localStorage.removeItem('currency')
        localStorage.setItem('currency', this.selectedCurrency);
    }
}