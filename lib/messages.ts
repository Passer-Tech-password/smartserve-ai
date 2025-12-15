import { db } from "@/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function getMessages(ticketId: string) {
  const snap = await getDocs(collection(db, "tickets", ticketId, "messages"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function sendMessage(ticketId: string, message: any) {
  return await addDoc(collection(db, "tickets", ticketId, "messages"), message);
}
