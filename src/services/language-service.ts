export class LanguageService {

    private selectedLanguage: string;

    constructor() {
        var response = this.getLanguageFromLocalStorage();
        if(response !== null) {
          this.selectedLanguage = response;
        }
    }

    getLanguageFromLocalStorage(): string {
        var data = localStorage.getItem('language');
      if (data !== null) {
          return data;
      }
      return null;
    }

    getLanguage(): string {
        return this.selectedLanguage;
    }

    setLanguageToLocalStorage(language: string) {
        this.selectedLanguage = language
        localStorage.removeItem('language')
        localStorage.setItem('language', this.selectedLanguage);
    }
}