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

          // Small delay for animation + toast
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

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!open) return null;

  return (
    <>
      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="
            absolute inset-0 bg-black/70
            transition-opacity duration-200
          "
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className="
            relative bg-neutral-900 p-6 w-full max-w-sm z-10
            transition-all duration-200
            scale-100 opacity-100
          "
        >
          <button
            className="absolute top-2 right-2 text-neutral-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>

          <AuthPage />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2
            bg-neutral-900 border border-neutral-700
            px-4 py-2 z-50
            text-sm
          "
        >
          {toast}
        </div>
      )}
    </>
  );
}
