import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from "aurelia-framework";
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
import * as Hammer from 'hammerjs';
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
  attached() {
    var myElement = document.getElementById('myElement');
    var mc = new Hammer(myElement);

    
    mc.on("panleft panright", (ev) => {
      var test = document.getElementById('section');
      
      test.style.transform = 'translateX(' + (ev.deltaX / 2) + 'px)';
            console.log(ev.type + " gesture detected.");
            console.log(ev.deltaX);
            console.log(this.router.currentInstruction.config.name);

    });

    mc.on("panend", (ev) => {
      var value = 150;
      var negativeValue = value * -1;
      var test = document.getElementById('section');
      switch (this.router.currentInstruction.config.name) {
        case "settings":
          if (ev.deltaX < negativeValue) {
            this.router.navigateToRoute('bill-handler');
          }
          break;
        case "bill-handler":
            if (ev.deltaX < negativeValue) {
              this.router.navigateToRoute('saving-statistics');
            }
            if (ev.deltaX > value) {
              this.router.navigateToRoute('settings');
            }
            break;
            case "saving-statistics":
              if (ev.deltaX > value) {
                this.router.navigateToRoute('bill-handler');
              }
              break;
      
        default:
          break;
      }

      test.style.transform = 'inherit';
     });
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
