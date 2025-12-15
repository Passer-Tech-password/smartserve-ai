import { adminAuth, adminDB } from "./firebase-admin";

export async function verifyAdmin(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);

  const userDoc = await adminDB.collection("users").doc(decoded.uid).get();

  if (!userDoc.exists) throw new Error("User profile not found");

  if (userDoc.data()?.role !== "admin") {
    throw new Error("Not an admin");
  }

  return decoded;
}
