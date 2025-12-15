"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Link from "next/link";

type Ticket = {
  id: string;
  issue: string;
  status: string;
  createdAt?: any;
  priority?: string;
};

export default function CustomerTicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "tickets"),
      where("customerId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Ticket, "id">),
      }));

      setTickets(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading tickets...</p>;
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        You haven’t created any tickets yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map(ticket => (
        <Link
          key={ticket.id}
          href={`/customer/tickets/${ticket.id}`}
          className="block"
        >
          <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 cursor-pointer transition">
            {/* Left */}
            <div>
              <p className="font-medium text-gray-800 line-clamp-2">
                {ticket.issue}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ticket ID: {ticket.id.slice(0, 8)}...
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }: { status: string }) {
  const base = "text-xs font-medium px-3 py-1 rounded-full capitalize";

  if (status === "open") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>Open</span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className={`${base} bg-blue-100 text-blue-700`}>In Progress</span>
    );
  }

  if (status === "resolved") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>Resolved</span>
    );
  }

  return <span className={`${base} bg-gray-200 text-gray-700`}>{status}</span>;
}
