import { inject } from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { Currency } from 'enums/currency';
@inject(CurrencyService)

export class CurrencyFormatValueConverter {
  private _currencyService: CurrencyService;

  constructor(currencyService: CurrencyService) {
    this._currencyService = currencyService;
  }

  public toView(value: number): string {

    const currency = this._currencyService.getCurrency();

    switch (currency) {
      case Currency.USD: {
        return '$' + value.toString();
      }
      case Currency.EUR: {
        return '€' + value.toString();
      }
      case Currency.JPY: {
        return '¥' + value.toString();
      }
      case Currency.GBP: {
        return '£' + value.toString();
      }
      case Currency.AUD: {
        return '$' + value.toString();
      }
      case Currency.CAD: {
        return '$' + value.toString();
      }
      case Currency.CHF: {
        return 'fr. ' + value.toString();
      }
      case Currency.CNY: {
        return '¥' + value.toString();
      }
      case Currency.SEK: {
        return value.toString() + ' kr';
      }
      case Currency.MXN: {
        return '$' + value.toString();
      }
      case Currency.PHP: {
        return '₱' + value.toString();
      }
      case Currency.MYR: {
        return 'RM ' + value.toString();
      }
      case Currency.TRY: {
        return value.toString() + ' ₺';
      }
      case Currency.INR: {
        return '₹' + value.toString();
      }
      case Currency.NONE: {
        return value.toString();
      }
      default: {
        return value.toString();
      }
    }
  }
}
