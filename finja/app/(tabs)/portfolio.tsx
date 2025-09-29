// app/(tabs)/portfolio.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { CURRENCY_EMOJIS, CURRENCY_COLORS } from '@/constants';
import { Currency } from '@/types';

export default function PortfolioScreen() {
  const { savings, exchangeRates } = useAppDataContext();
  const { totalUAH } = calculateTotals(savings, exchangeRates);

  const portfolioData = React.useMemo(() => {
    if (totalUAH === 0) return [];

    const data: any[] = [];

    (Object.keys(savings) as Currency[]).forEach((currency) => {
      const amount = savings[currency];
      if (amount > 0) {
        const rate = exchangeRates[currency];
        const amountUAH = amount * rate;
        const percentage = (amountUAH / totalUAH) * 100;

        data.push({
          name: `${currency}\n${formatCurrency(amount)}`,
          population: percentage,
          color: CURRENCY_COLORS[currency],
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        });
      }
    });

    return data;
  }, [savings, exchangeRates, totalUAH]);

  if (totalUAH === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finja 💰</Text>
          <Text style={styles.headerSubtitle}>Портфель</Text>
        </View>

        <View style={styles.emptyState}>
          <MaterialIcons name="pie-chart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Немає даних для діаграми портфеля</Text>
          <Text style={styles.emptySubtext}>Додайте валюту, щоб побачити розподіл</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finja 💰</Text>
        <Text style={styles.headerSubtitle}>Портфель</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Розподіл портфеля</Text>
          <Text style={styles.subtitle}>
            Загальна сума: {formatCurrency(totalUAH)} грн
          </Text>

          {portfolioData.length > 0 && (
            <PieChart
              data={portfolioData}
              width={Dimensions.get('window').width - 80}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}

          <View style={styles.details}>
            {(Object.keys(savings) as Currency[]).map((currency) => {
              const amount = savings[currency];
              if (amount > 0) {
                const rate = exchangeRates[currency];
                const amountUAH = amount * rate;
                const percentage = (amountUAH / totalUAH) * 100;
                const emoji = CURRENCY_EMOJIS[currency];

                return (
                  <View key={currency} style={styles.detailItem}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: CURRENCY_COLORS[currency] },
                      ]}
                    />
                    <Text style={styles.detailText}>
                      {emoji} {currency}: {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  details: {
    marginTop: 20,
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});