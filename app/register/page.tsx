"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    try {
      // Create Auth Account
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save Profile in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role, // "agent" or "customer"
        createdAt: serverTimestamp(),
      });

      router.push("/login");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Registration failed. Try again.");
      }
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-2"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-2"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-2"
              required
              minLength={6}
            />

            <select
              name="role"
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="customer">Customer</option>
              <option value="agent">Support Agent</option>
              <option value="admin">Admin (Dev Mode)</option>
            </select>

            <button
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full p-2 rounded-lg transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
