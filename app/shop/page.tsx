"use client";

import Image from "next/image";
import Link from "next/link";
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
        .select("*")
        .eq("is_exclusive", false);
      if (!data) return;

      setHero(data.find((t) => t.is_hero) ?? null);

      setTop10(
        data
          .filter((t) => t.top10_position !== null)
          .sort((a, b) => (a.top10_position ?? 0) - (b.top10_position ?? 0))
          .slice(0, 10)
      );

      setReleases(data.filter((t) => t.is_release).slice(0, 10));
    }
    load();
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          Browse & Preview
        </p>
        <h1>Dub Store</h1>
      </div>

      {/* ===== VIP DUB SECTION BANNER ===== */}
      <Link
        href="/shop/vip"
        className="block relative overflow-hidden rounded-xl border border-neutral-700/50 bg-gradient-to-r from-neutral-900 via-neutral-800/80 to-neutral-900 p-6 sm:p-8 mb-8 group hover:border-neutral-600 transition-all duration-300"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-1">
              Members Only
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Exclusive Dub Section
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Sign up free to access exclusive dubs and unreleased mixes
            </p>
          </div>
          <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-2xl">
            &rarr;
          </span>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
      </Link>

      {/* ===== TOP SECTION: Hero + Top 10 ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* HERO TRACK */}
        <div
          onClick={() => hero && openTrackSheet(hero)}
          className="relative cursor-pointer bg-neutral-900 overflow-hidden rounded-xl"
        >
          {hero?.cover_path ? (
            <img
              src={getCoverUrl(hero.cover_path)}
              alt={hero.title}
              className="w-full h-125 lg:h-140 object-cover"
            />
          ) : (
            <Image
              src="/placeholder/hero.jpg"
              alt="Hero placeholder"
              width={1200}
              height={600}
              className="object-cover w-full h-125 lg:h-140"
            />
          )}

          {/* Hero overlay */}
          {hero && (
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-6 sm:p-8 flex items-end">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Featured Track
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  {hero.title}
                </h2>
                <p className="text-neutral-300 text-sm">
                  {hero.artist}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TOP 10 SIDEBAR */}
        <aside className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5">
          <h2 className="uppercase tracking-widest text-xs text-neutral-500 mb-5">
            Top Mixes
          </h2>

          <ol className="space-y-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const track = top10[i];
              return (
                <li
                  key={i}
                  onClick={() => track && openTrackSheet(track)}
                  className={`flex gap-3 items-center px-3 py-2.5 rounded-lg transition-colors ${
                    track
                      ? "cursor-pointer hover:bg-neutral-800/60 text-neutral-300 hover:text-white"
                      : "text-neutral-600"
                  }`}
                >
                  <span className="w-5 text-right text-xs font-medium tabular-nums">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium">
                      {track ? track.title : "Coming Soon"}
                    </div>
                    <div className="truncate text-xs text-neutral-500">
                      {track ? track.artist : "Mystical Roots"}
                    </div>
                  </div>
                  {track && (
                    <span className="text-xs text-neutral-500">
                      {track.format.toUpperCase()}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </aside>
      </section>

      {/* ===== NEW RELEASES ===== */}
      <section className="page-section">
        <h2 className="uppercase tracking-widest text-xs text-neutral-500 mb-5">
          New Releases
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => {
            const track = releases[i];
            return (
              <div
                key={i}
                onClick={() => track && openTrackSheet(track)}
                className={`group cursor-pointer bg-neutral-900 rounded-xl overflow-hidden ${
                  !track ? "opacity-30" : ""
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  {track?.cover_path ? (
                    <img
                      src={getCoverUrl(track.cover_path)}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src="/placeholder/thumbnail.jpg"
                      alt="Placeholder"
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                {track && (
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-neutral-500 truncate">{track.artist}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
