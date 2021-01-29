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

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("$100")
    })

    test(Currency.EUR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.EUR);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("€100")
    })

    test(Currency.JPY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.JPY);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("¥100")
    })

    test(Currency.GBP, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.GBP);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("£100")
    })

    test(Currency.AUD, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.AUD);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("$100")
    })

    test(Currency.CAD, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CAD);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("$100")
    })

    test(Currency.CHF, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CHF);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("fr. 100")
    })

    test(Currency.CNY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.CNY);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("¥100")
    })

    test(Currency.SEK, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.SEK);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100 kr")
    })

    test(Currency.MXN, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.MXN);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("$100")
    })

    test(Currency.PHP, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.PHP);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("₱100")
    })

    test(Currency.MYR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.MYR);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("RM 100")
    })

    test(Currency.TRY, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.TRY);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100 ₺")
    })

    test(Currency.INR, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.INR);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("₹100")
    })

    test(Currency.NONE, () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(Currency.NONE);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100")
    })

    test('Empty string', () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue("");

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100")
    })

    test('null', () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(null);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100")
    })

    test("undefined", () => {
        jest.spyOn(currencyService, 'getCurrency').mockReturnValue(undefined);

        let Sut = new CurrencyFormatValueConverter(currencyService);
        expect(Sut.toView(100)).toBe("100")
    })
});
