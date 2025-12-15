"use client";

import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function CustomerChatPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              SmartServe Support
            </h1>
            <p className="text-xs text-gray-500">
              Chat with our AI assistant or support agent
            </p>
          </div>

          <Link
            href="/customer"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4">
        <div className="h-full bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <ChatBox chatId="default-chat" />
        </div>
      </main>
    </div>
  );
}
