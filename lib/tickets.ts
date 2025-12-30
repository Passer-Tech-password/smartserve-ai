import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export type Ticket = {
  id?: string;
  title: string;
  description?: string;
  status?: "open" | "closed";
  createdBy: string;
  createdAt?: any;
};

export async function getTicket(ticketId: string): Promise<Ticket | null> {
  const snap = await getDoc(doc(db, "tickets", ticketId));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Ticket, "id">),
  };
}

export async function createTicket(data: Ticket) {
  return await addDoc(collection(db, "tickets"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "open",
  });
}
