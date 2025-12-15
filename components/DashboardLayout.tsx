"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "agent";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">SmartServe</h2>

        <nav className="space-y-4">
          <Link href={`/${role}`} className="block hover:text-indigo-600">
            Dashboard
          </Link>

          {role === "admin" && (
            <>
              <Link
                href="/admin/tickets"
                className="block hover:text-indigo-600"
              >
                All Tickets
              </Link>
              <Link
                href="/admin/agents"
                className="block hover:text-indigo-600"
              >
                Agents
              </Link>
              <Link
                href="/admin/analytics"
                className="block hover:text-indigo-600"
              >
                Analytics
              </Link>
            </>
          )}

          {role === "agent" && (
            <>
              <Link
                href="/agent/tickets"
                className="block hover:text-indigo-600"
              >
                My Tickets
              </Link>
              <Link href="/agent/chat" className="block hover:text-indigo-600">
                Live Chat
              </Link>
            </>
          )}

          <Link href="/login" className="block text-red-500">
            Logout
          </Link>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE TOP BAR */}
        <header className="md:hidden flex items-center justify-between bg-white p-4 shadow">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-700 text-2xl"
          >
            ☰
          </button>

          <h1 className="font-semibold text-indigo-600">SmartServe</h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
