// app/(tabs)/total.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { CURRENCY_EMOJIS } from '@/constants';
import { Currency } from '@/types';

export default function TotalScreen() {
  const { savings, exchangeRates, userStats } = useAppDataContext();
  const { totalUAH, totalUSD, totalEUR } = calculateTotals(savings, exchangeRates);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finja 💰</Text>
        <Text style={styles.headerSubtitle}>Загалом</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Ваші накопичення</Text>

          {(Object.keys(savings) as Currency[]).map((currency) => {
            const amount = savings[currency];
            if (amount > 0) {
              const rate = exchangeRates[currency];
              const converted = amount * rate;
              const emoji = CURRENCY_EMOJIS[currency];

              return (
                <View key={currency} style={styles.savingsItem}>
                  <Text style={styles.savingsText}>
                    {formatCurrency(amount)} {emoji} {currency} ={' '}
                    {formatCurrency(converted)} грн
                  </Text>
                </View>
              );
            }
            return null;
          })}

          <View style={styles.totalSummary}>
            <Text style={styles.summaryTitle}>Загальна сума:</Text>
            <Text style={styles.summaryItem}>
              🇺🇦 {formatCurrency(totalUAH)} UAH
            </Text>
            <Text style={styles.summaryItem}>
              💵 {formatCurrency(totalUSD)} USD
            </Text>
            <Text style={styles.summaryItem}>
              💶 {formatCurrency(totalEUR)} EUR
            </Text>
          </View>

          {userStats.streakDays > 1 && (
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>
                🔥 Ваш стрік: {userStats.streakDays} днів
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4169E1',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  savingsItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  savingsText: {
    fontSize: 16,
    color: '#333',
  },
  totalSummary: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#4169E1',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  streakContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#856404',
    textAlign: 'center',
  },
});