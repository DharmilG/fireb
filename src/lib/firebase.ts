// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgEnwRwhxfLlZaZEqd7zmBWorcFtQVEao",
  authDomain: "coast-watcher.firebaseapp.com",
  projectId: "coast-watcher",
  storageBucket: "coast-watcher.firebasestorage.app",
  messagingSenderId: "1072524054266",
  appId: "1:1072524054266:web:4cdbd4d380e9532036c343"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
