// components/alerts/TimerAlert.jsx

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimerAlert = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Time's Up!</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default TimerAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  container: {
    width: '70%', backgroundColor: '#FFF',
    borderRadius: 12, padding: 20, alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  button: {
    marginTop: 10, backgroundColor: '#F8D64E',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8,
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
});
