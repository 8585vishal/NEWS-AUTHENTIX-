import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Fallback to environment variables for Vercel/Production
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
};

// Check if we have enough env vars to initialize
const hasEnvConfig = !!envConfig.apiKey && !!envConfig.projectId;

let firebaseConfig: any = envConfig;

// Use an async IIFE to handle the dynamic import safely
(async () => {
  if (import.meta.env.DEV && !hasEnvConfig) {
    try {
      // We use @vite-ignore to prevent Vite from failing the build 
      // when this file is missing (which it will be in production/GitHub).
      const module = await import(/* @vite-ignore */ "../firebase-applet-config.json");
      firebaseConfig = module.default;
      
      // Re-initialize with the correct config if found
      initializeApp(firebaseConfig);
    } catch (e) {
      console.warn("Firebase config not found in development, falling back to environment variables.");
    }
  }
})();

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
