import { inject } from 'aurelia-framework';
import { LanguageService } from 'services/language-service';
@inject(LanguageService)

export class DateFormatValueConverter {
    private readonly _options = { year: 'numeric', month: 'short', day: 'numeric' };

    constructor(private _languageService: LanguageService) { }

    public toView(date: Date): string {
        if(date === undefined || date === null) {
            return '';
        }

        let language = this._languageService.getLanguage();

        if(language === undefined || language === null) {
            language = 'en'
        };

        return date.toLocaleString(language, this._options)
    }
}
