"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, signOut } from "@/lib/auth";
import Link from "next/link";

export default function CustomerPage() {
  const user = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">SmartServe</h1>
          <button
            onClick={() => signOut()}
            className="text-sm text-red-600 hover:underline"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome 👋</h2>
          <p className="text-gray-500 mt-1">
            Get help, track issues, and chat with support anytime.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Chat Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Start a Conversation
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Chat with our AI assistant or a support agent for quick help.
              </p>
            </div>

            <Link
              href="/customer/chat"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Open Chat
            </Link>
          </div>

          {/* Tickets Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                My Tickets
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                View and track the status of your support tickets.
              </p>
            </div>

            <Link
              href="/customer/tickets"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              View Tickets
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h4 className="font-semibold text-blue-800">Need help faster?</h4>
          <p className="text-sm text-blue-700 mt-1">
            Our AI assistant can answer common questions instantly before
            connecting you to a human agent.
          </p>
        </div>
      </main>
    </div>
  );
}
