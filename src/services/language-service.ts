export class LanguageService {

    private selectedLanguage: string;

    constructor() {
        let response = this.getLanguageFromLocalStorage();
        if (response !== null) {
            this.selectedLanguage = response;
        }
    }

    public getLanguageFromLocalStorage(): string {
        let data = localStorage.getItem('language');
        if (data !== null) {
            return data;
        }
        return null;
    }

    public getLanguage(): string {
        return this.selectedLanguage;
    }

    public setLanguageToLocalStorage(language: string): void {
        this.selectedLanguage = language
        localStorage.removeItem('language')
        localStorage.setItem('language', this.selectedLanguage);
    }
}