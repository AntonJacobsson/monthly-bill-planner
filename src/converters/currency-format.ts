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

    switch(currency) { 
      case "SEK": { 
          return value.toString() + ' kr';
      } 
      case "USD": { 
        return "$" + value.toString();
      }
      case "PHP": { 
        return "₱" + value.toString();
      }
      case "EUR": {
        return "€" + value.toString();
      }
      case "NONE": {
        return value.toString();
      }
      default: { 
         return value.toString();
      } 
   } 

  }
}


