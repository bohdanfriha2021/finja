// components/RatesList.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';

export const RatesList = () => {
  const { exchangeRates, fetchExchangeRates, isLoading } = useAppDataContext();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleRefresh = () => {
    // Rotate animation
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    fetchExchangeRates();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rates = [
    {
      currency: 'USD',
      emoji: '💵',
      rate: exchangeRates.USD,
      label: 'Долар США',
      color: '#48bb78',
      bgColor: '#f0fff4',
    },
    {
      currency: 'EUR',
      emoji: '💶',
      rate: exchangeRates.EUR,
      label: 'Євро',
      color: '#9f7aea',
      bgColor: '#faf5ff',
    },
    {
      currency: 'USDT',
      emoji: '💠',
      rate: exchangeRates.USDT,
      label: 'Tether',
      color: '#4299e1',
      bgColor: '#ebf8ff',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <MaterialIcons name="trending-up" size={20} color="#667eea" />
          </View>
          <View>
            <Text style={styles.title}>Курси валют</Text>
            <Text style={styles.subtitle}>До гривні</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleRefresh} 
          disabled={isLoading}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#667eea" />
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialIcons name="refresh" size={24} color="#667eea" />
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.ratesGrid}>
        {rates.map((item, index) => (
          <View key={item.currency} style={styles.rateCard}>
            <View style={[styles.rateIconContainer, { backgroundColor: item.bgColor }]}>
              <Text style={styles.rateEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.rateContent}>
              <Text style={styles.rateCurrency}>{item.currency}</Text>
              <Text style={styles.rateLabel}>{item.label}</Text>
            </View>
            <View style={styles.rateValueContainer}>
              <Text style={[styles.rateValue, { color: item.color }]}>
                {item.rate.toFixed(2)}
              </Text>
              <Text style={styles.rateUnit}>₴</Text>
            </View>
            <View style={[styles.accentDot, { backgroundColor: item.color }]} />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <MaterialIcons name="schedule" size={14} color="#a0aec0" />
        <Text style={styles.footerText}>
          Оновлюється автоматично
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#edf2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#edf2f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratesGrid: {
    gap: 12,
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 14,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  rateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rateEmoji: {
    fontSize: 24,
  },
  rateContent: {
    flex: 1,
  },
  rateCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 2,
  },
  rateLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  rateValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rateValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  rateUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0aec0',
    marginLeft: 3,
  },
  accentDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#a0aec0',
    marginLeft: 6,
  },
});