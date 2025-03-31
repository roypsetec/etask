// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importe o Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.appspot.com",
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Instâncias do Firebase Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Cria a instância do Firestore

export { auth, db }; // Exporta o Firestore para ser usado em outras partes do app
