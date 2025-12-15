// app/api/tickets/assign/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin once
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
 * { ticketId: string, preferDepartment?: string }
 *
 * Behavior:
 * - finds agent with role "agent" and smallest activeTickets count
 * - updates ticket.assignedAgentId and ticket.status = "in_progress"
 * - increments agent.activeTickets counter
 */
export async function POST(req: Request) {
  try {
    const { ticketId, preferDepartment } = await req.json();
    if (!ticketId)
      return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

    // Read ticket
    const ticketRef = firestore.collection("tickets").doc(ticketId);
    const ticketSnap = await ticketRef.get();
    if (!ticketSnap.exists)
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const ticket = ticketSnap.data() || {};

    // Query agents
    let agentsQ = firestore.collection("users").where("role", "==", "agent");
    // optional: filter by department if agent has department field
    if (preferDepartment) {
      agentsQ = agentsQ.where(
        "departments",
        "array-contains",
        preferDepartment
      );
    }

    const agentsSnap = await agentsQ.get();
    if (agentsSnap.empty) {
      return NextResponse.json(
        { error: "No agents available" },
        { status: 200 }
      );
    }

    // Pick agent with smallest activeTickets
    let pick: { id: string; data: any } | null = null;
    agentsSnap.forEach(doc => {
      const data = doc.data();
      const active = Number(data.activeTickets || 0);
      if (!pick || active < Number(pick.data.activeTickets || 0)) {
        pick = { id: doc.id, data };
      }
    });

    if (!pick)
      return NextResponse.json({ error: "No agent selected" }, { status: 500 });

    // Use transaction to avoid race
    await firestore.runTransaction(async tx => {
      const agentRef = firestore.collection("users").doc(pick!.id);
      const agentSnap = await tx.get(agentRef);
      const agentData = agentSnap.exists ? agentSnap.data() : {};
      const newActive = (agentData?.activeTickets || 0) + 1;

      tx.update(agentRef, { activeTickets: newActive });
      tx.update(ticketRef, {
        assignedAgentId: pick!.id,
        status: "in_progress",
        assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // Optionally create a notification for the assigned agent (can be consumed by client)
    const notifRef = firestore
      .collection("users")
      .doc(pick.id)
      .collection("notifications")
      .doc();
    await notifRef.set({
      title: "New ticket assigned",
      ticketId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    return NextResponse.json({ assignedAgentId: pick.id, agent: pick.data });
  } catch (err: any) {
    console.error("Assign ticket error:", err);
    return NextResponse.json(
      { error: err.message || "unknown" },
      { status: 500 }
    );
  }
}
