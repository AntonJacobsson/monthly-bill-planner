import { LanguageService } from 'services/language-service';
import { DateFormatValueConverter } from 'converters/date-format';

describe('toView', () => {
    let languageService: LanguageService;

    beforeEach(() => {
        languageService = new LanguageService();
    });

    test('Swedish', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('sv');

        const Sut = new DateFormatValueConverter(languageService);

        const date = new Date('2020-01-01')
        expect(Sut.toView(date)).toBe('1 jan. 2020')
    });

    test('English', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('en');

        const Sut = new DateFormatValueConverter(languageService);

        const date = new Date('2020-01-01')
        expect(Sut.toView(date)).toBe('Jan 1, 2020')
    });

    test('Turkish', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('tr');

        const Sut = new DateFormatValueConverter(languageService);

        const date = new Date('2020-01-01')
        expect(Sut.toView(date)).toBe('1 Oca 2020')
    });

    test('Date undefined', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('en');

        const Sut = new DateFormatValueConverter(languageService);

        expect(Sut.toView(undefined)).toBe('')
    })

    test('Date null', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue('en');

        const Sut = new DateFormatValueConverter(languageService);

        const date = null;
        expect(Sut.toView(date)).toBe('')
    })

    test('Language is undefined', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue(undefined);

        const Sut = new DateFormatValueConverter(languageService);

        const date = new Date('2020-01-01')
        expect(Sut.toView(date)).toBe('Jan 1, 2020')
    })

    test('Language is null', () => {
        jest.spyOn(languageService, 'getLanguage').mockReturnValue(null);

        const Sut = new DateFormatValueConverter(languageService);

        const date = new Date('2020-01-01')
        expect(Sut.toView(date)).toBe('Jan 1, 2020')
    })
});