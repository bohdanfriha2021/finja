// app/(tabs)/settings.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';

export default function SettingsScreen() {
  const { fetchExchangeRates, fetchAssetPrices, resetData } = useAppDataContext();
  const [modalVisible, setModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

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

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      modalScale.setValue(0.9);
    }
  }, [modalVisible]);

  const handleReset = async () => {
    setModalVisible(false);
    await resetData();
    Alert.alert('✅ Успішно', 'Всі дані скинуто!');
  };

  const settingsOptions = [
    {
      icon: 'refresh',
      iconType: 'material' as const,
      title: 'Оновити курси валют',
      subtitle: 'Отримати актуальні курси',
      color: '#48bb78',
      bgColor: '#f0fff4',
      action: fetchExchangeRates,
    },
    {
      icon: 'coins',
      iconType: 'fa5' as const,
      title: 'Оновити ціни активів',
      subtitle: 'Крипто та дорогоцінні метали',
      color: '#4299e1',
      bgColor: '#ebf8ff',
      action: fetchAssetPrices,
    },
  ];

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
            <Text style={styles.headerIcon}>⚙️</Text>
          </View>
          <Text style={styles.headerTitle}>Налаштування</Text>
          <Text style={styles.headerSubtitle}>Керування додатком</Text>
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
          {/* Actions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="update" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Оновлення даних</Text>
            </View>

            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingCard}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIconContainer, { backgroundColor: option.bgColor }]}>
                  {option.iconType === 'material' ? (
                    <MaterialIcons name={option.icon as any} size={24} color={option.color} />
                  ) : (
                    <FontAwesome5 name={option.icon} size={20} color={option.color} />
                  )}
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={20} color="#f56565" />
              <Text style={[styles.sectionTitle, { color: '#f56565' }]}>Небезпечна зона</Text>
            </View>

            <TouchableOpacity
              style={styles.dangerCard}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.dangerIconContainer}>
                <MaterialIcons name="delete-forever" size={24} color="#f56565" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.dangerTitle}>Скинути всі дані</Text>
                <Text style={styles.dangerSubtitle}>Видалити накопичення та історію</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#cbd5e0" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="info-outline" size={24} color="#667eea" />
              <Text style={styles.infoTitle}>Про додаток</Text>
            </View>
            
            <View style={styles.infoItems}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Назва</Text>
                <Text style={styles.infoValue}>Finja</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Версія</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Останнє оновлення</Text>
                <Text style={styles.infoValue}>
                  {new Date().toLocaleDateString('uk-UA', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoDescription}>
              <Text style={styles.infoDescText}>
                Додаток для зручного обліку накопичень у різних валютах з автоматичним конвертуванням та аналітикою.
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: modalScale }] }
            ]}
          >
            <View style={styles.modalIconContainer}>
              <MaterialIcons name="warning" size={56} color="#f56565" />
            </View>
            
            <Text style={styles.modalTitle}>Підтвердження</Text>
            <Text style={styles.modalText}>
              Ви впевнені, що хочете скинути всі дані?{'\n\n'}
              Буде видалено:{'\n'}
              • Всі накопичення{'\n'}
              • Історію транзакцій{'\n'}
              • Налаштування{'\n\n'}
              Цю дію неможливо скасувати.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonTextCancel}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
                <Text style={styles.modalButtonTextConfirm}>Скинути</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginLeft: 10,
  },
  settingCard: {
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
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fed7d7',
    shadowColor: '#f56565',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  dangerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f56565',
    marginBottom: 2,
  },
  dangerSubtitle: {
    fontSize: 13,
    color: '#fc8181',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginLeft: 12,
  },
  infoItems: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '700',
  },
  infoDescription: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  infoDescText: {
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#edf2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f56565',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f56565',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 6,
  },
  });