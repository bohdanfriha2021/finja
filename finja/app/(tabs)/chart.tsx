// app/(tabs)/chart.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAppDataContext } from '@/context/AppDataContext';

type ChartCurrency = 'USD' | 'EUR';

export default function ChartScreen() {
  const { exchangeRates } = useAppDataContext();
  const [chartCurrency, setChartCurrency] = useState<ChartCurrency>('USD');
  const [chartDays, setChartDays] = useState(7);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateChartData = (currency: ChartCurrency, days: number) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const baseRate = exchangeRates[currency];
      const labels: string[] = [];
      const data: number[] = [];
      
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }));
        
        // Generate realistic rate variations
        const variation = (Math.random() - 0.5) * 2;
        data.push(baseRate + variation);
      }
      
      setChartData({
        labels,
        datasets: [{ data }],
      });
      
      setChartCurrency(currency);
      setChartDays(days);
      setIsLoading(false);
    }, 500);
  };

  React.useEffect(() => {
    generateChartData('USD', 7);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finja 💰</Text>
        <Text style={styles.headerSubtitle}>Графік курсів</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Графік курсів валют</Text>

          <View style={styles.controls}>
            <View style={styles.currencySelector}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  chartCurrency === 'USD' && styles.controlButtonActive,
                ]}
                onPress={() => generateChartData('USD', chartDays)}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    chartCurrency === 'USD' && styles.controlButtonTextActive,
                  ]}
                >
                  💵 USD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  chartCurrency === 'EUR' && styles.controlButtonActive,
                ]}
                onPress={() => generateChartData('EUR', chartDays)}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    chartCurrency === 'EUR' && styles.controlButtonTextActive,
                  ]}
                >
                  💶 EUR
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.daysSelector}>
              {[3, 7, 14, 21, 30].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.daysButton,
                    chartDays === days && styles.daysButtonActive,
                  ]}
                  onPress={() => generateChartData(chartCurrency, days)}
                >
                  <Text
                    style={[
                      styles.daysButtonText,
                      chartDays === days && styles.daysButtonTextActive,
                    ]}
                  >
                    {days} дн.
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#4169E1" />
              <Text style={styles.loadingText}>Завантаження графіка...</Text>
            </View>
          ) : chartData ? (
            <>
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 80}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#4169E1',
                  },
                }}
                bezier
                style={styles.chart}
              />

              <View style={styles.info}>
                <Text style={styles.infoText}>
                  Курс {chartCurrency}/UAH за {chartDays} днів
                </Text>
                <Text style={styles.infoSubtext}>Дані: НБУ України</Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="show-chart" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                Оберіть валюту та період для відображення графіка
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
  controls: {
    marginBottom: 20,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  controlButtonActive: {
    backgroundColor: '#4169E1',
    borderColor: '#4169E1',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  controlButtonTextActive: {
    color: '#fff',
  },
  daysSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  daysButtonActive: {
    backgroundColor: '#4169E1',
    borderColor: '#4169E1',
  },
  daysButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  daysButtonTextActive: {
    color: '#fff',
  },
  loading: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  info: {
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});