import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
if (!getApps().length) initializeApp(cfg);
const db = getFirestore();

export default async function handler(req, res) {
  const { conversationId } = req.query;
  if (!conversationId)
    return res.status(400).json({ error: "conversationId required" });
  const ref = doc(db, "conversations", conversationId);
  await setDoc(
    ref,
    { title: "Demo", createdAt: serverTimestamp(), status: "open" },
    { merge: true }
  );
  res.status(200).json({ ok: true });
}
