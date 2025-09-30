// components/QuickInput.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';
import { parseCurrencyInput } from '@/utils/currency';
import { CURRENCY_EMOJIS } from '@/constants';

export const QuickInput = () => {
  const [input, setInput] = useState('');
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

  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }

    const parsed = parseCurrencyInput(input);
    
    if (!parsed) {
      Alert.alert(
        'Помилка вводу',
        'Не вдалося розпізнати валюту.\n\nПриклади:\n• 500 usd\n• 1000 грн\n• 200€',
        [{ text: 'Зрозуміло', style: 'default' }]
      );
      return;
    }

    // Animation on button press
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

    const success = addCurrency(parsed.amount, parsed.currency);
    
    if (success) {
      Alert.alert(
        '✅ Успішно додано!',
        `${CURRENCY_EMOJIS[parsed.currency]} ${parsed.amount.toFixed(2)} ${parsed.currency}`,
        [{ text: 'Чудово', style: 'default' }]
      );
      setInput('');
      Keyboard.dismiss();
    }
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#667eea'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialIcons name="flash-on" size={20} color="#667eea" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Швидкий ввід</Text>
          <Text style={styles.subtitle}>Додайте валюту одним рядком</Text>
        </View>
      </View>

      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <MaterialIcons 
          name="attach-money" 
          size={22} 
          color={isFocused ? '#667eea' : '#a0aec0'} 
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="500 usd, 1000 грн, 200€..."
          placeholderTextColor="#a0aec0"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {input.length > 0 && (
          <TouchableOpacity 
            onPress={() => setInput('')}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={20} color="#a0aec0" />
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.examplesContainer}>
        <Text style={styles.examplesLabel}>Приклади:</Text>
        <View style={styles.examplesList}>
          {['500 usd', '1000 грн', '200€'].map((example, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleChip}
              onPress={() => setInput(example)}
              activeOpacity={0.7}
            >
              <Text style={styles.exampleText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={[
            styles.button,
            !input.trim() && styles.buttonDisabled
          ]} 
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!input.trim()}
        >
          <MaterialIcons name="add-circle" size={22} color="#fff" />
          <Text style={styles.buttonText}>Додати валюту</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f7fafc',
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  examplesLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    fontWeight: '600',
  },
  examplesList: {
    flexDirection: 'row',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exampleText: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#667eea',
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
  buttonDisabled: {
    backgroundColor: '#cbd5e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});