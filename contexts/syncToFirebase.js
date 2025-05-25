// contexts/syncToFirebase.js

import { db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';

// Per-item sync helper
export async function syncOneToFirebase(collectionName, item, op = 'set') {
  const ref = doc(db, collectionName, item.id);
  if (op === 'delete') {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, item);
  }
}

// Full bi-directional sync (run once at start)
export async function syncAllToFirebase() {
  const MAP = {
    KusinaDelights_USERS:      'users',
    KusinaDelights_USER_PROFILES: 'profiles',
    KusinaDelights_RECIPES:    'recipes',
    KusinaDelights_REVIEWS:    'reviews',
    KusinaDelights_CHEFS:      'chefs',
    KusinaDelights_FAVORITES:  'favorites',
  };

  try {
    await Promise.all(Object.entries(MAP).map(async ([key, col]) => {
      const localJson = await AsyncStorage.getItem(key);
      const localData = localJson ? JSON.parse(localJson) : [];
      const snap = await getDocs(collection(db, col));
      const remoteData = snap.docs.map(d => d.data());

      const localMap = new Map(localData.map(i => [i.id, i]));
      const remoteMap = new Map(remoteData.map(i => [i.id, i]));

      const batch = writeBatch(db);

      // Push local → Firebase if newer
      for (const item of localData) {
        const r = remoteMap.get(item.id);
        if (!r || new Date(item.lastUpdated) > new Date(r.lastUpdated)) {
          batch.set(doc(db, col, item.id), item);
        }
      }

      // Merge Firebase → local
      for (const item of remoteData) {
        const l = localMap.get(item.id);
        if (!l || new Date(item.lastUpdated) > new Date(l.lastUpdated)) {
          localMap.set(item.id, item);
        }
      }

      await batch.commit();

      // Remove outdated local data before updating
      const mergedData = Array.from(localMap.values());
      await AsyncStorage.setItem(key, JSON.stringify(mergedData));

      console.log(`✅ syncAllToFirebase completed for ${key}`);
    }));
  } catch (e) {
    console.error('❌ syncAllToFirebase error', e);
  }
}


// Real-time listeners
export function startRealtimeSync() {
  const MAP = {
    KusinaDelights_USERS:         'users',
    KusinaDelights_USER_PROFILES: 'profiles',
    KusinaDelights_RECIPES:       'recipes',
    KusinaDelights_REVIEWS:       'reviews',
    KusinaDelights_CHEFS:         'chefs',
    KusinaDelights_FAVORITES:     'favorites',
  };

  Object.entries(MAP).forEach(([storageKey, col]) => {
    onSnapshot(collection(db, col), async snap => {
      const remote = snap.docs.map(d => d.data());
      const localJson = await AsyncStorage.getItem(storageKey);
      const localData = localJson ? JSON.parse(localJson) : [];
      const localMap = new Map(localData.map(i => [i.id, i]));

      let dirty = false;

      // Check if remote data is newer than local data and update
      for (const item of remote) {
        const l = localMap.get(item.id);
        if (!l || new Date(item.lastUpdated) > new Date(l.lastUpdated)) {
          // If the local data is outdated or missing, update local storage
          localMap.set(item.id, item);
          dirty = true;
        }
      }

      if (dirty) {
        const merged = Array.from(localMap.values());

        // Clear outdated data in AsyncStorage
        await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
        console.log(`🔄 Realtime update applied to ${storageKey}`);

        // ** New: if this was the profiles collection, also update "currentUser" **
        if (storageKey === 'KusinaDelights_USER_PROFILES') {
          const currentRaw = await AsyncStorage.getItem('currentUser');
          if (currentRaw) {
            const current = JSON.parse(currentRaw);
            const profile = merged.find(p => p.userID === current.id);
            if (profile && profile.profileImage && profile.profileImage !== current.profileImage) {
              current.profileImage = profile.profileImage;
              await AsyncStorage.setItem('currentUser', JSON.stringify(current));
              console.log('🔄 Updated currentUser profileImage in AsyncStorage');
            }
          }
        }
      }
    });
  });
}

