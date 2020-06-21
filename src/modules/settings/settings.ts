import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
@inject(I18N, CurrencyService, LanguageService)

export class Settings {
    private _i18n: I18N;
    private _currencyService: CurrencyService;
    private _languageService: LanguageService;
    
    public translation: string;
    public language: string;
    public languageFromService: string;
    public currency: string;

  constructor(i18n: I18N, currencyService: CurrencyService, languageService: LanguageService) {
    this._i18n = i18n;
    this._currencyService = currencyService;
    this._languageService = languageService;

  }

  activate() {
    this.translation = this._i18n.getLocale();
    this.language = window.navigator.language;
    this.languageFromService = this._languageService.getLanguageFromLocalStorage();
    this.currency = this._currencyService.getCurrencyFromLocalStorage();
  }


}