// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// ------------------------------------------
// 1. Firebase Config (SECURE - ENV Variables)
// ------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Validate env vars
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
  throw new Error("Firebase configuration is missing in .env.local");
}

// ------------------------------------------
// 2. Prevent Multiple App Instances
// ------------------------------------------
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ------------------------------------------
// 3. Export Firebase Services
// ------------------------------------------
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");

// Default export
export default app;
