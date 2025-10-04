export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ExchangeRateResponse;
    const rate = data.rates[toCurrency];
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw new Error('Failed to fetch exchange rate');
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  return amount * rate;
};