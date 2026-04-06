"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";

type PurchasedTrack = {
  id: string;
  title: string;
  file_path: string;
};

function AccountContent() {
  const [tracks, setTracks] = useState<PurchasedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();
  const { clearCartOnLogout } = useCart();
  const hasHandledSuccess = useRef(false);

  useEffect(() => {
    if (
      searchParams.get("success") === "1" &&
      !hasHandledSuccess.current
    ) {
      hasHandledSuccess.current = true;
      clearCartOnLogout();
      setShowSuccess(true);
      window.history.replaceState({}, "", "/account");
    }
  }, [searchParams, clearCartOnLogout]);

  useEffect(() => {
    async function loadPurchases() {
      const { data, error } = await supabase
        .from("purchased_tracks")
        .select("id, title, file_path")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTracks(data);
      }
      setLoading(false);
    }
    loadPurchases();
  }, []);

  if (loading) {
    return (
      <div className="page-container page-header">
        <p className="text-neutral-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          Your Library
        </p>
        <h1>Purchases</h1>
      </div>

      <div className="max-w-2xl space-y-5 pb-16">
        {showSuccess && (
          <div className="border border-green-600/40 bg-green-600/10 p-4 rounded-xl text-sm text-green-400">
            Payment successful. Your purchase is complete.
          </div>
        )}

        {tracks.length === 0 && (
          <p className="text-sm text-neutral-500">No purchases yet.</p>
        )}

        {tracks.map((track) => (
          <div
            key={track.id}
            className="surface p-5 flex items-center justify-between gap-4"
          >
            <h3 className="text-sm font-medium">{track.title}</h3>

            <button
              className="btn shrink-0"
              onClick={async () => {
                const res = await fetch("/api/download", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ filePath: track.file_path }),
                });

                const data = await res.json();

                if (!res.ok || !data.url) {
                  alert("Download failed");
                  return;
                }

                window.location.href = data.url;
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container page-header">
          <p className="text-neutral-500 text-sm">Loading...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
