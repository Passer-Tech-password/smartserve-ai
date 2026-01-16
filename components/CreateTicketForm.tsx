"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CreateTicketForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const issue = e.target.issue.value;

    const ref = await addDoc(collection(db, "tickets"), {
      customerId: auth.currentUser?.uid,
      customerName: auth.currentUser?.email,
      issue,
      status: "open",
      priority: "medium",
      assignedAgentId: null,
      createdAt: new Date(),
    });

    try {
      await fetch("/api/tickets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ref.id }),
      });
    } catch (err) {
      console.error("Ticket auto-assign failed", err);
    }

    router.push(`/customer/tickets/${ref.id}`);

    e.target.reset();
    setLoading(false);
    alert("Ticket created successfully!");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Create Support Ticket</h2>

      <textarea
        name="issue"
        placeholder="Describe your problem..."
        className="w-full border p-3 rounded-lg"
        required
      />

      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}
