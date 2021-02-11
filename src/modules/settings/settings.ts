import { inject, observable, NewInstance } from 'aurelia-framework';
import { CurrencyService } from 'services/currency-service';
import { LanguageService } from 'services/language-service';
import { Currency } from 'models/currency';
import { ValidationRules, ValidationController } from "aurelia-validation";
import { ContactData } from 'models/contact-data';
import { BillService } from 'services/bill-service';
import { NameValuePair } from 'models/name-value-pair';

@inject(CurrencyService, LanguageService, NewInstance.of(ValidationController), BillService)

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
  public reasons: string[] = ["select-a-reason", "general-question", "feature-request", "language-request", "currency-request", "problem-with-bills", "other"]
  public languages: NameValuePair[] = [
    { name: 'Svenska', value: 'sv' },
    { name: 'English', value: 'en' },
    { name: 'Türkçe', value: 'tr' },
  ];

  public currencies: string[] =
    [
      Currency.USD,
      Currency.EUR,
      Currency.JPY,
      Currency.GBP,
      Currency.AUD,
      Currency.CAD,
      Currency.CHF,
      Currency.CNY,
      Currency.SEK,
      Currency.MXN,
      Currency.PHP,
      Currency.MYR,
      Currency.TRY,
      Currency.INR,
      Currency.NONE
    ];

  constructor(currencyService: CurrencyService, languageService: LanguageService, private _controller: ValidationController, private _billService: BillService) {
    this._currencyService = currencyService;
    this._languageService = languageService;

    ValidationRules
      .ensure("email").required().email()
      .ensure("selectedReason").required()
      .ensure("message").required()
      .on(this);
  }

  public activate(): void {
    this.selectedLanguage = this._languageService.getLanguageFromLocalStorage();
    this.selectedCurrency = this._currencyService.getCurrencyFromLocalStorage();

    let event = new CustomEvent("openBannerAd", { "detail": "Opens banner ad" });
    document.dispatchEvent(event);
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

    if (this.isBusy == false) {

      let result = await this._controller.validate();
      if (result.valid) {
        this.formSendFailed = false;
        this.isBusy = true;

        let billJson = JSON.stringify(this._billService.getBillsFromLocalStorage("bills"));
        let planningsJson = JSON.stringify(this._billService.getPlanningsFromLocalStorage());

        let data: ContactData = {
          email: this.email,
          message: this.message,
          reason: this.selectedReason,
          billJson: billJson,
          planningsJson: planningsJson,
          locale: window.navigator.language,
          createdAt:  new Date().toISOString(),
        }

        let response = await fetch("https://api.apispreadsheets.com/data/2963/", {
          method: "POST",
          body: JSON.stringify({ data }),
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