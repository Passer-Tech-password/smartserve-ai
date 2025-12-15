// app/api/notifications/notifyAgent/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var is required for admin operations"
    );
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const firestore = admin.firestore();

/**
 * POST body:
 * { agentId: string, title: string, body?: string, ticketId?: string }
 *
 * Writes a notifications doc under users/{agentId}/notifications and optionally
 * POSTs to an external webhook (NOTIFY_WEBHOOK_URL) for push/email.
 */
export async function POST(req: Request) {
  try {
    const { agentId, title, body, ticketId } = await req.json();
    if (!agentId || !title)
      return NextResponse.json(
        { error: "Missing agentId or title" },
        { status: 400 }
      );

    const notifRef = firestore
      .collection("users")
      .doc(agentId)
      .collection("notifications")
      .doc();
    await notifRef.set({
      title,
      body: body || null,
      ticketId: ticketId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    // Optional external webhook (e.g., push gateway or email service)
    if (process.env.NOTIFY_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFY_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            title,
            body,
            ticketId,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn("External notify webhook failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("notifyAgent error:", err);
    return NextResponse.json(
      { error: err.message || "unknown" },
      { status: 500 }
    );
  }
}
