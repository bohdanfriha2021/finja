// app/(tabs)/portfolio.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
  }, []);

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
          name: `${currency} ${Math.round(percentage)}%`,
          population: amountUAH,
          color: CURRENCY_COLORS[currency],
          legendFontColor: '#2d3748',
          legendFontSize: 14,
        });
      }
    });

    return data;
  }, [savings, exchangeRates, totalUAH]);

  const screenWidth = Dimensions.get('window').width;
  const chartPadding = screenWidth * 0.25;

  if (totalUAH === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.gradientOverlay} />
          
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>📊</Text>
            </View>
            <Text style={styles.headerTitle}>Портфель</Text>
            <Text style={styles.headerSubtitle}>Аналіз розподілу активів</Text>
          </View>

          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="pie-chart" size={80} color="#cbd5e0" />
          </View>
          <Text style={styles.emptyText}>Немає даних для аналізу</Text>
          <Text style={styles.emptySubtext}>
            Додайте валюту, щоб побачити{'\n'}розподіл вашого портфеля
          </Text>
          <View style={styles.emptyHint}>
            <MaterialIcons name="lightbulb-outline" size={20} color="#f59e0b" />
            <Text style={styles.emptyHintText}>
              Почніть з головної сторінки
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
            <Text style={styles.headerIcon}>📊</Text>
          </View>
          <Text style={styles.headerTitle}>Портфель</Text>
          <Text style={styles.headerSubtitle}>Аналіз розподілу активів</Text>
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
          {/* Total Amount Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Загальна вартість</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalUAH)}</Text>
            <Text style={styles.totalCurrency}>🇺🇦 гривень</Text>
          </View>

          {/* Chart Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Розподіл портфеля</Text>
              <View style={styles.cardDivider} />
            </View>

            {portfolioData.length > 0 && (
              <View style={styles.chartContainer}>
                <PieChart
                  data={portfolioData}
                  width={screenWidth}
                  height={275}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft={chartPadding.toString()}
                  hasLegend={false}
                  absolute={false}
                />
                
                <View style={styles.customLegend}>
                  {(Object.keys(savings) as Currency[]).map((currency) => {
                    const amount = savings[currency];
                    if (amount > 0) {
                      const rate = exchangeRates[currency];
                      const amountUAH = amount * rate;
                      const percentage = (amountUAH / totalUAH) * 100;
                      
                      return (
                        <View key={currency} style={styles.legendItem}>
                          <View 
                            style={[
                              styles.legendColor, 
                              { backgroundColor: CURRENCY_COLORS[currency] }
                            ]} 
                          />
                          <Text style={styles.legendText}>
                            {currency} {Math.round(percentage)}%
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Деталізація</Text>
              <View style={styles.cardDivider} />
            </View>

            <View style={styles.details}>
              {(Object.keys(savings) as Currency[]).map((currency, index) => {
                const amount = savings[currency];
                if (amount > 0) {
                  const rate = exchangeRates[currency];
                  const amountUAH = amount * rate;
                  const percentage = (amountUAH / totalUAH) * 100;
                  const emoji = CURRENCY_EMOJIS[currency];

                  return (
                    <View key={currency} style={styles.detailItem}>
                      <View style={styles.detailLeft}>
                        <View
                          style={[
                            styles.colorIndicator,
                            { backgroundColor: CURRENCY_COLORS[currency] },
                          ]}
                        />
                        <View style={styles.detailInfo}>
                          <Text style={styles.detailCurrency}>
                            {emoji} {currency}
                          </Text>
                          <Text style={styles.detailAmount}>
                            {formatCurrency(amount)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRight}>
                        <Text style={styles.detailPercentage}>
                          {percentage.toFixed(2)}%
                        </Text>
                        <Text style={styles.detailValue}>
                          {formatCurrency(amountUAH)} ₴
                        </Text>
                      </View>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color="#667eea" />
            <Text style={styles.infoText}>
              Діаграма показує розподіл вашого портфеля за валютами в гривневому еквіваленті
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
  totalCard: {
    backgroundColor: '#667eea',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  totalCurrency: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  card: {
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
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 8,
  },
  cardDivider: {
    height: 3,
    width: 40,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  customLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
  },
  details: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 2,
  },
  detailAmount: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  detailPercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: '#a0aec0',
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4a5568',
    marginLeft: 12,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyHintText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
});