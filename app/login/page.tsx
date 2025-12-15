"use client";

import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      // LOGIN
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // FETCH USER ROLE FROM FIRESTORE
      const userRef = doc(db, "users", userCred.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Your account is missing a role. Contact support.");
        setLoading(false);
        return;
      }

      const userRole = userSnap.data().role;

      // SAFE ROLE CHECK
      if (!userRole) {
        setError("No role assigned to this account.");
        setLoading(false);
        return;
      }

      // REDIRECT BASED ON ROLE
      switch (userRole) {
        case "admin":
          router.push("/admin");
          break;
        case "agent":
          router.push("/agent");
          break;
        case "customer":
          router.push("/customer");
          break;
        default:
          setError("Invalid role. Contact support.");
      }
    } catch (err: any) {
      // HANDLE FIREBASE ERRORS
      const code = err.code;

      if (code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError(err.message || "Something went wrong. Try again.");
      }
    }

    setLoading(false);
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SmartServe</h1>
          <p className="text-gray-500 mt-1">AI-Powered Customer Care System</p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            required
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2"
          />

          <div className="flex justify-between text-sm">
            <label className="flex gap-2 items-center">
              <input type="checkbox" /> Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
