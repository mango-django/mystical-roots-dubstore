"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Track = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
};

export default function EditTrackModal({
  track,
  onClose,
  onSaved,
}: {
  track: Track;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [price, setPrice] = useState(track.price);
  const [format, setFormat] = useState(track.format);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("tracks")
      .update({
        title,
        artist,
        price,
        format,
      })
      .eq("id", track.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 p-6 space-y-4">
        <h2 className="uppercase tracking-widest text-sm">
          Edit Track
        </h2>

        <input
          className="w-full p-2 bg-neutral-800 border border-neutral-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="w-full p-2 bg-neutral-800 border border-neutral-700"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
        />

        <input
          type="number"
          className="w-full p-2 bg-neutral-800 border border-neutral-700"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price (pence)"
        />

        <input
          className="w-full p-2 bg-neutral-800 border border-neutral-700"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          placeholder="Format (wav / mp3)"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
