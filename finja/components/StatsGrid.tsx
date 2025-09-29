// components/StatsGrid.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';

export const StatsGrid = () => {
  const { savings, exchangeRates, userStats } = useAppDataContext();
  const { totalUAH, totalUSD } = calculateTotals(savings, exchangeRates);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Швидка статистика</Text>
      <View style={styles.grid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatCurrency(totalUAH)}</Text>
          <Text style={styles.statLabel}>Загалом UAH</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatCurrency(totalUSD)}</Text>
          <Text style={styles.statLabel}>Загалом USD</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.streakDays}</Text>
          <Text style={styles.statLabel}>Днів стріку</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.totalInteractions}</Text>
          <Text style={styles.statLabel}>Взаємодій</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4169E1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});