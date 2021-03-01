import { Currency } from 'enums/currency';

export function getCurrencies(): Currency[] {
    const currencies: Currency[] =
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

    return currencies
}