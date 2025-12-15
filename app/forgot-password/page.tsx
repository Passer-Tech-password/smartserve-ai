"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const email = form.email.value;

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    }

    setLoading(false);
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Reset Your Password
        </h2>

        {sent ? (
          <p className="text-green-600 text-center font-medium">
            Password reset link sent to your email ✅
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                {error}
              </div>
            )}

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-6">
          Back to{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
