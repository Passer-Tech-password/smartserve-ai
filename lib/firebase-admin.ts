// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app;
try {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountEnv) {
    // Trim whitespace around the whole string
    let raw = serviceAccountEnv.trim();

    // Remove surrounding single or double quotes if present
    if (
      (raw.startsWith("'") && raw.endsWith("'")) ||
      (raw.startsWith('"') && raw.endsWith('"'))
    ) {
      raw = raw.slice(1, -1);
    }

    // Parse JSON
    const serviceAccount = JSON.parse(raw);

    // Fix: Handle escaped newlines in private_key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // Initialize Firebase Admin
    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert(serviceAccount),
          })
        : getApps()[0];
  } else {
    // Check if we are in build mode, if so, we might not need the app
    if (process.env.NODE_ENV !== 'production') {
        console.warn("FIREBASE_SERVICE_ACCOUNT not found. Skipping Firebase Admin init.");
    }
  }
} catch (e) {
  console.warn(`Firebase admin init failed: ${(e as Error).message}`);
  console.warn("Continuing without Firebase Admin SDK...");
}

// Export mock or real instances
// This prevents build failures if env vars are missing/invalid
export const adminAuth = app ? getAuth(app) : ({} as any);
export const adminDB = app ? getFirestore(app) : ({} as any);
