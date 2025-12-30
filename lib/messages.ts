import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt?: any;
};

export async function getMessages(ticketId: string): Promise<Message[]> {
  const q = query(
    collection(db, "tickets", ticketId, "messages"),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Message, "id">),
  }));
}
