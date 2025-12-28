"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditTrackModal from "@/components/admin/EditTrackModal";


type Track = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  created_at: string;
  is_hero: boolean;
  top10_position: number | null;
  is_release: boolean;
  cover_path?: string | null;
};

export default function AdminTracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Track | null>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  async function loadTracks() {
    setLoading(true);

    const { data } = await supabase
      .from("tracks")
      .select(`
        id,
        title,
        artist,
        price,
        format,
        created_at,
        is_hero,
        top10_position,
        is_release
      `)
      .order("created_at", { ascending: false });

    setTracks(data || []);
    setLoading(false);
  }

  async function updateTrackFlags(payload: {
    trackId: string;
    isHero?: boolean;
    top10Position?: number | null;
    isRelease?: boolean;
  }) {
    const res = await fetch("/api/admin/update-track-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Update failed");
      return false;
    }

    return true;
  }

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="uppercase tracking-widest text-xl">
          Tracks
        </h1>

        {loading && (
          <p className="text-sm text-neutral-400">
            Loading tracks…
          </p>
        )}

        {!loading && tracks.length === 0 && (
          <p className="text-sm text-neutral-400">
            No tracks uploaded yet.
          </p>
        )}

        {!loading && tracks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-neutral-800 text-sm">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Artist</th>
                  <th className="p-3">Format</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-left">Dub Store</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tracks.map((track) => (
                  <tr
                    key={track.id}
                    className="border-t border-neutral-800 hover:bg-neutral-900/50"
                  >
                    <td className="p-3">{track.title}</td>
                    <td className="p-3 text-neutral-400">
                      {track.artist}
                    </td>
                    <td className="p-3 uppercase text-center">
                      {track.format}
                    </td>
                    <td className="p-3 text-right">
                      £{(track.price / 100).toFixed(2)}
                    </td>

                    {/* ===== DUB STORE CONTROLS ===== */}
                    <td className="p-3 space-y-2 text-xs">
                        

                      {/* HERO */}
                      <label className="flex gap-2 items-center">
  <input
    type="checkbox"
    checked={track.is_hero}
    onChange={async (e) => {
      if (e.target.checked && !track.cover_path) {
        alert("Hero tracks must have a cover image");
        return;
      }

      await fetch("/api/admin/hero-slides/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: track.id,
          enabled: e.target.checked,
        }),
      });

      loadTracks();
    }}
  />
  Hero Carousel
</label>


                      

                      {/* TOP 10 */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={track.top10_position !== null}
                          onChange={async (e) => {
                            const ok = await updateTrackFlags({
                              trackId: track.id,
                              top10Position: e.target.checked ? 1 : null,
                            });

                            if (ok) loadTracks();
                          }}
                        />
                        <span>Top 10</span>

                        {track.top10_position !== null && (
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={track.top10_position}
                            onChange={async (e) => {
                              const ok = await updateTrackFlags({
                                trackId: track.id,
                                top10Position: Number(e.target.value),
                              });

                              if (ok) loadTracks();
                            }}
                            className="w-14 bg-neutral-800 border border-neutral-700 px-1"
                          />
                        )}
                      </div>

                      {/* RELEASE */}
                      <label className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={track.is_release}
                          onChange={async (e) => {
                            const ok = await updateTrackFlags({
                              trackId: track.id,
                              isRelease: e.target.checked,
                            });

                            if (ok) loadTracks();
                          }}
                        />
                        Release
                      </label>
                    </td>

                    {/* ACTIONS (UNCHANGED) */}
                    <td className="p-3 text-center space-x-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditing(track)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          const confirmed = confirm(
                            `Delete "${track.title}"? This cannot be undone.`
                          );

                          if (!confirmed) return;

                          const res = await fetch(
                            "/api/admin/delete-track",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                trackId: track.id,
                              }),
                            }
                          );

                          if (!res.ok) {
                            alert("Delete failed");
                            return;
                          }

                          loadTracks();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT MODAL (UNCHANGED) */}
        {editing && (
          <EditTrackModal
            track={editing}
            onClose={() => setEditing(null)}
            onSaved={loadTracks}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
