import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RemoveUserAlert = ({ visible, recipeCount, onCancel, onConfirm }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Remove User</Text>
        <Text style={styles.message}>
          {recipeCount > 0
            ? `This user has ${recipeCount} recipe${recipeCount > 1 ? 's' : ''}. Are you sure you want to remove them?`
            : 'Are you sure you want to remove this user?'}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default RemoveUserAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  message: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%' 
  },
  button: {
    backgroundColor: '#F8D64E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  confirmButton: { 
    backgroundColor: 'red' 
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
});
