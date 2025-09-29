// utils/calculations.ts
import { Savings, ExchangeRates, AssetPrices, Totals, AssetEquivalent } from '@/types';

export const calculateTotals = (
  savings: Savings,
  exchangeRates: ExchangeRates
): Totals => {
  const totalUAH =
    savings.UAH * exchangeRates.UAH +
    savings.USD * exchangeRates.USD +
    savings.EUR * exchangeRates.EUR +
    savings.USDT * exchangeRates.USDT;

  const totalUSD = totalUAH / exchangeRates.USD;
  const totalEUR = totalUAH / exchangeRates.EUR;

  return { totalUAH, totalUSD, totalEUR };
};

export const calculateAssetEquivalents = (
  totalUSD: number,
  assetPrices: AssetPrices
): AssetEquivalent => {
  return {
    BTC: totalUSD / assetPrices.BTC,
    ETH: totalUSD / assetPrices.ETH,
    XAU: totalUSD / assetPrices.XAU,
    XAG: totalUSD / assetPrices.XAG,
  };
};

export const updateStreak = (lastStreakDate: string | undefined): number => {
  const now = new Date();
  const lastDate = lastStreakDate ? new Date(lastStreakDate) : null;

  if (!lastDate) {
    return 1;
  }

  const daysDiff = Math.floor(
    (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) {
    // Same day, don't change streak
    return -1; // Signal to keep current streak
  } else if (daysDiff === 1) {
    // Next day, increment streak
    return -2; // Signal to increment
  } else {
    // Streak broken, reset to 1
    return 1;
  }
};