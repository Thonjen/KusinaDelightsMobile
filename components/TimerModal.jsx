import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const TimerModal = ({ visible, onClose, onStart }) => {
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  const handleStart = () => {
    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      Alert.alert('Invalid Time', 'Please set a valid time.');
      return;
    }
    onStart(totalSeconds);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Timer</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="numeric"
              placeholder="Min"
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              style={styles.input}
              value={seconds}
              onChangeText={setSeconds}
              keyboardType="numeric"
              placeholder="Sec"
            />
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 50,
    height: 40,
    textAlign: 'center',
    borderRadius: 5,
  },
  colon: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  startButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#F00',
    fontSize: 16,
  },
});
