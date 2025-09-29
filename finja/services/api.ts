// services/api.ts
import { ExchangeRates, AssetPrices } from '@/types';
import { DEFAULT_EXCHANGE_RATES, DEFAULT_ASSET_PRICES } from '@/constants';

export const api = {
  async fetchExchangeRates(): Promise<ExchangeRates> {
    try {
      const response = await fetch('https://api.monobank.ua/bank/currency', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Monobank API failed');
      }

      const data = await response.json();
      const rates: ExchangeRates = { ...DEFAULT_EXCHANGE_RATES };

      for (const currency of data) {
        // USD/UAH - currency code 840 (USD) to 980 (UAH)
        if (currency.currencyCodeA === 840 && currency.currencyCodeB === 980) {
          rates.USD = currency.rateBuy || currency.rateCross || DEFAULT_EXCHANGE_RATES.USD;
        }
        // EUR/UAH - currency code 978 (EUR) to 980 (UAH)
        else if (currency.currencyCodeA === 978 && currency.currencyCodeB === 980) {
          rates.EUR = currency.rateBuy || currency.rateCross || DEFAULT_EXCHANGE_RATES.EUR;
        }
      }

      // USDT usually equals USD
      rates.USDT = rates.USD;

      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  },

  async fetchAssetPrices(): Promise<AssetPrices> {
    try {
      // Fetch cryptocurrency prices
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
        { method: 'GET' }
      );

      if (!cryptoResponse.ok) {
        throw new Error('CoinGecko API failed');
      }

      const cryptoData = await cryptoResponse.json();
      const assets: AssetPrices = {
        BTC: cryptoData.bitcoin?.usd || DEFAULT_ASSET_PRICES.BTC,
        ETH: cryptoData.ethereum?.usd || DEFAULT_ASSET_PRICES.ETH,
        XAU: DEFAULT_ASSET_PRICES.XAU,
        XAG: DEFAULT_ASSET_PRICES.XAG,
      };

      // Try to fetch metals prices (may fail with demo API key)
      try {
        const metalsResponse = await fetch(
          'https://api.metals.dev/v1/latest?api_key=DEMO&currency=USD&unit=toz',
          { method: 'GET' }
        );

        if (metalsResponse.ok) {
          const metalsData = await metalsResponse.json();
          if (metalsData.metals) {
            assets.XAU = metalsData.metals.gold || DEFAULT_ASSET_PRICES.XAU;
            assets.XAG = metalsData.metals.silver || DEFAULT_ASSET_PRICES.XAG;
          }
        }
      } catch (metalsError) {
        console.warn('Metals API failed, using defaults:', metalsError);
      }

      return assets;
    } catch (error) {
      console.error('Error fetching asset prices:', error);
      throw error;
    }
  },
};