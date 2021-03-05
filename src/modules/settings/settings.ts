import { inject, observable, NewInstance } from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
import { Currency } from 'enums/currency';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { ContactData } from 'models/contact-data';
import { BillService } from 'services/bill-service';
import { NameValuePair } from 'models/name-value-pair';
import { getCurrencies } from 'functions/currency-functions';
import { CurrentContext } from 'services/current-context';
import { ExceptionService } from 'services/exception-service';
import moment from 'moment';

@inject(CurrencyService, LanguageService, NewInstance.of(ValidationController), BillService, CurrentContext, ExceptionService)

export class Settings {
  private _currencyService: CurrencyService;
  private _languageService: LanguageService;

  @observable public selectedCurrency: string;
  @observable public selectedLanguage: string;
  @observable public selectedReason: string;

  public email: string = '';
  public message: string = '';
  public formSent: boolean = false;
  public formSendFailed: boolean = false;

  public isBusy: boolean = false;
  public reasons: string[] = ['select-a-reason', 'general-question', 'feature-request', 'language-request', 'currency-request', 'problem-with-bills', 'other']
  public languages: NameValuePair[] = [
    { name: 'Svenska', value: 'sv' },
    { name: 'English', value: 'en' },
    { name: 'Türkçe', value: 'tr' }
  ];

  public currencies: Currency[] = getCurrencies();

  constructor(currencyService: CurrencyService, languageService: LanguageService, private _controller: ValidationController, private _billService: BillService, private _currentContext: CurrentContext, private _exceptionService: ExceptionService) {
    this._currencyService = currencyService;
    this._languageService = languageService;

    ValidationRules
      .ensure('email').required().email()
      .ensure('selectedReason').required()
      .ensure('message').required()
      .on(this);
  }

  public async activate(): Promise<void> {

    try {
      this.selectedLanguage = this._languageService.getLanguageFromLocalStorage();
      this.selectedCurrency = this._currencyService.getCurrencyFromLocalStorage();

      const timestamp = moment().unix();
      if(this._currentContext.settingsUnix === 0) {
        this._currentContext.settingsUnix = timestamp;
      }

      if (timestamp - this._currentContext.settingsUnix >= 10) {
        const event = new CustomEvent('openBannerAd', { 'detail': 'Opens banner ad' });
        document.dispatchEvent(event);
        this._currentContext.settingsUnix = timestamp;
      }

    } catch (error) {
      const message = await this._exceptionService.sendErrorAsync(error, Settings.name)
      alert(message);
    }

  }

  public selectedCurrencyChanged(newValue: string, oldValue: string): void {
    if (oldValue !== undefined) {
      this._currencyService.setCurrencyToLocalStorage(newValue);
    }
  }

  public selectedLanguageChanged(newValue: string, oldValue: string): void {
    if (oldValue !== undefined) {
      this._languageService.setLanguageToLocalStorage(newValue);
      window.location.reload();
    }
  }

  public async sumbitForm(): Promise<void> {

    if (this.isBusy === false) {

      const result = await this._controller.validate();
      if (result.valid) {
        this.formSendFailed = false;
        this.isBusy = true;

        const billJson = JSON.stringify(this._billService.getBillsFromLocalStorage('bills'));
        const planningsJson = JSON.stringify(this._billService.getPlanningsFromLocalStorage());

        const data: ContactData = {
          email: this.email,
          message: this.message,
          reason: this.selectedReason,
          billJson,
          planningsJson,
          locale: window.navigator.language,
          createdAt:  new Date().toISOString()
        }

        const response = await fetch('https://api.apispreadsheets.com/data/2963/', {
          method: 'POST',
          body: JSON.stringify({ data })
        });

        if (response.status === 201) {
          this.formSent = true;
        }
        else {
          this.formSendFailed = true;
        }
        this.isBusy = false
      }
    }
  }
}