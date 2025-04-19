// app/settings.jsx

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LayoutContext } from '../contexts/LayoutContext';
import HeaderCenter from '../components/HeaderCenter';
import BottomNavbar from '../components/BottomNavbar';
import LayoutSelection from '../components/LayoutSelection';
import FloatingFeaturesToggleModal from '../components/FloatingFeaturesToggleModal';
import ChangeTimerSoundModal from '../components/ChangeTimerSoundModal';
import PrivacyModal from '../components/PrivacyModal';
import TermsModal from '../components/TermsModal';

export default function Settings() {
  const router = useRouter();
  const { layout, setLayout } = useContext(LayoutContext);

  const [currentUser, setCurrentUser] = useState(null);
  const [layoutModal, setLayoutModal] = useState(false);
  const [floatingModal, setFloatingModal] = useState(false);
  const [soundModal, setSoundModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);

  useEffect(() => {
    (async () => {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) setCurrentUser(JSON.parse(userStr));
    })();
  }, []);

  const handleVisitProfile = () => {
    router.push('/profile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleExitApp = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCenter headerTitle="Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Account Card */}
        {currentUser && (
          <View style={styles.accountCard}>
            {currentUser.profileImage ? (
              <Image
                source={{ uri: currentUser.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={60} color="#666" />
            )}
            <View style={styles.accountInfo}>
              <Text style={styles.username}>{currentUser.username}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.visitButton}
              onPress={handleVisitProfile}
            >
              <Ionicons name="eye-outline" size={16} color="#FFF" />
              <Text style={styles.visitButtonText}>Visit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.separator} />

        {/* App Settings */}
        <Text style={styles.sectionHeader}>App Settings</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setLayoutModal(true)}
        >
          <Ionicons name="layers-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Layout Selection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setFloatingModal(true)}
        >
          <Ionicons name="apps-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Floating Features</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setSoundModal(true)}
        >
          <Ionicons name="musical-notes-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Change Timer Sound</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* About */}
        <Text style={styles.sectionHeader}>About</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setPrivacyModal(true)}
        >
          <Ionicons name="lock-closed-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setTermsModal(true)}
        >
          <Ionicons name="document-text-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Account */}
        <Text style={styles.sectionHeader}>Account</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={handleExitApp}
        >
          <Ionicons name="exit-outline" size={20} style={styles.rowIcon} />
          <Text style={styles.rowText}>Exit App</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <LayoutSelection
        visible={layoutModal}
        selectedLayout={layout}
        setSelectedLayout={setLayout}
        onClose={() => setLayoutModal(false)}
      />
      <FloatingFeaturesToggleModal
        visible={floatingModal}
        onClose={() => setFloatingModal(false)}
      />
      <ChangeTimerSoundModal
        visible={soundModal}
        onClose={() => setSoundModal(false)}
      />
      <PrivacyModal
        visible={privacyModal}
        onClose={() => setPrivacyModal(false)}
      />
      <TermsModal
        visible={termsModal}
        onClose={() => setTermsModal(false)}
      />

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 16 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  accountInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: '600' },
  email: { fontSize: 14, color: '#666' },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  visitButtonText: { color: '#FFF', marginLeft: 6, fontWeight: '600' },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  rowIcon: { marginRight: 12, color: '#333' },
  rowText: { fontSize: 16, color: '#333' },
});
