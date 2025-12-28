"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { openTrackSheet } from "@/lib/openTrackSheet";

type Track = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  preview_path: string | null;
  cover_path: string | null;
  top10_position: number | null;
  is_hero: boolean;
  is_release: boolean;
};

export default function ShopPage() {
  const [hero, setHero] = useState<Track | null>(null);
  const [top10, setTop10] = useState<Track[]>([]);
  const [releases, setReleases] = useState<Track[]>([]);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  function getCoverUrl(coverPath: string) {
    if (/^https?:\/\//i.test(coverPath)) return coverPath;
    const normalized = coverPath.replace(/^\/+/, "");
    return `${supabaseUrl}/storage/v1/object/public/covers/${normalized}`;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tracks")
        .select("*");

      if (!data) return;

      setHero(data.find((t) => t.is_hero) ?? null);

      setTop10(
        data
          .filter((t) => t.top10_position !== null)
          .sort(
            (a, b) =>
              (a.top10_position ?? 0) -
              (b.top10_position ?? 0)
          )
          .slice(0, 10)
      );

      setReleases(
        data
          .filter((t) => t.is_release)
          .slice(0, 10)
      );
    }

    load();
  }, []);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-10">
      {/* ===== TOP SECTION ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* HERO */}
        <div
          onClick={() => hero && openTrackSheet(hero)}
          className="relative cursor-pointer bg-neutral-800 overflow-hidden"
        >
          {hero?.cover_path ? (
            <img
              src={getCoverUrl(hero.cover_path)}
              alt={hero.title}
              className="w-full h-[600px] object-cover"
            />
          ) : (
            <Image
              src="/placeholder/hero.jpg"
              alt="Hero placeholder"
              width={1200}
              height={600}
              className="object-cover"
            />
          )}

          {/* HERO OVERLAY */}
          {hero && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex items-end">
              <div>
                <h2 className="text-2xl font-semibold">
                  {hero.title}
                </h2>
                <p className="text-neutral-300">
                  {hero.artist}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TOP 10 */}
        <aside className="bg-neutral-900 p-4">
          <h2 className="uppercase tracking-widest text-sm mb-4">
            Top Mixes
          </h2>

          <ol className="space-y-3 text-sm">
            {Array.from({ length: 10 }).map((_, i) => {
              const track = top10[i];

              return (
                <li
                  key={i}
                  onClick={() => track && openTrackSheet(track)}
                  className={`flex gap-3 ${
                    track
                      ? "cursor-pointer hover:text-white"
                      : "opacity-40"
                  } text-neutral-400`}
                >
                  <span className="w-4 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="truncate font-medium">
                      {track ? track.title : "Coming Soon"}
                    </div>
                    <div className="truncate text-xs">
                      {track ? track.artist : "Mystical Roots"}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>
      </section>

      {/* ===== NEW RELEASES ===== */}
      <section>
        <h2 className="uppercase tracking-widest text-sm mb-4">
          New Releases
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => {
            const track = releases[i];

            return (
              <div
                key={i}
                onClick={() => track && openTrackSheet(track)}
                className={`cursor-pointer bg-neutral-800 aspect-square ${
                  !track ? "opacity-40" : ""
                }`}
              >
                {track?.cover_path ? (
                  <img
                    src={getCoverUrl(track.cover_path)}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/placeholder/thumb.jpg"
                    alt="Placeholder"
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
