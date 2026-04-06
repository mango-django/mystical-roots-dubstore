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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="space-y-5 w-full max-w-sm">
        <div className="text-center space-y-1 mb-2">
          <h2 className="text-2xl">Account</h2>
          <p className="text-xs text-neutral-500">
            Sign in or create an account
          </p>
        </div>

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn-primary w-full"
          disabled={loading}
          onClick={handleSignUp}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <button
          className="btn w-full"
          disabled={loading}
          onClick={handleSignIn}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <button
          className="w-full text-xs text-neutral-500 hover:text-white transition-colors py-2"
          onClick={handleSignOut}
        >
          Sign Out
        </button>

        {message && (
          <p className="text-sm text-center text-neutral-400">{message}</p>
        )}
      </div>
    </main>
  );
}
