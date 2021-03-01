import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { Currency } from 'enums/currency';
import { getCurrencies } from 'functions/currency-functions';
import { CurrencyService } from 'services/currency-service';

@inject(DialogController, CurrencyService)
export class WelcomeModal {
    public controller: DialogController;

    public selectedCurrency: Currency;
    public currencies: Currency[] = getCurrencies();

    constructor(controller: DialogController, private _currencyService: CurrencyService) {
        this.controller = controller;
    }

    public saveCurrency(): void {
        this._currencyService.setCurrencyToLocalStorage(this.selectedCurrency);
        this.controller.ok();
    }
}