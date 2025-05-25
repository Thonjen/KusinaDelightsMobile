// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { isSupported, getAnalytics } from 'firebase/analytics';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHb9pJcElbS11Psp7Ld1bRZKlvnFBGspQ",
  authDomain: "kusinadelights-34cd3.firebaseapp.com",
  projectId: "kusinadelights-34cd3",
  storageBucket: "kusinadelights-34cd3.firebasestorage.app",
  messagingSenderId: "474360094433",
  appId: "1:474360094433:web:347b99006675136de4e1a0",
  measurementId: "G-H84G0E2XWK"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize Analytics (only if the environment supports it)
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    // Analytics is only initialized if the environment supports it
  }
});

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);