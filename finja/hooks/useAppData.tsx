// hooks/useAppData.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Savings, UserStats, ExchangeRates, AssetPrices, Currency } from '@/types';
import { storage } from '@/services/storage';
import { api } from '@/services/api';
import {
  DEFAULT_SAVINGS,
  DEFAULT_EXCHANGE_RATES,
  DEFAULT_ASSET_PRICES,
  CACHE_DURATION,
} from '@/constants';
import { updateStreak } from '@/utils/calculations';

export const useAppData = () => {
  const [savings, setSavings] = useState<Savings>(DEFAULT_SAVINGS);
  const [userStats, setUserStats] = useState<UserStats>({
    firstInteraction: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
    totalInteractions: 0,
    streakDays: 0,
  });
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [assetPrices, setAssetPrices] = useState<AssetPrices>(DEFAULT_ASSET_PRICES);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save data
  useEffect(() => {
    const timer = setTimeout(() => {
      storage.setSavings(savings);
    }, 1000);
    return () => clearTimeout(timer);
  }, [savings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      storage.setUserStats(userStats);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userStats]);

  const loadData = async () => {
    try {
      // Load savings
      const savedSavings = await storage.getSavings();
      if (savedSavings) {
        setSavings(savedSavings);
      }

      // Load user stats
      const savedStats = await storage.getUserStats();
      if (savedStats) {
        setUserStats(savedStats);
      }

      // Load exchange rates
      await loadExchangeRates();

      // Load asset prices
      await loadAssetPrices();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadExchangeRates = async () => {
    const savedRates = await storage.getExchangeRates();
    const lastUpdate = await storage.getLastRateUpdate();
    const now = Date.now();

    if (savedRates && lastUpdate && now - lastUpdate < CACHE_DURATION) {
      // Use cached rates
      setExchangeRates(savedRates);
    } else {
      // Fetch new rates
      await fetchExchangeRates();
    }
  };

  const loadAssetPrices = async () => {
    const savedPrices = await storage.getAssetPrices();
    const lastUpdate = await storage.getLastAssetUpdate();
    const now = Date.now();

    if (savedPrices && lastUpdate && now - lastUpdate < CACHE_DURATION) {
      // Use cached prices
      setAssetPrices(savedPrices);
    } else {
      // Fetch new prices
      await fetchAssetPrices();
    }
  };

  const fetchExchangeRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const rates = await api.fetchExchangeRates();
      setExchangeRates(rates);
      await storage.setExchangeRates(rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      Alert.alert(
        'Помилка',
        'Не вдалося оновити курси валют. Використовуються збережені значення.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAssetPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const prices = await api.fetchAssetPrices();
      setAssetPrices(prices);
      await storage.setAssetPrices(prices);
    } catch (error) {
      console.error('Error fetching asset prices:', error);
      Alert.alert(
        'Помилка',
        'Не вдалося оновити ціни активів. Використовуються збережені значення.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCurrency = useCallback(
    (amount: number, currency: Currency) => {
      if (amount <= 0) {
        Alert.alert('Помилка', 'Сума має бути більше нуля!');
        return false;
      }

      // Update streak
      const streakUpdate = updateStreak(userStats.lastStreakDate);
      const now = new Date().toISOString();

      let newStreakDays = userStats.streakDays;
      if (streakUpdate === -2) {
        newStreakDays += 1;
      } else if (streakUpdate > 0) {
        newStreakDays = streakUpdate;
      }

      const updatedStats: UserStats = {
        ...userStats,
        lastInteraction: now,
        lastStreakDate: now,
        totalInteractions: userStats.totalInteractions + 1,
        streakDays: newStreakDays,
      };

      setUserStats(updatedStats);

      // Update savings
      const newSavings = {
        ...savings,
        [currency]: savings[currency] + amount,
      };
      setSavings(newSavings);

      return true;
    },
    [savings, userStats]
  );

  const resetData = useCallback(async () => {
    setSavings(DEFAULT_SAVINGS);
    setUserStats({
      firstInteraction: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      totalInteractions: 0,
      streakDays: 0,
    });
    await storage.clearAll();
  }, []);

  return {
    savings,
    userStats,
    exchangeRates,
    assetPrices,
    isLoading,
    addCurrency,
    fetchExchangeRates,
    fetchAssetPrices,
    resetData,
  };
};