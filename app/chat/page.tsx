"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatPage() {
  const user = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // subscribe to general chat messages (or ticket-specific path)
    const q = query(
      collection(db, "globalMessages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!text.trim() || !user) return;
    await addDoc(collection(db, "globalMessages"), {
      text,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      createdAt: serverTimestamp(),
      role: "customer",
    });
    setText("");
    // scroll to bottom
    setTimeout(() => listRef.current?.scrollTo({ top: 99999 }), 100);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Support Chat</h1>

        <div className="bg-white rounded shadow h-[60vh] p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4" ref={listRef}>
            {messages.map(m => (
              <div
                key={m.id}
                className={`mb-3 max-w-xs ${
                  m.senderId === user?.uid ? "ml-auto text-right" : ""
                }`}
              >
                <div className="text-xs text-gray-500">{m.senderName}</div>
                <div className="inline-block bg-gray-100 px-3 py-2 rounded">
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
// +// File: smartserve/app/chat/page.tsx