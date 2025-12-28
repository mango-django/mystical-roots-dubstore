"use client";

import { openTrackSheet } from "@/lib/openTrackSheet";

export default function TrackCard({
  id,
  title,
  artist,
  format,
  price,
  thumbnail,
}: {
  id: string;
  title: string;
  artist: string;
  format: string;
  price: number;
  thumbnail?: string;
}) {
  return (
    <div
      onClick={() =>
        openTrackSheet({
          title,
          artist,
          format,
          price,
        })
      }
      className="
        flex items-center gap-4
        p-3
        bg-neutral-900/60
        hover:bg-neutral-800
        transition
        cursor-pointer
        rounded
      "
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
            No Art
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-sm text-neutral-400">
          {artist}
        </p>
      </div>

      {/* Meta */}
      <div className="text-right text-sm">
        <p className="text-neutral-400">
          {format}
        </p>
        <p className="font-semibold">
          £{(price / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
