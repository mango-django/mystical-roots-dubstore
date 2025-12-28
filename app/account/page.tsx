"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";

type PurchasedTrack = {
  id: string;
  title: string;
  file_path: string;
};

export default function AccountPage() {
  const [tracks, setTracks] = useState<PurchasedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();
  const { clearCartOnLogout } = useCart();
  const hasHandledSuccess = useRef(false);

  /* =============================
     HANDLE SUCCESS REDIRECT
  ============================= */
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

  /* =============================
     LOAD PURCHASED TRACKS
  ============================= */
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

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="uppercase tracking-widest text-xl border-b border-neutral-700 pb-2">
        Your Purchases
      </h1>

      {showSuccess && (
        <div className="border border-green-600 bg-green-600/10 p-4 text-sm">
          ✅ Payment successful. Your purchase is complete.
        </div>
      )}

      {tracks.length === 0 && (
        <p className="text-sm text-neutral-400">
          No purchases yet.
        </p>
      )}

      {tracks.map((track) => (
        <div key={track.id} className="surface p-4 space-y-2">
          <h3>{track.title}</h3>

          <button
  className="btn"
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
    </main>
  );
}
