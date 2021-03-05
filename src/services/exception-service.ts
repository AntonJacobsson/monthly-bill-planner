import { inject } from 'aurelia-framework';
import { Guid } from 'guid-typescript';
import { BillService } from './bill-service';
import { CurrencyService } from './currency-service';
import { LanguageService } from './language-service';

@inject(BillService, LanguageService, CurrencyService)
export class ExceptionService {

    private BASE_URL = 'https://api.apispreadsheets.com/data/8915/';

    constructor(private _billService: BillService, private _languageService: LanguageService, private _currencyService: CurrencyService) { }

    public async sendErrorAsync(error: Error, className: string): Promise<string> {

        const callId = Guid.raw();

        const data : ExceptionModel = {
            billJson: JSON.stringify(this._billService.bills),
            currency: this._currencyService.getCurrency(),
            exception: error.message + error.stack,
            language: this._languageService.getLanguage(),
            locale: window.navigator.language,
            planningsJson: JSON.stringify(this._billService.getPlannings()),
            callId
        }

        const response = fetch(this.BASE_URL, {
            method: 'POST',
            body: JSON.stringify({ data })
        });

        return 'If this error is recurring please send a screenshot to contact@moimob.com. Thank you!' + '\n' + callId + ' ' + className;;
    }
}

export class ExceptionModel {
    public exception: string;
    public billJson: string;
    public planningsJson: string;
    public locale: string;
    public currency: string;
    public language: string;
    public callId: string;
}