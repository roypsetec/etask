// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.firebasestorage.app",
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b",
  measurementId: "G-JVQZ01G1N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);