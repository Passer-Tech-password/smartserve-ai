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
import { db, auth } from "@/lib/firebase";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ------------------ LOAD MESSAGES ------------------ */
  useEffect(() => {
    const q = query(
      collection(db, "messages", chatId, "chat"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [chatId]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ SEND MESSAGE ------------------ */
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending || !auth.currentUser) return;

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
        const ticketRef = await addDoc(collection(db, "tickets"), {
          customerId: uid,
          customerName: auth.currentUser.email || null,
          issue: messageText,
          status: "open",
          priority: "medium",
          assignedAgentId: null,
          createdAt: serverTimestamp(),
          sentiment: analysis?.sentiment || "neutral",
          suggestedDepartment: analysis?.department || "general",
          aiKeywords: analysis?.keywords || [],
        });

        ticketId = ticketRef.id;

        await setDoc(chatRef, { ticketId }, { merge: true });
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
      }

      /* 6️⃣ BOT MESSAGE */
      if (botResult?.reply && !botResult?.escalate) {
        await addDoc(collection(db, "messages", chatId, "chat"), {
          text: botResult.reply,
          senderId: "smartserve-bot",
          createdAt: serverTimestamp(),
          meta: { confidence: botResult.confidence },
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
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-10">
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
      <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={sending}
        />
        <button
          disabled={sending}
          className="bg-indigo-600 text-white px-5 rounded-lg text-sm disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
