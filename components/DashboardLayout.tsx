"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "agent";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
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
          fixed md:static z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SmartServe</h2>
          <ThemeToggle className="md:hidden" />
        </div>

        <nav className="space-y-4">
          <Link href={`/${role}`} className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
            Dashboard
          </Link>

          {role === "admin" && (
            <>
              <Link
                href="/admin/tickets"
                className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                All Tickets
              </Link>
              <Link
                href="/admin/users"
                className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Users
              </Link>
              <Link
                href="/admin/analytics"
                className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Analytics
              </Link>
            </>
          )}

          {role === "agent" && (
            <>
              <Link
                href="/agent/tickets"
                className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                My Tickets
              </Link>
              <Link href="/agent/chat" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Live Chat
              </Link>
            </>
          )}
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
               <ThemeToggle />
             </div>
             <Link href="/login" className="block text-red-500 hover:text-red-600 font-medium">
              Logout
            </Link>
          </div>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE TOP BAR */}
        <header className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-700 dark:text-gray-200 text-2xl"
          >
            ☰
          </button>

          <h1 className="font-semibold text-indigo-600 dark:text-indigo-400">SmartServe</h1>
          
          {/* Spacer for centering logic if needed, or maybe just a placeholder */}
          <div className="w-6"></div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 overflow-auto text-gray-800 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
