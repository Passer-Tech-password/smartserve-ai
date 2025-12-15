// lib/auth.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as fbSignOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);
  return user;
}

/**
 * fetch user profile from users/{uid} doc (contains role)
 */
export async function fetchUserProfile(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

export async function signOut() {
  await fbSignOut(auth);
}
