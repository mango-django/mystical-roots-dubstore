"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReset() {
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully.");
      setDone(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="space-y-5 w-full max-w-sm">
        <div className="text-center space-y-1 mb-2">
          <h2 className="text-2xl">Reset Password</h2>
          <p className="text-xs text-neutral-500">
            Enter your new password below
          </p>
        </div>

        {!done ? (
          <>
            <input
              className="input"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              className="btn-primary w-full"
              disabled={loading}
              onClick={handleReset}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        ) : (
          <a href="/" className="btn-primary block text-center w-full">
            Go to Homepage
          </a>
        )}

        {error && (
          <p className="text-sm text-center text-red-400">{error}</p>
        )}
        {message && (
          <p className="text-sm text-center text-green-400">{message}</p>
        )}
      </div>
    </main>
  );
}
