import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verify-admin";
import { adminDB } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify that requester is an ADMIN
    await verifyAdmin(token);

    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (!["admin", "agent", "customer"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // ✅ Update role securely
    await adminDB.collection("users").doc(userId).update({
      role: newRole,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
