// constants/index.ts
import { Currency } from '@/types';

export const CACHE_DURATION = 300000; // 5 minutes

export const ASSET_SYMBOLS = {
  BTC: '₿',
  ETH: 'Ξ',
  XAU: '🥇',
  XAG: '🥈',
} as const;

export const CURRENCY_EMOJIS: Record<Currency, string> = {
  UAH: '🇺🇦',
  USD: '💵',
  EUR: '💶',
  USDT: '💠',
};

export const CURRENCY_COLORS: Record<Currency, string> = {
  UAH: '#005BBB',
  USD: '#228B22',
  EUR: '#4169E1',
  USDT: '#26A69A',
};

export const DEFAULT_SAVINGS = {
  UAH: 0,
  USD: 0,
  EUR: 0,
  USDT: 0,
};

export const DEFAULT_EXCHANGE_RATES = {
  UAH: 1,
  USD: 37,
  EUR: 40,
  USDT: 37,
};

export const DEFAULT_ASSET_PRICES = {
  BTC: 50000,
  ETH: 3000,
  XAU: 2000,
  XAG: 25,
};

export const STORAGE_KEYS = {
  SAVINGS: 'finja_savings',
  USER_STATS: 'finja_user_stats',
  EXCHANGE_RATES: 'finja_exchange_rates',
  ASSET_PRICES: 'finja_asset_prices',
  LAST_RATE_UPDATE: 'finja_last_rate_update',
  LAST_ASSET_UPDATE: 'finja_last_asset_update',
} as const;