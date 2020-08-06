import {inject} from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
import { observable } from 'aurelia-framework';
@inject(CurrencyService, LanguageService)

export class Settings {
    private _currencyService: CurrencyService;
    private _languageService: LanguageService;
    
    public currencies: string[] = ['USD', 'EUR', 'SEK', 'PHP', 'NONE'];
    public languages: any[] = [{name: 'Svenska', locale: 'sv'}, {name: 'English', locale: 'en'} ];

    @observable public selectedCurrency: string;
    @observable public selectedLanguage: string;

  constructor(currencyService: CurrencyService, languageService: LanguageService) {
    this._currencyService = currencyService;
    this._languageService = languageService;
  }

  activate() {
    this.selectedLanguage = this._languageService.getLanguageFromLocalStorage();
    this.selectedCurrency = this._currencyService.getCurrencyFromLocalStorage();
  }

  selectedCurrencyChanged(newValue: string, oldValue: any) {
    if(oldValue !== undefined) {
      this._currencyService.setCurrencyToLocalStorage(newValue);
    }
    
  }

  selectedLanguageChanged(newValue: any, oldValue: any) {
    if(oldValue !== undefined) {
      this._languageService.setLanguageToLocalStorage(newValue);
      window.location.reload();
    }
    
  }

}