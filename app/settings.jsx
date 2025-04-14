import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LayoutSelection from '../components/LayoutSelection';
import { LayoutContext } from '../contexts/LayoutContext';
import { useRouter } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import SettingsHeader from '../components/SettingsHeader';

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { layout, setLayout } = useContext(LayoutContext);
  const router = useRouter();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SettingsHeader headerTitle="Settings" />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>
        <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
          <Text style={styles.buttonText}>Layout Selection</Text>
        </TouchableOpacity>
        <LayoutSelection 
          visible={modalVisible} 
          selectedLayout={layout} 
          setSelectedLayout={setLayout} 
          onClose={handleCloseModal} 
        />
      </View>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F8D64E',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
