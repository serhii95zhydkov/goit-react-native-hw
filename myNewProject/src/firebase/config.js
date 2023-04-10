import { initializeApp } from "firebase/app";

import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCc5UAVy4uHJOy9aZ5qsRmyunKNkwP5ZdM",
  authDomain: "my-first-project-19b37.firebaseapp.com",
  projectId: "my-first-project-19b37",
  storageBucket: "my-first-project-19b37.appspot.com",
  messagingSenderId: "287015580846",
  appId: "1:287015580846:web:96492522e3d148d000693f",
  measurementId: "G-SH3FWNEN3J",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);