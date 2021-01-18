export class CurrencyService {

    private selectedCurrency: string;

    constructor() {
        let response = this.getCurrencyFromLocalStorage();
        if (response !== null) {
            this.selectedCurrency = response;
        }
    }

    public getCurrencyFromLocalStorage(): string {
        let data = localStorage.getItem('currency');
        if (data !== null) {
            return data;
        }
        return null;
    }

    public getCurrency(): string {
        return this.selectedCurrency;
    }

    public setCurrencyToLocalStorage(language: string): void {
        this.selectedCurrency = language
        localStorage.removeItem('currency')
        localStorage.setItem('currency', this.selectedCurrency);
    }
}