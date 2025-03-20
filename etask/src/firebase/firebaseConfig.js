//firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importe a função getAuth do SDK

const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.appspot.com", // Corrigido
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Crie a instância do auth com o app configurado

export { auth }; // Exportando a instância auth
