import { Currency } from '../../src/models/currency';
import { CurrencyService } from '../../src/services/currency-service';
import { CurrencyFormatValueConverter } from '../../src/converters/currency-format'

describe('toView', () => {
    let currencyService: CurrencyService;

    beforeEach(() => {
        currencyService = new CurrencyService();
    });

    test(Currency.USD, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.USD);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('$100')
    })

    test(Currency.EUR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.EUR);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('€100')
    })

    test(Currency.JPY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.JPY);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('¥100')
    })

    test(Currency.GBP, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.GBP);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('£100')
    })

    test(Currency.AUD, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.AUD);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('$100')
    })

    test(Currency.CAD, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CAD);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('$100')
    })

    test(Currency.CHF, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CHF);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('fr. 100')
    })

    test(Currency.CNY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CNY);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('¥100')
    })

    test(Currency.SEK, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.SEK);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100 kr')
    })

    test(Currency.MXN, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.MXN);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('$100')
    })

    test(Currency.PHP, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.PHP);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('₱100')
    })

    test(Currency.MYR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.MYR);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('RM 100')
    })

    test(Currency.TRY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.TRY);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100 ₺')
    })

    test(Currency.INR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.INR);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('₹100')
    })

    test(Currency.NONE, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.NONE);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100')
    })

    test('Empty string', () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue('');

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100')
    })

    test('null', () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(null);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100')
    })

    test('undefined', () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(undefined);

        const Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe('100')
    })
});
