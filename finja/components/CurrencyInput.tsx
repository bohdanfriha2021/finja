// components/CurrencyInput.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { Currency } from '@/types';
import { CURRENCY_EMOJIS } from '@/constants';

export const CurrencyInput = () => {
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [isFocused, setIsFocused] = useState(false);
  const { addCurrency } = useAppDataContext();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAdd = () => {
    if (!amount.trim()) {
      Alert.alert('Увага', 'Будь ласка, введіть суму!');
      return;
    }

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Помилка вводу', 'Будь ласка, введіть коректне додатне число!');
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const success = addCurrency(numAmount, selectedCurrency);
    
    if (success) {
      Alert.alert(
        '✅ Успішно додано!',
        `${CURRENCY_EMOJIS[selectedCurrency]} ${numAmount.toFixed(2)} ${selectedCurrency}`,
        [{ text: 'Чудово', style: 'default' }]
      );
      setAmount('');
      Keyboard.dismiss();
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#667eea'],
  });

  const currencies: Currency[] = ['UAH', 'USD', 'EUR', `USDT` ]

  const getCurrencyColor = (currency: Currency) => {
    const colors: Record<Currency, string> = {
      UAH: '#4299e1',
      USD: '#48bb78',
      EUR: '#9f7aea',
      USDT:'#48bb78',
    };
    return colors[currency];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialIcons name="account-balance-wallet" size={20} color="#667eea" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Додати валюту</Text>
          <Text style={styles.subtitle}>Оберіть валюту та введіть суму</Text>
        </View>
      </View>

      <View style={styles.currencySelector}>
        {currencies.map((currency) => {
          const isSelected = selectedCurrency === currency;
          const currencyColor = getCurrencyColor(currency);

          return (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                isSelected && { 
                  backgroundColor: currencyColor,
                  borderColor: currencyColor,
                },
              ]}
              onPress={() => handleCurrencySelect(currency)}
              activeOpacity={0.7}
            >
              <Text style={styles.currencyEmoji}>
                {CURRENCY_EMOJIS[currency]}
              </Text>
              <Text
                style={[
                  styles.currencyButtonText,
                  isSelected && styles.currencyButtonTextSelected,
                ]}
              >
                {currency}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <View style={styles.inputPrefix}>
          <Text style={[styles.currencySymbol, { color: isFocused ? '#667eea' : '#a0aec0' }]}>
            {CURRENCY_EMOJIS[selectedCurrency]}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="#a0aec0"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          onSubmitEditing={handleAdd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="done"
        />
        <View style={styles.inputSuffix}>
          <Text style={styles.currencyCode}>{selectedCurrency}</Text>
        </View>
      </Animated.View>

      {amount && !isNaN(parseFloat(amount)) && (
        <View style={styles.previewContainer}>
          <MaterialIcons name="info-outline" size={16} color="#718096" />
          <Text style={styles.previewText}>
            Буде додано {parseFloat(amount).toFixed(2)} {selectedCurrency}
          </Text>
        </View>
      )}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={[
            styles.addButton,
            { backgroundColor: getCurrencyColor(selectedCurrency) },
            (!amount.trim() || isNaN(parseFloat(amount))) && styles.addButtonDisabled,
          ]} 
          onPress={handleAdd}
          activeOpacity={0.8}
          disabled={!amount.trim() || isNaN(parseFloat(amount))}
        >
          <MaterialIcons name="add-circle" size={22} color="#fff" />
          <Text style={styles.addButtonText}>
            Додати {CURRENCY_EMOJIS[selectedCurrency]} {selectedCurrency}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  titleContainer: {
    flex: 1,
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
  currencySelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
  currencyEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a5568',
  },
  currencyButtonTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#f7fafc',
    marginBottom: 12,
    overflow: 'hidden',
  },
  inputPrefix: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
  },
  inputSuffix: {
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#718096',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 13,
    color: '#4a5568',
    marginLeft: 6,
    fontWeight: '600',
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#cbd5e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});