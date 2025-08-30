// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "FAKE_API_KEY",
  authDomain: "FAKE_AUTH_DOMAIN",
  projectId: "FAKE_PROJECT_ID",
  storageBucket: "FAKE_STORAGE_BUCKET",
  messagingSenderId: "FAKE_MESSAGING_SENDER_ID",
  appId: "FAKE_APP_ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
