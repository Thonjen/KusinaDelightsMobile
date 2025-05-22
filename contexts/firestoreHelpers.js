// utils/firestoreHelpers.js
import {
    doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion
  } from 'firebase/firestore';
  import { firestore } from './firebaseConfig';
  
  export const getUserDocRef = uid => doc(firestore, 'users', uid);
  
  export const fetchUserData = async uid => {
    const snap = await getDoc(getUserDocRef(uid));
    return snap.exists() ? snap.data() : null;
  };
  
  export const createUserRecord = async (uid, email) => {
    await setDoc(getUserDocRef(uid), {
      email,
      coins: 1000,
      wins: 0,
      losses: 0,
      history: [],
      currentGame: null,
    });
  };
  
  export const subscribeToUser = (uid, cb) =>
    onSnapshot(getUserDocRef(uid), docSnap => {
      if (docSnap.exists()) cb(docSnap.data());
    });
  
  export const updateUserFields = (uid, fields) =>
    updateDoc(getUserDocRef(uid), fields);
  