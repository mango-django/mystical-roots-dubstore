"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useCart } from "@/components/CartContext";

type Track = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  preview_path?: string | null;
  cover_path?: string | null;
};

export default function TrackSheet({
  track,
  onClose,
}: {
  track: Track | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [ready, setReady] = useState(false);

  /* =============================
     BUILD PREVIEW URL
  ============================= */
  const previewUrl =
    track?.preview_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${track.preview_path}`
      : null;

  function getCoverUrl(coverPath: string) {
    if (/^https?:\/\//i.test(coverPath)) return coverPath;
    const normalized = coverPath.replace(/^\/+/, "");
    return `${supabaseUrl}/storage/v1/object/public/covers/${normalized}`;
  }

  /* =============================
     INIT WAVESURFER
  ============================= */
  useEffect(() => {
  if (!previewUrl || !waveformRef.current) return;

  // ✅ CLEAR OLD WAVEFORM DOM
  waveformRef.current.innerHTML = "";

  if (waveSurfer.current) return;

  const ws = WaveSurfer.create({
    container: waveformRef.current,
    waveColor: "#555",
    progressColor: "#fff",
    cursorColor: "#fff",
    barWidth: 2,
    barRadius: 2,
    height: 48,
    normalize: true,
  });

  waveSurfer.current = ws;
  ws.setVolume(volume);

  ws.on("ready", () => setReady(true));
  ws.on("finish", () => setPlaying(false));

  try {
    ws.load(previewUrl);
  } catch {}

  return () => {
    try {
      ws.stop();
    } catch {}

    waveSurfer.current = null;
    setReady(false);
    setPlaying(false);
  };
}, [previewUrl]);




  /* =============================
     PLAY / PAUSE
  ============================= */
  function togglePlay() {
    if (!waveSurfer.current || !ready) return;
    waveSurfer.current.playPause();
    setPlaying(waveSurfer.current.isPlaying());
  }

  /* =============================
     VOLUME
  ============================= */
  function handleVolume(v: number) {
    setVolume(v);
    waveSurfer.current?.setVolume(v);
  }

  /* =============================
     CLOSE
  ============================= */
  function handleClose() {
    waveSurfer.current?.stop();
    setPlaying(false);
    onClose();
  }

  /* =============================
     ADD TO CART
  ============================= */
  function handleAddToCart() {
    if (!track) return;

    addItem({
      id: track.id,
      title: track.title,
      price: track.price / 100,
      image: track.cover_path
        ? getCoverUrl(track.cover_path)
        : undefined,
      type: "track",
    });
  }

  if (!track) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800 rounded-t-xl">
        <div className="max-w-5xl mx-auto p-6 space-y-4">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              
              {/* COVER THUMBNAIL (ALWAYS SMALL) */}
              <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-neutral-800">
                {track.cover_path ? (
                  <img
                    src={getCoverUrl(track.cover_path)}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                    No cover
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h2 className="text-lg font-semibold">
                  {track.title}
                </h2>
                <p className="text-sm text-neutral-400">
                  {track.artist}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Waveform */}
          <div ref={waveformRef} />

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className="btn"
              disabled={!ready}
            >
              {playing ? "Pause" : "Play"}
            </button>

            <button
              onClick={handleAddToCart}
              className="btn btn-outline"
            >
              Add to Cart
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">
                Vol
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) =>
                  handleVolume(Number(e.target.value))
                }
              />
            </div>

            <div className="ml-auto text-sm">
              £{(track.price / 100).toFixed(2)} · {track.format.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
