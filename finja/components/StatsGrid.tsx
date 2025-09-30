// components/StatsGrid.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';

export const StatsGrid = () => {
  const { savings, exchangeRates, userStats } = useAppDataContext();
  const { totalUAH, totalUSD } = calculateTotals(savings, exchangeRates);

  const stats = [
    {
      value: formatCurrency(totalUAH),
      label: 'Загалом',
      sublabel: 'гривень',
      icon: 'account-balance-wallet',
      iconType: 'material' as const,
      color: '#4299e1',
      bgColor: '#ebf8ff',
    },
    {
      value: formatCurrency(totalUSD),
      label: 'Загалом',
      sublabel: 'доларів',
      icon: 'attach-money',
      iconType: 'material' as const,
      color: '#48bb78',
      bgColor: '#f0fff4',
    },
    {
      value: userStats.streakDays.toString(),
      label: 'Стрік',
      sublabel: userStats.streakDays === 1 ? 'день' : userStats.streakDays < 5 ? 'дні' : 'днів',
      icon: 'fire',
      iconType: 'fa5' as const,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      value: userStats.totalInteractions.toString(),
      label: 'Взаємодій',
      sublabel: 'всього',
      icon: 'touch-app',
      iconType: 'material' as const,
      color: '#9f7aea',
      bgColor: '#faf5ff',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.bgColor }]}>
              {stat.iconType === 'material' ? (
                <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
              ) : (
                <FontAwesome5 name={stat.icon} size={20} color={stat.color} />
              )}
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSublabel}>{stat.sublabel}</Text>
            </View>
            <View style={[styles.accentBar, { backgroundColor: stat.color }]} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 2,
  },
  statSublabel: {
    fontSize: 11,
    color: '#a0aec0',
    fontWeight: '500',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
});