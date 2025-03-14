import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB7Ig2Y41GJtiQz8adw4s2QFo_O8LVrwHQ",
  authDomain: "e-task-78aac.firebaseapp.com",
  projectId: "e-task-78aac",
  storageBucket: "e-task-78aac.appspot.com", // Corrigido
  messagingSenderId: "873354652514",
  appId: "1:873354652514:web:a4d4c839987ac6763d9a3b"
};

const app = initializeApp(firebaseConfig);
export { app };
