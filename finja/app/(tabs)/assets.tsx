// app/(tabs)/assets.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { calculateTotals, calculateAssetEquivalents } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { ASSET_SYMBOLS } from '@/constants';

export default function AssetsScreen() {
  const { savings, exchangeRates, assetPrices, fetchAssetPrices, isLoading } = useAppDataContext();
  const { totalUSD } = calculateTotals(savings, exchangeRates);
  const equivalents = calculateAssetEquivalents(totalUSD, assetPrices);

  if (totalUSD === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finja 💰</Text>
          <Text style={styles.headerSubtitle}>Активи</Text>
        </View>

        <View style={styles.emptyState}>
          <FontAwesome5 name="coins" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Немає даних для порівняння</Text>
          <Text style={styles.emptySubtext}>Додайте валюту, щоб побачити порівняння з активами</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finja 💰</Text>
        <Text style={styles.headerSubtitle}>Активи</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Порівняння з активами</Text>
            <TouchableOpacity onPress={fetchAssetPrices} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#4169E1" />
              ) : (
                <MaterialIcons name="refresh" size={24} color="#4169E1" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Ваша загальна сума: {formatCurrency(totalUSD)} USD
          </Text>

          <View style={styles.assetsList}>
            <View style={styles.assetItem}>
              <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.BTC}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>Bitcoin</Text>
                <Text style={styles.assetAmount}>{equivalents.BTC.toFixed(6)} BTC</Text>
              </View>
              <Text style={styles.assetPrice}>${assetPrices.BTC.toLocaleString()}</Text>
            </View>

            <View style={styles.assetItem}>
              <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.ETH}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>Ethereum</Text>
                <Text style={styles.assetAmount}>{equivalents.ETH.toFixed(4)} ETH</Text>
              </View>
              <Text style={styles.assetPrice}>${assetPrices.ETH.toLocaleString()}</Text>
            </View>

            <View style={styles.assetItem}>
              <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.XAU}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>Золото</Text>
                <Text style={styles.assetAmount}>{equivalents.XAU.toFixed(3)} унцій</Text>
              </View>
              <Text style={styles.assetPrice}>${assetPrices.XAU.toLocaleString()}/oz</Text>
            </View>

            <View style={styles.assetItem}>
              <Text style={styles.assetSymbol}>{ASSET_SYMBOLS.XAG}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>Срібло</Text>
                <Text style={styles.assetAmount}>{equivalents.XAG.toFixed(1)} унцій</Text>
              </View>
              <Text style={styles.assetPrice}>${assetPrices.XAG.toLocaleString()}/oz</Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Оновлено: {new Date().toLocaleTimeString('uk-UA')}
          </Text>
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  assetsList: {
    marginBottom: 16,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  assetSymbol: {
    fontSize: 24,
    marginRight: 16,
  },
  assetDetails: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  assetAmount: {
    fontSize: 14,
    color: '#4169E1',
  },
  assetPrice: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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