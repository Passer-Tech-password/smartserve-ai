"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth, firebaseReady } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { TicketBuilder } from "@/lib/TicketBuilder";
import MessageBubble from "./MessageBubble";
import { useRouter, usePathname } from "next/navigation";

export default function ChatBox({ chatId }: { chatId: string }) {
  const user = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* ------------------ LOAD MESSAGES ------------------ */
  useEffect(() => {
    if (!firebaseReady || !user) return;
    
    const q = query(
      collection(db, "messages", chatId, "chat"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Chat snapshot error:", error);
    });

    return () => unsub();
  }, [chatId, user]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ SEND MESSAGE ------------------ */
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    if (!firebaseReady) {
      console.error("Firebase not initialized – check environment variables.");
      return;
    }
    if (!auth.currentUser) {
      console.error("User not authenticated – please sign in to chat.");
      return;
    }

    setSending(true);

    const uid = auth.currentUser.uid;
    const messageText = text.trim();
    setText("");

    try {
      /* 1️⃣ SAVE USER MESSAGE */
      await addDoc(collection(db, "messages", chatId, "chat"), {
        text: messageText,
        senderId: uid,
        createdAt: serverTimestamp(),
      });

      /* 2️⃣ CHECK IF CHAT ALREADY HAS A TICKET */
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      let ticketId = chatSnap.exists() ? chatSnap.data()?.ticketId : null;

      /* 3️⃣ AI ANALYSIS */
      let analysis: any = null;
      try {
        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: messageText }),
        });
        analysis = await res.json();
      } catch (err) {
        console.error("AI analysis failed", err);
      }

      /* 4️⃣ CREATE TICKET ONLY ON FIRST MESSAGE */
      if (!ticketId) {
        const ticket = new TicketBuilder(uid, messageText)
          .setCustomerName(auth.currentUser.email || null)
          .setSentiment(analysis?.sentiment || "neutral")
          .setSuggestedDepartment(analysis?.department || "general")
          .setAiKeywords(analysis?.keywords || [])
          .build();

        const ticketRef = await addDoc(collection(db, "tickets"), ticket);

        ticketId = ticketRef.id;

        await setDoc(chatRef, { ticketId }, { merge: true });

        if (pathname?.startsWith("/customer")) {
          router.push(`/customer/tickets/${ticketId}`);
          return;
        } else if (pathname?.startsWith("/agent")) {
          router.push(`/agent/tickets/${ticketId}`);
          return;
        }
      }

      /* 4.1️⃣ AUTO ASSIGN TO AGENT */
      try {
        await fetch("/api/tickets/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketId,
            preferDepartment: analysis?.department,
          }),
        });
      } catch (err) {
        console.error("Ticket auto-assign failed", err);
      }

      /* 5️⃣ AI RESPONSE */
      let botResult: any = null;
      try {
        const r = await fetch("/api/ai/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: messageText,
            recentMessages: [{ role: "user", content: messageText }],
          }),
        });

        botResult = await r.json();
      } catch (err) {
        console.error("AI respond failed", err);
        botResult = {
          reply:
            "I'm having trouble connecting to my brain right now. Please wait a moment while a human agent reviews your request.",
          confidence: 0,
          escalate: true,
        };
      }

      /* 6️⃣ BOT MESSAGE (always add reply) */
      if (botResult?.reply) {
        await addDoc(collection(db, "messages", chatId, "chat"), {
          text: botResult.reply,
          senderId: "smartserve-bot",
          createdAt: serverTimestamp(),
          meta: { confidence: botResult?.confidence },
        });
      }

      /* 7️⃣ ESCALATION */
      if (botResult?.escalate) {
        await setDoc(
          chatRef,
          {
            escalate: true,
            escalateReason: botResult.reason || "AI escalation",
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Send message failed", err);
    }

    setSending(false);
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!firebaseReady && (
          <p className="text-sm text-red-600 text-center mt-4">
            Firebase is not configured. Please set environment variables and redeploy.
          </p>
        )}
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">
            👋 Say hello! Our AI assistant is ready to help.
          </p>
        )}

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isMe={msg.senderId === auth.currentUser?.uid}
            isBot={msg.senderId === "smartserve-bot"}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex gap-2 transition-colors">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
          disabled={sending || !firebaseReady}
        />
        <button
          disabled={sending || !firebaseReady}
          className="bg-indigo-600 text-white px-5 rounded-lg text-sm disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
