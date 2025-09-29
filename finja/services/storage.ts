// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Savings, UserStats, ExchangeRates, AssetPrices } from '@/types';
import { STORAGE_KEYS } from '@/constants';

export const storage = {
  // Savings
  async getSavings(): Promise<Savings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting savings:', error);
      return null;
    }
  },

  async setSavings(savings: Savings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savings));
    } catch (error) {
      console.error('Error setting savings:', error);
    }
  },

  // User Stats
  async getUserStats(): Promise<UserStats | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  },

  async setUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error setting user stats:', error);
    }
  },

  // Exchange Rates
  async getExchangeRates(): Promise<ExchangeRates | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXCHANGE_RATES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting exchange rates:', error);
      return null;
    }
  },

  async setExchangeRates(rates: ExchangeRates): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXCHANGE_RATES, JSON.stringify(rates));
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_RATE_UPDATE,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error setting exchange rates:', error);
    }
  },

  async getLastRateUpdate(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RATE_UPDATE);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('Error getting last rate update:', error);
      return null;
    }
  },

  // Asset Prices
  async getAssetPrices(): Promise<AssetPrices | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ASSET_PRICES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting asset prices:', error);
      return null;
    }
  },

  async setAssetPrices(prices: AssetPrices): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASSET_PRICES, JSON.stringify(prices));
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_ASSET_UPDATE,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error setting asset prices:', error);
    }
  },

  async getLastAssetUpdate(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ASSET_UPDATE);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('Error getting last asset update:', error);
      return null;
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};