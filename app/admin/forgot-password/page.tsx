"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-white">CYVANT</p>
          <p className="text-sm text-gray-400 mt-1">Admin Portal</p>
        </div>

        {status === "sent" ? (
          <div className="bg-gray-900 border border-white/5 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-white font-semibold">Check your email</p>
            <p className="text-gray-400 text-sm">
              If an account exists for <span className="text-white">{email}</span>, you'll receive a reset link shortly.
            </p>
            <Link href="/admin/login" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-2xl p-8 space-y-5">
            <div>
              <p className="text-white font-semibold text-lg mb-1">Forgot password?</p>
              <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@cyvant.org"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="cursor-pointer w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              {status === "loading" ? "Sending…" : "Send reset link"}
            </button>

            <Link
              href="/admin/login"
              className="block text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
