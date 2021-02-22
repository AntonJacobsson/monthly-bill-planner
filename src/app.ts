import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
@inject(I18N, CurrencyService, LanguageService)

export class App {
  public router: Router;

  constructor(private _i18n: I18N, private _currencyService: CurrencyService, private _languageService: LanguageService) {

    if (this._languageService.getLanguageFromLocalStorage() === null) {
      let translationLanguage = 'en';
      if (window.navigator.language.slice(0, 2) === 'sv') {
        translationLanguage = 'sv';
      }
      if (window.navigator.language.slice(0, 2) === 'tr') {
        translationLanguage = 'tr';
      }
      this._languageService.setLanguageToLocalStorage(translationLanguage);
    }

    if (this._currencyService.getCurrencyFromLocalStorage() === null) {
      let currency = 'USD';
      if (this._languageService.getLanguage() === 'sv') {
        currency = 'SEK';
      }
      this._currencyService.setCurrencyToLocalStorage(currency);
    }
  }

  public async activate(): Promise<void> {
    await this._i18n.setLocale(this._languageService.getLanguage());
  }

  public toggleFAQ(): void {
    if (this.router.currentInstruction.config.route === 'faq') {
      this.router.navigateBack();
    } else {
      this.router.navigateToRoute('faq');
    }

  };

  public configureRouter(config: RouterConfiguration, router: Router): void {

    config.map([
      { route: ['settings'], name: 'settings', moduleId: PLATFORM.moduleName('modules/settings/settings'), nav: true, title: this._i18n.tr('routes.settings') },
      { route: ['', 'bill-handler'], name: 'bill-handler', moduleId: PLATFORM.moduleName('modules/bill-handler/bill-handler'), nav: true, title: this._i18n.tr('routes.bill-handler') },
      { route: ['monthly-expenses'], name: 'monthly-expenses', moduleId: PLATFORM.moduleName('modules/monthly-expenses/monthly-expenses'), nav: true, title: this._i18n.tr('routes.monthly-expenses') },
      { route: ['faq'], name: 'faq', moduleId: PLATFORM.moduleName('modules/faq/faq'), nav: false, title: 'FAQ' }
    ]);
    this.router = router;
  }
}
