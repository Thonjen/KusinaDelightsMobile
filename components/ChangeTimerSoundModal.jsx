// components/ChangeTimerSoundModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const soundOptions = [
  { key: 'Bell', displayName: 'Bell' },
];

const soundMapping = {
  Bell: require('../assets/sfx/Bell.mp3'),
};

const ChangeTimerSoundModal = ({ visible, onClose, onSelect }) => {
  const [selectedSound, setSelectedSound] = useState('Bell');
  const [initialSound, setInitialSound] = useState(null);
  const soundSampleRef = useRef(null);
  const timeoutRef = useRef(null);

  // load previously chosen sound
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const stored = await AsyncStorage.getItem('timerSound');
      setSelectedSound(stored || 'Bell');
      setInitialSound(stored || 'Bell');
    })();
  }, [visible]);

  // stop any playing sample
  const stopSample = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (soundSampleRef.current) {
      await soundSampleRef.current.stopAsync();
      await soundSampleRef.current.unloadAsync();
      soundSampleRef.current = null;
    }
  };

  // play 10s sample on selection
  useEffect(() => {
    if (!visible || selectedSound === initialSound) return;
    (async () => {
      await stopSample();
      const { sound } = await Audio.Sound.createAsync(soundMapping[selectedSound]);
      soundSampleRef.current = sound;
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      timeoutRef.current = setTimeout(stopSample, 10000);
    })();
    return stopSample;
  }, [selectedSound, visible]);

  const save = async () => {
    await stopSample();
    await AsyncStorage.setItem('timerSound', selectedSound);
    onSelect && onSelect(selectedSound);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Timer Sound</Text>
          {soundOptions.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionButton,
                selectedSound === opt.key && styles.selectedOption,
              ]}
              onPress={() => setSelectedSound(opt.key)}
            >
              <Ionicons
                name="musical-notes"
                size={24}
                color={selectedSound === opt.key ? "#F8D64E" : "#555"}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedSound === opt.key && styles.selectedOptionText,
                ]}
              >
                {opt.displayName}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={save}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeTimerSoundModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: { borderColor: '#F8D64E', backgroundColor: '#ffe299' },
  optionIcon: { marginRight: 10 },
  optionText: { fontSize: 16, color: '#555' },
  selectedOptionText: { color: '#F8D64E', fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelButtonText: { color: '#F00', fontSize: 16, fontWeight: 'bold' },
});
