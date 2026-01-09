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

// ------------------------------------------
// 2. Prevent Multiple App Instances & Handle Missing Config
// ------------------------------------------
let app;

// Check if config is valid
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

if (!isConfigValid) {
  if (typeof window === "undefined") {
     // Server-side / Build time: Warn but don't crash
     console.warn("Firebase configuration is missing in environment variables. Skipping initialization.");
  } else {
     // Client-side: Warn aggressively, app will likely break
     console.error("Firebase configuration is missing in .env.local! App will not function correctly.");
  }
} else {
  try {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
      console.error("Firebase initialization failed:", error);
  }
}

// ------------------------------------------
// 3. Export Firebase Services
// ------------------------------------------
// Use casts or fallbacks to prevent import crashes if app is undefined
// Note: Using these services without valid config will throw at runtime, which is expected.
export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export const functions = app ? getFunctions(app, "us-central1") : ({} as any);

// Default export
export default app;
