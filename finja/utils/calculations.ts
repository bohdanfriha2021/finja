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

  const totalUSD = exchangeRates.USD > 0 ? totalUAH / exchangeRates.USD : 0;
  const totalEUR = exchangeRates.EUR > 0 ? totalUAH / exchangeRates.EUR : 0;

  return { totalUAH, totalUSD, totalEUR };
};

export const calculateAssetEquivalents = (
  totalUSD: number,
  assetPrices: AssetPrices
): AssetEquivalent => {
  // Перевірка на валідність ціни: має бути більше 0 і не Infinity/NaN
  const isValidPrice = (price: number): boolean => {
    return price > 0 && isFinite(price);
  };

  return {
    BTC: isValidPrice(assetPrices.BTC) ? totalUSD / assetPrices.BTC : 0,
    ETH: isValidPrice(assetPrices.ETH) ? totalUSD / assetPrices.ETH : 0,
    XAU: isValidPrice(assetPrices.XAU) ? totalUSD / assetPrices.XAU : 0,
    XAG: isValidPrice(assetPrices.XAG) ? totalUSD / assetPrices.XAG : 0,
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