"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function TicketList({ role }: { role: "admin" | "agent" }) {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const q =
      role === "admin"
        ? query(collection(db, "tickets"))
        : query(
            collection(db, "tickets"),
            where("assignedAgentId", "==", auth.currentUser?.uid)
          );

    const unsub = onSnapshot(q, snap => {
      setTickets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [role]);

  async function updateStatus(id: string, status: string) {
    await updateDoc(doc(db, "tickets", id), { status });
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto mt-6">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Issue</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id} className="border-t">
              <td className="p-3">{ticket.customerName}</td>
              <td className="p-3">{ticket.issue}</td>
              <td className="p-3 capitalize">{ticket.status}</td>
              <td className="p-3 space-x-2">
                {ticket.status !== "resolved" && (
                  <button
                    onClick={() => updateStatus(ticket.id, "resolved")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
