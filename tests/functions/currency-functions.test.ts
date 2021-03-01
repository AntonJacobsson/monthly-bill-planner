import { getCurrencies } from 'functions/currency-functions';

describe('getCurrencies', () => {

    test('get count', () => {
        const result = getCurrencies();
        expect(result).toHaveLength(15);
    })
});