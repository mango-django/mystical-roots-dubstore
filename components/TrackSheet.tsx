"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type SheetInput = Track & { mixes?: Track[] };

// "Just About Life (Radio Edit)" -> "Radio Edit"; bare title -> "Original".
function mixLabel(title: string) {
  const m = title.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : "Original";
}

export default function TrackSheet({
  track,
  onClose,
}: {
  track: SheetInput | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);

  const PREVIEW_LIMIT = 30; // seconds

  // Available mixes for this sheet (a single track collapses to one mix).
  const mixes = useMemo<Track[]>(
    () => (track?.mixes?.length ? track.mixes : track ? [track] : []),
    [track]
  );
  const groupKey = mixes.map((m) => m.id).join(",");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset to the first mix whenever a new release/group is opened.
  useEffect(() => {
    setSelectedId(mixes[0]?.id ?? null);
  }, [groupKey]);

  const current = mixes.find((m) => m.id === selectedId) ?? mixes[0] ?? null;

  const previewUrl = current?.preview_path
    ? `${supabaseUrl}/storage/v1/object/public/previews/${current.preview_path}`
    : null;

  function getCoverUrl(coverPath: string) {
    if (/^https?:\/\//i.test(coverPath)) return coverPath;
    const normalized = coverPath.replace(/^\/+/, "");
    return `${supabaseUrl}/storage/v1/object/public/covers/${normalized}`;
  }

  useEffect(() => {
    if (!previewUrl || !waveformRef.current) return;

    waveformRef.current.innerHTML = "";
    if (waveSurfer.current) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#444",
      progressColor: "#fff",
      cursorColor: "#fff",
      barWidth: 2,
      barRadius: 3,
      barGap: 1,
      height: 48,
      normalize: true,
    });

    waveSurfer.current = ws;
    ws.setVolume(volume);

    ws.on("ready", () => {
      setReady(true);
      setDuration(ws.getDuration());
    });
    ws.on("finish", () => setPlaying(false));
    ws.on("timeupdate", (time: number) => {
      setCurrentTime(time);
      if (time >= PREVIEW_LIMIT) {
        ws.pause();
        ws.seekTo(0);
        setPlaying(false);
        setCurrentTime(0);
      }
    });

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
      setCurrentTime(0);
    };
  }, [previewUrl]);

  function togglePlay() {
    if (!waveSurfer.current || !ready) return;
    waveSurfer.current.playPause();
    setPlaying(waveSurfer.current.isPlaying());
  }

  function handleVolume(v: number) {
    setVolume(v);
    waveSurfer.current?.setVolume(v);
  }

  function handleClose() {
    waveSurfer.current?.stop();
    setPlaying(false);
    onClose();
  }

  function handleAddToCart() {
    if (!current) return;
    addItem({
      id: current.id,
      title: current.title,
      price: current.price / 100,
      image: current.cover_path ? getCoverUrl(current.cover_path) : undefined,
      type: "track",
    });
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (!track || !current) return null;

  const cover = track.cover_path ?? current.cover_path ?? null;
  const hasVersions = mixes.length > 1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800/60 rounded-t-2xl animate-slideUp">
        <div className="max-w-5xl mx-auto p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              {/* Cover thumbnail */}
              <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-800">
                {cover ? (
                  <img
                    src={getCoverUrl(cover)}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
                    No cover
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold">
                  {track.title}
                </h2>
                <p className="text-sm text-neutral-500">{track.artist}</p>
                {hasVersions && (
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {mixes.length} versions
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="text-neutral-500 hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Version selector */}
          {hasVersions && (
            <div className="flex flex-wrap gap-2">
              {mixes.map((m) => {
                const active = m.id === current.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? "bg-white text-black border-white"
                        : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {mixLabel(m.title)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Waveform */}
          <div ref={waveformRef} className="rounded-lg overflow-hidden" />

          {/* Time + preview limit */}
          {ready && (
            <div className="flex justify-between text-xs text-neutral-500">
              <span>{formatTime(currentTime)} / {formatTime(Math.min(PREVIEW_LIMIT, duration))}</span>
              <span>{PREVIEW_LIMIT}s preview</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={togglePlay}
              className="btn-primary"
              disabled={!ready}
            >
              {playing ? "Pause" : "Play"}
            </button>

            <button onClick={handleAddToCart} className="btn">
              Add to Cart
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Vol</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                className="w-20 accent-white"
              />
            </div>

            <div className="ml-auto text-sm text-neutral-400">
              {hasVersions && (
                <span className="text-neutral-500">{mixLabel(current.title)} &middot; </span>
              )}
              &pound;{(current.price / 100).toFixed(2)} &middot;{" "}
              {current.format.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
