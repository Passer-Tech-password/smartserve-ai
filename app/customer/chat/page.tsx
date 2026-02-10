"use client";

import ChatBox from "@/components/ChatBox";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomerChatPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

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
