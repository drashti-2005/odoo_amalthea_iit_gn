import { useState, useEffect } from 'react';

interface Country {
  name: {
    common: string;
    official: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
}

interface CountryOption {
  name: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  } | null;
}

export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data: Country[] = await response.json();
        
        const formattedCountries: CountryOption[] = data
          .map(country => {
            // Get the first currency if available
            const currencyKeys = country.currencies ? Object.keys(country.currencies) : [];
            const firstCurrencyKey = currencyKeys[0];
            const currency = firstCurrencyKey && country.currencies
              ? {
                  code: firstCurrencyKey,
                  name: country.currencies[firstCurrencyKey].name,
                  symbol: country.currencies[firstCurrencyKey].symbol || firstCurrencyKey
                }
              : null;

            return {
              name: country.name.common,
              currency
            };
          })
          .filter(country => country.currency !== null) // Only include countries with currencies
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        setCountries(formattedCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again.');
        
        // Fallback to a minimal list of common countries
        setCountries([
          { name: 'United States', currency: { code: 'USD', name: 'US Dollar', symbol: '$' } },
          { name: 'United Kingdom', currency: { code: 'GBP', name: 'British Pound Sterling', symbol: '£' } },
          { name: 'Canada', currency: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' } },
          { name: 'Australia', currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' } },
          { name: 'Germany', currency: { code: 'EUR', name: 'Euro', symbol: '€' } },
          { name: 'France', currency: { code: 'EUR', name: 'Euro', symbol: '€' } },
          { name: 'India', currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' } },
          { name: 'Japan', currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' } },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
}