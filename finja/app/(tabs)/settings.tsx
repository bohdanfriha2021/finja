// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAppDataContext } from '@/context/AppDataContext';

export default function SettingsScreen() {
  const { fetchExchangeRates, fetchAssetPrices, resetData } = useAppDataContext();
  const [modalVisible, setModalVisible] = useState(false);

  const handleReset = async () => {
    setModalVisible(false);
    await resetData();
    Alert.alert('Успішно', 'Всі дані скинуто!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finja 💰</Text>
        <Text style={styles.headerSubtitle}>Налаштування</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Налаштування</Text>

          <TouchableOpacity style={styles.settingItem} onPress={fetchExchangeRates}>
            <MaterialIcons name="refresh" size={24} color="#4169E1" />
            <Text style={styles.settingText}>Оновити курси валют</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={fetchAssetPrices}>
            <FontAwesome5 name="coins" size={24} color="#4169E1" />
            <Text style={styles.settingText}>Оновити ціни активів</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="delete" size={24} color="#ff4444" />
            <Text style={[styles.settingText, styles.dangerText]}>Скинути всі дані</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Інформація про додаток</Text>
            <Text style={styles.infoText}>Finja - додаток для обліку накопичень</Text>
            <Text style={styles.infoText}>Версія: 1.0.0</Text>
            <Text style={styles.infoText}>
              Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="warning" size={48} color="#ff4444" />
            <Text style={styles.modalTitle}>Підтвердження</Text>
            <Text style={styles.modalText}>
              Ви впевнені, що хочете скинути всі дані? Цю дію неможливо скасувати.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleReset}
              >
                <Text style={styles.modalButtonTextConfirm}>Скинути</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
    color: '#333',
  },
  dangerText: {
    color: '#ff4444',
  },
  infoSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonConfirm: {
    backgroundColor: '#ff4444',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});