// components/QuickInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppDataContext } from '@/context/AppDataContext';
import { parseCurrencyInput } from '@/utils/currency';
import { CURRENCY_EMOJIS } from '@/constants';

export const QuickInput = () => {
  const [input, setInput] = useState('');
  const { addCurrency } = useAppDataContext();

  const handleSubmit = () => {
    const parsed = parseCurrencyInput(input);
    
    if (!parsed) {
      Alert.alert('Помилка', 'Не вдалося розпізнати валюту. Спробуйте ще раз.');
      return;
    }

    const success = addCurrency(parsed.amount, parsed.currency);
    
    if (success) {
      Alert.alert(
        'Успішно!',
        `${CURRENCY_EMOJIS[parsed.currency]} Додано ${parsed.amount.toFixed(2)} ${parsed.currency}`
      );
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Швидкий ввід</Text>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: 500 usd, 1000 грн, 200€"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Додати</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4169E1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});