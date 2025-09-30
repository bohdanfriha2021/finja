// app/(tabs)/total.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { CURRENCY_EMOJIS } from '@/constants';
import { Currency } from '@/types';

export default function TotalScreen() {
  const { savings, exchangeRates, userStats } = useAppDataContext();
  const { totalUAH, totalUSD, totalEUR } = calculateTotals(savings, exchangeRates);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.gradientOverlay} />
        
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.headerIcon}>📊</Text>
          </View>
          <Text style={styles.headerTitle}>Загалом</Text>
          <Text style={styles.headerSubtitle}>Повна картина ваших фінансів</Text>
        </View>

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
          {/* Total Summary Cards */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, styles.uahCard]}>
              <Text style={styles.summaryCardLabel}>Гривня</Text>
              <Text style={styles.summaryCardAmount}>{formatCurrency(totalUAH)}</Text>
              <Text style={styles.summaryCardCurrency}>🇺🇦 UAH</Text>
            </View>

            <View style={[styles.summaryCard, styles.usdCard]}>
              <Text style={styles.summaryCardLabel}>Долар</Text>
              <Text style={styles.summaryCardAmount}>{formatCurrency(totalUSD)}</Text>
              <Text style={styles.summaryCardCurrency}>💵 USD</Text>
            </View>

            <View style={[styles.summaryCard, styles.eurCard]}>
              <Text style={styles.summaryCardLabel}>Євро</Text>
              <Text style={styles.summaryCardAmount}>{formatCurrency(totalEUR)}</Text>
              <Text style={styles.summaryCardCurrency}>💶 EUR</Text>
            </View>
          </View>

          {/* Streak Badge */}
          {userStats.streakDays > 1 && (
            <View style={styles.streakBadge}>
              <View style={styles.streakIconContainer}>
                <Text style={styles.streakIcon}>🔥</Text>
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakLabel}>Ваш стрік</Text>
                <Text style={styles.streakDays}>{userStats.streakDays} днів</Text>
              </View>
            </View>
          )}

          {/* Savings Breakdown */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Деталізація накопичень</Text>
              <View style={styles.cardDivider} />
            </View>

            {(Object.keys(savings) as Currency[]).map((currency, index) => {
              const amount = savings[currency];
              if (amount > 0) {
                const rate = exchangeRates[currency];
                const converted = amount * rate;
                const emoji = CURRENCY_EMOJIS[currency];

                return (
                  <View key={currency} style={styles.savingsItem}>
                    <View style={styles.savingsLeft}>
                      <View style={styles.currencyBadge}>
                        <Text style={styles.currencyEmoji}>{emoji}</Text>
                      </View>
                      <View>
                        <Text style={styles.currencyCode}>{currency}</Text>
                        <Text style={styles.currencyAmount}>
                          {formatCurrency(amount)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.savingsRight}>
                      <Text style={styles.convertedLabel}>У гривні</Text>
                      <Text style={styles.convertedAmount}>
                        {formatCurrency(converted)} ₴
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}

            {Object.values(savings).every(v => v === 0) && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>💼</Text>
                <Text style={styles.emptyStateText}>
                  Поки що немає накопичень
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Почніть додавати свої заощадження
                </Text>
              </View>
            )}
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
  summaryCards: {
    marginBottom: 20,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uahCard: {
    backgroundColor: '#4299e1',
  },
  usdCard: {
    backgroundColor: '#48bb78',
  },
  eurCard: {
    backgroundColor: '#9f7aea',
  },
  summaryCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryCardAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  summaryCardCurrency: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  streakIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakIcon: {
    fontSize: 24,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 14,
    color: '#78716c',
    fontWeight: '500',
  },
  streakDays: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f59e0b',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
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
  savingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  savingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currencyEmoji: {
    fontSize: 24,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 2,
  },
  currencyAmount: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
  },
  savingsRight: {
    alignItems: 'flex-end',
  },
  convertedLabel: {
    fontSize: 12,
    color: '#a0aec0',
    marginBottom: 2,
  },
  convertedAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4299e1',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#a0aec0',
  },
});