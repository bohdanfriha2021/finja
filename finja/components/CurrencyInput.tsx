// components/CurrencyInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { Currency } from '@/types';
import { CURRENCY_EMOJIS } from '@/constants';

export const CurrencyInput = () => {
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const { addCurrency } = useAppDataContext();

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      Alert.alert('Помилка', 'Будь ласка, введіть коректне число!');
      return;
    }

    const success = addCurrency(numAmount, selectedCurrency);
    
    if (success) {
      Alert.alert(
        'Успішно!',
        `${CURRENCY_EMOJIS[selectedCurrency]} Додано ${numAmount.toFixed(2)} ${selectedCurrency}`
      );
      setAmount('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Додати валюту</Text>
      
      <View style={styles.currencySelector}>
        {(Object.keys(CURRENCY_EMOJIS) as Currency[]).map((currency) => (
          <TouchableOpacity
            key={currency}
            style={[
              styles.currencyButton,
              selectedCurrency === currency && styles.currencyButtonSelected,
            ]}
            onPress={() => setSelectedCurrency(currency)}
          >
            <Text
              style={[
                styles.currencyButtonText,
                selectedCurrency === currency && styles.currencyButtonTextSelected,
              ]}
            >
              {CURRENCY_EMOJIS[currency]} {currency}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Введіть суму"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}> Додати {selectedCurrency}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currencyButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  currencyButtonSelected: {
    backgroundColor: '#4169E1',
    borderColor: '#4169E1',
  },
  currencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  currencyButtonTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4169E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});