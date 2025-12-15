"use client";

import Link from "next/link";
import CreateTicketForm from "@/components/CreateTicketForm";
import CustomerTicketsList from "@/components/CustomerTicketsList";

export default function CustomerTicketsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              My Support Tickets
            </h1>
            <p className="text-sm text-gray-500">
              Create and track your support requests
            </p>
          </div>

          <Link
            href="/customer"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Ticket */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold mb-3">Create New Ticket</h2>
            <CreateTicketForm />
          </div>
        </div>

        {/* Ticket List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-4 h-full">
            <h2 className="font-semibold mb-3">My Tickets</h2>
            <CustomerTicketsList />
          </div>
        </div>
      </main>
    </div>
  );
}
