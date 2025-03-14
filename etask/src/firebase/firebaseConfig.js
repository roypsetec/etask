// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.firebasestorage.app",
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app for use in other files
export { app }; // Exporte o app para ser usado em auth.js e outros arquivos que precisem
