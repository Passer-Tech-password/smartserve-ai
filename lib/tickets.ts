import { db } from "@/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

export async function getTicket(ticketId: string) {
  const snap = await getDoc(doc(db, "tickets", ticketId));
  return snap.exists() ? snap.data() : null;
}

export async function createTicket(data: any) {
  return await addDoc(collection(db, "tickets"), data);
}
