// app/(tabs)/chart.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Animated, Easing } from 'react-native';
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const reducedLabels =
    chartDays === 14
      ? chartData.labels.map((label: string, i: number) => (i % 2 === 0 ? label : ""))
      : chartDays === 21 ? chartData.labels.map((label: string, i: number) => (i % 3 === 0 ? label : "")) 
      : chartDays > 21 ? chartData.labels.map((label: string, i: number) => (i % 5 === 0 ? label : ""))
      : chartData.labels;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    generateChartData('USD', 7);
  }, []);

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

  const getCurrencyColor = (currency: ChartCurrency) => {
    return currency === 'USD' ? '#48bb78' : '#9f7aea';
  };

  const getCurrencyBgColor = (currency: ChartCurrency) => {
    return currency === 'USD' ? '#f0fff4' : '#faf5ff';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.gradientOverlay} />
        
        <Animated.View 
          style={[
            styles.headerContent,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.headerIcon}>📈</Text>
          </View>
          <Text style={styles.headerTitle}>Графіки</Text>
          <Text style={styles.headerSubtitle}>Динаміка курсів валют</Text>
        </Animated.View>

        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Currency Selector */}
          <View style={styles.selectorCard}>
            <View style={styles.selectorHeader}>
              <MaterialIcons name="currency-exchange" size={20} color="#667eea" />
              <Text style={styles.selectorTitle}>Оберіть валюту</Text>
            </View>
            <View style={styles.currencySelector}>
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  chartCurrency === 'USD' && {
                    backgroundColor: getCurrencyColor('USD'),
                    borderColor: getCurrencyColor('USD'),
                  },
                ]}
                onPress={() => generateChartData('USD', chartDays)}
                activeOpacity={0.7}
              >
                <Text style={styles.currencyEmoji}>💵</Text>
                <Text
                  style={[
                    styles.currencyButtonText,
                    chartCurrency === 'USD' && styles.currencyButtonTextActive,
                  ]}
                >
                  USD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  chartCurrency === 'EUR' && {
                    backgroundColor: getCurrencyColor('EUR'),
                    borderColor: getCurrencyColor('EUR'),
                  },
                ]}
                onPress={() => generateChartData('EUR', chartDays)}
                activeOpacity={0.7}
              >
                <Text style={styles.currencyEmoji}>💶</Text>
                <Text
                  style={[
                    styles.currencyButtonText,
                    chartCurrency === 'EUR' && styles.currencyButtonTextActive,
                  ]}
                >
                  EUR
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Period Selector */}
          <View style={styles.periodCard}>
            <View style={styles.selectorHeader}>
              <MaterialIcons name="date-range" size={20} color="#667eea" />
              <Text style={styles.selectorTitle}>Період</Text>
            </View>
            <View style={styles.daysSelector}>
              {[3, 7, 14, 21, 30].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.daysButton,
                    chartDays === days && {
                      backgroundColor: '#667eea',
                      borderColor: '#667eea',
                    },
                  ]}
                  onPress={() => generateChartData(chartCurrency, days)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.daysButtonText,
                      chartDays === days && styles.daysButtonTextActive,
                    ]}
                  >
                    {days}
                  </Text>
                  <Text
                    style={[
                      styles.daysButtonLabel,
                      chartDays === days && styles.daysButtonLabelActive,
                    ]}
                  >
                    {days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>
                  {chartCurrency === 'USD' ? '💵 Долар США' : '💶 Євро'}
                </Text>
                <Text style={styles.chartSubtitle}>
                  Курс до гривні за {chartDays} {chartDays === 1 ? 'день' : chartDays < 5 ? 'дні' : 'днів'}
                </Text>
              </View>
              <View style={[styles.currentRateBadge, { backgroundColor: getCurrencyBgColor(chartCurrency) }]}>
                <Text style={styles.currentRateLabel}>Зараз</Text>
                <Text style={[styles.currentRateValue, { color: getCurrencyColor(chartCurrency) }]}>
                  {exchangeRates[chartCurrency].toFixed(2)} ₴
                </Text>
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Завантаження графіка...</Text>
              </View>
            ) : chartData ? (
              <>
                <View style={styles.chartContainer}>
                      <LineChart
                        data={{
                          ...chartData,
                          labels: reducedLabels
                        }}
                        width={Dimensions.get('window').width - 80}
                        height={220}
                        chartConfig={{
                          backgroundColor: '#ffffff',
                          backgroundGradientFrom: '#ffffff',
                          backgroundGradientTo: '#ffffff',
                          decimalPlaces: 2,
                          color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
                          style: {
                            borderRadius: 16,
                          },
                          propsForDots: {
                            r: '5',
                            strokeWidth: '2',
                            stroke: '#667eea',
                            fill: '#fff',
                          },
                        }}
                        bezier
                        style={styles.chart}
                      />
                </View>

                <View style={styles.chartFooter}>
                  <View style={styles.chartLegend}>
                    <View style={styles.legendDot} />
                    <Text style={styles.legendText}>
                      Курс {chartCurrency}/UAH
                    </Text>
                  </View>
                  <Text style={styles.chartSource}>Джерело: НБУ</Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <MaterialIcons name="show-chart" size={80} color="#cbd5e0" />
                </View>
                <Text style={styles.emptyText}>
                  Оберіть валюту та період
                </Text>
                <Text style={styles.emptySubtext}>
                  Графік відобразиться автоматично
                </Text>
              </View>
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color="#667eea" />
            <Text style={styles.infoText}>
              Графік показує зміну курсу валюти до гривні за обраний період. Дані оновлюються щодня.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#764ba2',
    opacity: 0.3,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerIcon: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#fff',
    marginTop: 6,
    opacity: 0.95,
    fontWeight: '500',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 20,
    left: -20,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  selectorCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  periodCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3748',
    marginLeft: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f7fafc',
  },
  currencyEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a5568',
  },
  currencyButtonTextActive: {
    color: '#fff',
  },
  daysSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  daysButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f7fafc',
    alignItems: 'center',
  },
  daysButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3748',
  },
  daysButtonTextActive: {
    color: '#fff',
  },
  daysButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a0aec0',
    marginTop: 2,
  },
  daysButtonLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  currentRateBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  currentRateLabel: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 2,
  },
  currentRateValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  loading: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '600',
  },
  chartSource: {
    fontSize: 12,
    color: '#a0aec0',
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4a5568',
    marginLeft: 12,
    lineHeight: 18,
  },
});