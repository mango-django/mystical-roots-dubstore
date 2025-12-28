"use client";

import { useState } from "react";
import { signIn, signUp, signOut } from "@/lib/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    setMessage(null);

    const { error } = await signUp(email, password);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Sign up successful. Check your email if confirmation is enabled.");
    }

    setLoading(false);
  }

  async function handleSignIn() {
    setLoading(true);
    setMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in successfully.");
    }

    setLoading(false);
  }

  async function handleSignOut() {
    await signOut();
    setMessage("Signed out.");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-80">
        <input
          className="w-full p-2 bg-neutral-900 border border-neutral-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 bg-neutral-900 border border-neutral-700"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-white text-black py-2 disabled:opacity-50"
          disabled={loading}
          onClick={handleSignUp}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <button
          className="w-full border border-white py-2 disabled:opacity-50"
          disabled={loading}
          onClick={handleSignIn}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <button
          className="w-full text-sm opacity-60"
          onClick={handleSignOut}
        >
          Sign Out
        </button>

        {message && (
          <p className="text-sm text-center opacity-70">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
