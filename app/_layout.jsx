import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { LayoutProvider } from '../contexts/LayoutContext';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { syncAllToFirebase, startRealtimeSync } from '../contexts/syncToFirebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InnerApp = () => {
  const { setLoading } = useLoading();


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Clear local storage first
        const keysToClear = [
          'KusinaDelights_USERS',
          'KusinaDelights_USER_PROFILES',
          'KusinaDelights_RECIPES',
          'KusinaDelights_REVIEWS',
          'KusinaDelights_CHEFS',
          'KusinaDelights_FAVORITES',
          'currentUser',
        ];

        await AsyncStorage.multiRemove(keysToClear);
        console.log('🧹 Cleared AsyncStorage for:', keysToClear.join(', '));

        // Then sync from Firestore
        console.log('🔄 Starting initial sync...');
        await syncAllToFirebase();
        console.log('✅ Initial sync completed.');

        console.log('🔄 Starting real-time sync...');
        startRealtimeSync();
        console.log('✅ Real-time sync started.');
      } catch (error) {
        
        console.error('❌ Error during sync initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [setLoading]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <LoadingProvider>
      <LayoutProvider>
        <InnerApp />
      </LayoutProvider>
    </LoadingProvider>
  );
}
