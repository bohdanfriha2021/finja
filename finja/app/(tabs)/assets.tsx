// app/(tabs)/assets.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals, calculateAssetEquivalents } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { ASSET_SYMBOLS } from '@/constants';

export default function AssetsScreen() {
  const { savings, exchangeRates, assetPrices, fetchAssetPrices, isLoading } = useAppDataContext();
  const { totalUSD } = calculateTotals(savings, exchangeRates);
  const equivalents = calculateAssetEquivalents(totalUSD, assetPrices);

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

  if (totalUSD === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.gradientOverlay} />
          
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>💎</Text>
            </View>
            <Text style={styles.headerTitle}>Активи</Text>
            <Text style={styles.headerSubtitle}>Порівняння з криптою та металами</Text>
          </View>

          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <FontAwesome5 name="coins" size={80} color="#cbd5e0" />
          </View>
          <Text style={styles.emptyText}>Немає даних для порівняння</Text>
          <Text style={styles.emptySubtext}>
            Додайте валюту, щоб побачити{'\n'}порівняння з активами
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
            <Text style={styles.headerIcon}>💎</Text>
          </View>
          <Text style={styles.headerTitle}>Активи</Text>
          <Text style={styles.headerSubtitle}>Порівняння з криптою та металами</Text>
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
          {/* Total USD Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Ваша загальна сума</Text>
            <Text style={styles.totalAmount}>${formatCurrency(totalUSD)}</Text>
            <Text style={styles.totalCurrency}>💵 доларів США</Text>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchAssetPrices} 
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="refresh" size={20} color="#fff" />
            )}
            <Text style={styles.refreshText}>
              {isLoading ? 'Оновлення...' : 'Оновити ціни'}
            </Text>
          </TouchableOpacity>

          {/* Crypto Assets */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="currency-bitcoin" size={24} color="#667eea" />
              <Text style={styles.sectionTitle}>Криптовалюта</Text>
            </View>

            <View style={styles.assetCard}>
              <View style={[styles.assetIconContainer, styles.btcBackground]}>
                <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.BTC}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>Bitcoin</Text>
                <Text style={styles.assetAmount}>{equivalents.BTC.toFixed(6)} BTC</Text>
              </View>
              <View style={styles.assetPriceContainer}>
                <Text style={styles.assetPriceLabel}>Ціна</Text>
                <Text style={styles.assetPrice}>${assetPrices.BTC.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.assetCard}>
              <View style={[styles.assetIconContainer, styles.ethBackground]}>
                <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.ETH}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>Ethereum</Text>
                <Text style={styles.assetAmount}>{equivalents.ETH.toFixed(4)} ETH</Text>
              </View>
              <View style={styles.assetPriceContainer}>
                <Text style={styles.assetPriceLabel}>Ціна</Text>
                <Text style={styles.assetPrice}>${assetPrices.ETH.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Precious Metals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="gem" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Дорогоцінні метали</Text>
            </View>

            <View style={styles.assetCard}>
              <View style={[styles.assetIconContainer, styles.goldBackground]}>
                <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.XAU}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>Золото</Text>
                <Text style={styles.assetAmount}>{equivalents.XAU.toFixed(3)} унцій</Text>
              </View>
              <View style={styles.assetPriceContainer}>
                <Text style={styles.assetPriceLabel}>За унцію</Text>
                <Text style={styles.assetPrice}>${assetPrices.XAU.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.assetCard}>
              <View style={[styles.assetIconContainer, styles.silverBackground]}>
                <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.XAG}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>Срібло</Text>
                <Text style={styles.assetAmount}>{equivalents.XAG.toFixed(1)} унцій</Text>
              </View>
              <View style={styles.assetPriceContainer}>
                <Text style={styles.assetPriceLabel}>За унцію</Text>
                <Text style={styles.assetPrice}>${assetPrices.XAG.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <MaterialIcons name="schedule" size={16} color="#a0aec0" />
            <Text style={styles.footerText}>
              Оновлено: {new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color="#667eea" />
            <Text style={styles.infoText}>
              Розрахунки показують, скільки кожного активу ви могли б купити за вашу загальну суму
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
    backgroundColor: '#48bb78',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#48bb78',
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
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginLeft: 10,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  assetIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  btcBackground: {
    backgroundColor: '#f7931a15',
  },
  ethBackground: {
    backgroundColor: '#627eea15',
  },
  goldBackground: {
    backgroundColor: '#ffd70015',
  },
  silverBackground: {
    backgroundColor: '#c0c0c015',
  },
  assetSymbol: {
    fontSize: 28,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  assetAmount: {
    fontSize: 15,
    color: '#667eea',
    fontWeight: '600',
  },
  assetPriceContainer: {
    alignItems: 'flex-end',
  },
  assetPriceLabel: {
    fontSize: 11,
    color: '#a0aec0',
    marginBottom: 2,
  },
  assetPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#48bb78',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#a0aec0',
    marginLeft: 6,
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