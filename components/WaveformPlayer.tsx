"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAudioPlayer } from "@/components/AudioPlayerContext";

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WaveformPlayer({
  url,
  previewLimit = 0,
  trackId,
  onPlayStateChange,
}: {
  url: string;
  previewLimit?: number;
  trackId: string;
  onPlayStateChange?: (playing: boolean) => void;
})

 {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const { play, stop } = useAudioPlayer();

  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#404040",
      progressColor: "#ffffff",
      cursorColor: "#ffffff",
      barWidth: 2,
      barGap: 1,
      height: 48,
      normalize: true,
    });

    waveSurferRef.current = ws;

    ws.load(url);
    ws.setVolume(volume);

    ws.on("ready", () => {
      setDuration(ws.getDuration());
    });

    ws.on("audioprocess", () => {
  const time = ws.getCurrentTime();
  setCurrentTime(time);

  if (previewLimit && time >= previewLimit) {
    ws.pause();
    ws.seekTo(0);
    setCurrentTime(0);
    onPlayStateChange?.(false);
  }
});


    ws.on("play", () => {
      const media = ws.getMediaElement();
      if (media) play(media, trackId);

      onPlayStateChange?.(true);
    });

    ws.on("pause", () => {
      onPlayStateChange?.(false);
    });

    ws.on("finish", () => {
      setCurrentTime(0);
      onPlayStateChange?.(false);
    });

    return () => {
      const current = waveSurferRef.current;
      if (!current) return;

      try {
        current.pause();
        current.destroy();
      } catch {
        // swallow AbortError (dev / strict mode)
      } finally {
        waveSurferRef.current = null;
      }
    };
  }, [url]);

  // Update volume live
  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.setVolume(volume);
    }
  }, [volume]);

  function toggle() {
    const ws = waveSurferRef.current;
    if (!ws) return;

    if (ws.isPlaying()) {
      stop();
      ws.pause();
    } else {
      ws.play();
    }
  }

  return (
    <div className="space-y-2">
      {/* Waveform */}
      <div
        ref={containerRef}
        className="w-full cursor-pointer"
        onClick={toggle}
      />

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="btn px-3">
            Play / Pause
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-white"
          />
        </div>

        {/* Time Display */}
        <div className="text-xs text-neutral-400 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
