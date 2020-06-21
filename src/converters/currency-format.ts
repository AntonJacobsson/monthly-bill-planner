import {inject} from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { ifError } from 'assert';
@inject(CurrencyService)
  
  export class CurrencyFormatValueConverter {
    private _currencyService: CurrencyService;
    
    constructor(currencyService: CurrencyService) {
        this._currencyService = currencyService;
    }

  toView(value: number) {

    let currency = this._currencyService.getCurrency();
    if(currency === "SEK") {
        return value.toString() + ' kr';
    }
    return "$" + value.toString();

  }
}


