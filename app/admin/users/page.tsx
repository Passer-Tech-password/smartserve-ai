"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(userId: string, newRole: string) {
    setLoading(true);

    const token = await auth.currentUser?.getIdToken();

    await fetch("/api/admin/promote-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, newRole }),
    });

    await loadUsers();
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="bg-white rounded shadow">
        {users.map(u => (
          <div key={u.id} className="flex justify-between p-3 border-b">
            <div>
              <p className="font-medium">{u.displayName}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
              <p className="text-xs text-gray-400">Role: {u.role}</p>
            </div>

            <div className="flex gap-2">
              {u.role !== "admin" && (
                <button
                  onClick={() => changeRole(u.id, "admin")}
                  className="px-2 py-1 text-sm bg-black text-white rounded"
                  disabled={loading}
                >
                  Make Admin
                </button>
              )}

              {u.role !== "agent" && (
                <button
                  onClick={() => changeRole(u.id, "agent")}
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                  disabled={loading}
                >
                  Make Agent
                </button>
              )}

              {u.role !== "customer" && (
                <button
                  onClick={() => changeRole(u.id, "customer")}
                  className="px-2 py-1 text-sm bg-gray-600 text-white rounded"
                  disabled={loading}
                >
                  Make Customer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
