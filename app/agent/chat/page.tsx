"use client";

import ChatBox from "@/components/ChatBox";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentChatPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-900 text-white font-bold">
        Agent Live Chat
      </header>

      <ChatBox chatId="default-chat" />
    </div>
  );
}
