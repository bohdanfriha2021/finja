// utils/currency.ts
import { Currency } from '@/types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrencyInput = (text: string): { amount: number; currency: Currency } | null => {
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*usd|(\d+(?:\.\d+)?)\s*\$/i, currency: 'USD' as Currency },
    { regex: /(\d+(?:\.\d+)?)\s*eur|(\d+(?:\.\d+)?)\s*€/i, currency: 'EUR' as Currency },
    { regex: /(\d+(?:\.\d+)?)\s*uah|(\d+(?:\.\d+)?)\s*грн|(\d+(?:\.\d+)?)\s*₴/i, currency: 'UAH' as Currency },
    { regex: /(\d+(?:\.\d+)?)\s*usdt/i, currency: 'USDT' as Currency },
    { regex: /(\d+(?:\.\d+)?)\s*u(?!sd)/i, currency: 'USD' as Currency },
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      let amount: number | null = null;
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          amount = parseFloat(match[i]);
          break;
        }
      }

      if (amount && amount > 0) {
        return { amount, currency: pattern.currency };
      }
    }
  }

  return null;
};