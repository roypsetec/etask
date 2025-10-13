// firebaseConfig.js
import { initializeApp } from "firebase/app";
// Importações necessárias para a persistência
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.appspot.com",
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b"
};

const app = initializeApp(firebaseConfig);

// Modificação aqui: usamos initializeAuth com a persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app); 

export { auth, db };