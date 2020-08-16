import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from "aurelia-framework";
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
@inject(I18N, CurrencyService, LanguageService)


export class App {
  private _i18n: I18N;
  private _currencyService: CurrencyService;
  private _languageService: LanguageService;
  public router: Router;

  constructor(i18n: I18N, currencyService: CurrencyService, languageService: LanguageService) {
    this._i18n = i18n;
    this._currencyService = currencyService;
    this._languageService = languageService;

    if(this._languageService.getLanguageFromLocalStorage() === null) {
      let translationLanguage = 'en';
      if (window.navigator.language.slice(0, 2) === 'sv') {       
        translationLanguage = 'sv';
      }
      this._languageService.setLanguageToLocalStorage(translationLanguage);
    }
    
    if(this._currencyService.getCurrencyFromLocalStorage() === null) {
      let currency = 'USD';
      if (this._languageService.getLanguage() === 'sv') {       
        currency = 'SEK';
      }
      this._currencyService.setCurrencyToLocalStorage(currency);
    }
  }

  async activate() {
    await this._i18n.setLocale(this._languageService.getLanguage());
  }
  
  configureRouter(config: RouterConfiguration, router: Router): void {

    config.map([
      { route: ['settings'], name: 'settings', moduleId: PLATFORM.moduleName('modules/settings/settings'), nav: true, title: this._i18n.tr("routes.settings") },
      { route: ['', 'bill-handler'], name: 'bill-handler', moduleId: PLATFORM.moduleName('modules/bill-handler/bill-handler'), nav: true, title: this._i18n.tr("routes.bill-handler") },
      { route: ['saving-statistics'], name: 'saving-statistics', moduleId: PLATFORM.moduleName('modules/saving-statistics/saving-statistics'), nav: true, title: this._i18n.tr("routes.saving-statistics") },
    ]);
    this.router = router;
  }
}
