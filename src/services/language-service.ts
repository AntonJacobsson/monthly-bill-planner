export class LanguageService {

    private selectedLanguage: string;

    constructor() {
        const response = this.getLanguageFromLocalStorage();
        this.selectedLanguage = (response !== null) ? response : 'en'
    }

    public getLanguageFromLocalStorage(): string {
        const data = localStorage.getItem('language');
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