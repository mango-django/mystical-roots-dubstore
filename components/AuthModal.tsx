"use client";

import { useEffect, useState } from "react";
import AuthPage from "@/app/auth/page";
import { supabase } from "@/lib/supabase/client";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const { data: listener } =
      supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          const redirect = sessionStorage.getItem("authRedirect");
          sessionStorage.removeItem("authRedirect");

          setToast("Welcome back");

          setTimeout(() => {
            onClose();
            if (redirect) {
              window.location.href = redirect;
            }
          }, 300);
        }
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 w-full max-w-sm z-10">
          <button
            className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors p-1"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <AuthPage />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700/50 px-5 py-2.5 z-50 text-sm rounded-xl">
          {toast}
        </div>
      )}
    </>
  );
}
