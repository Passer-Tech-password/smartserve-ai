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

    // Pick agent with smallest activeTickets (TypeScript-safe)
    const agents = agentsSnap.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
    }));

    if (agents.length === 0) {
      return NextResponse.json(
        { error: "No agents available" },
        { status: 200 }
      );
    }

    const selected = agents.reduce((prev, curr) => {
      const prevActive = Number(prev.data.activeTickets || 0);
      const currActive = Number(curr.data.activeTickets || 0);
      return currActive < prevActive ? curr : prev;
    });

    // Extract immutable values
    const agentId: string = selected.id;
    const agentData = selected.data;

    // Use transaction to avoid race conditions
    await firestore.runTransaction(async tx => {
      const agentRef = firestore.collection("users").doc(agentId);
      const agentSnap = await tx.get(agentRef);
      const agentDataTx = agentSnap.exists ? agentSnap.data() : {};
      const newActive = (agentDataTx?.activeTickets || 0) + 1;

      tx.update(agentRef, { activeTickets: newActive });
      tx.update(ticketRef, {
        assignedAgentId: agentId,
        status: "in_progress",
        assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // Create notification
    const notifRef = firestore
      .collection("users")
      .doc(agentId)
      .collection("notifications")
      .doc();

    await notifRef.set({
      title: "New ticket assigned",
      ticketId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    return NextResponse.json({
      assignedAgentId: agentId,
      agent: agentData,
    });
  } catch (err: any) {
    console.error("Assign ticket error:", err);
    return NextResponse.json(
      { error: err.message || "unknown" },
      { status: 500 }
    );
  }
}
