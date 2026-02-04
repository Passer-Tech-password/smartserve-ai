"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function AgentTicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchTicket() {
      const ref = doc(db, "tickets", id as string);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        router.push("/agent/tickets");
        return;
      }
      setTicket({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    fetchTicket();
  }, [id, router]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading ticket...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              Ticket Details
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ticket ID: {ticket.id}</p>
          </div>
          <Link
            href="/agent/tickets"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Tickets
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 lg:col-span-1 transition-colors">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-white">Ticket Information</h2>
          <InfoRow label="Customer" value={ticket.customerName} />
          <InfoRow label="Issue" value={ticket.issue} />
          <InfoRow label="Status" value={ticket.status} />
          <InfoRow label="Priority" value={ticket.priority} />
          <InfoRow label="Sentiment" value={ticket.sentiment} />
          <InfoRow label="Department" value={ticket.suggestedDepartment} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 lg:col-span-2 flex flex-col transition-colors">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-white">Conversation</h2>
          <div className="flex-1 min-h-[300px]">
            <ChatBox chatId={ticket.id} />
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p>
    </div>
  );
}
