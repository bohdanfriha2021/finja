// components/RatesList.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';

export const RatesList = () => {
  const { exchangeRates, fetchExchangeRates, isLoading } = useAppDataContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Поточні курси</Text>
        <TouchableOpacity onPress={fetchExchangeRates} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#4169E1" />
          ) : (
            <MaterialIcons name="refresh" size={24} color="#4169E1" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        <View style={styles.rateItem}>
          <Text style={styles.currency}>💵 USD</Text>
          <Text style={styles.rate}>{exchangeRates.USD.toFixed(2)} грн</Text>
        </View>
        <View style={styles.rateItem}>
          <Text style={styles.currency}>💶 EUR</Text>
          <Text style={styles.rate}>{exchangeRates.EUR.toFixed(2)} грн</Text>
        </View>
        <View style={styles.rateItem}>
          <Text style={styles.currency}>💠 USDT</Text>
          <Text style={styles.rate}>{exchangeRates.USDT.toFixed(2)} грн</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateItem: {
    alignItems: 'center',
    flex: 1,
  },
  currency: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  rate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4169E1',
  },
});