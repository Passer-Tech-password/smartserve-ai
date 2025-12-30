import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  email: string;
  role: "admin" | "agent" | "customer";
  name?: string;
  createdAt?: any;
};

export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return {
    uid: snap.id,
    ...(snap.data() as Omit<UserProfile, "uid">),
  };
}
