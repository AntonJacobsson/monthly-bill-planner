export class CurrencyService {

    private selectedCurrency: string;

    constructor() {
        var response = this.getCurrencyFromLocalStorage();
        if(response !== null) {
          this.selectedCurrency = response;
        }
    }

    getCurrencyFromLocalStorage(): string {
    var data = localStorage.getItem('currency');
      if (data !== null) {
          return data;
      }
      return null;
    }

    getCurrency(): string {
        return this.selectedCurrency;
    }

    setCurrencyToLocalStorage(language: string) {
        this.selectedCurrency = language
        localStorage.removeItem('currency')
        localStorage.setItem('currency', this.selectedCurrency);
    }
}