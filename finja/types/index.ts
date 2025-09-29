// types/index.ts
export type Currency = 'UAH' | 'USD' | 'EUR' | 'USDT';

export interface ExchangeRates {
  UAH: number;
  USD: number;
  EUR: number;
  USDT: number;
}

export interface AssetPrices {
  BTC: number;
  ETH: number;
  XAU: number;
  XAG: number;
}

export interface Savings {
  UAH: number;
  USD: number;
  EUR: number;
  USDT: number;
}

export interface UserStats {
  firstInteraction: string;
  lastInteraction: string;
  totalInteractions: number;
  streakDays: number;
  lastStreakDate?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export interface PortfolioData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface AssetEquivalent {
  BTC: number;
  ETH: number;
  XAU: number;
  XAG: number;
}

export interface Totals {
  totalUAH: number;
  totalUSD: number;
  totalEUR: number;
}