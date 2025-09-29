// context/AppDataContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { Savings, UserStats, ExchangeRates, AssetPrices, Currency } from '@/types';

interface AppDataContextType {
  savings: Savings;
  userStats: UserStats;
  exchangeRates: ExchangeRates;
  assetPrices: AssetPrices;
  isLoading: boolean;
  addCurrency: (amount: number, currency: Currency) => boolean;
  fetchExchangeRates: () => Promise<void>;
  fetchAssetPrices: () => Promise<void>;
  resetData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const appData = useAppData();

  return (
    <AppDataContext.Provider value={appData}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within AppDataProvider');
  }
  return context;
};