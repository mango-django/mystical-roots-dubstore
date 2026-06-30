"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { openTrackSheet } from "@/lib/openTrackSheet";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  baseTitle,
  groupByBaseTitle,
  type ReleaseGroup,
} from "@/lib/releaseGroups";

type Track = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  preview_path: string | null;
  cover_path: string | null;
  is_hero: boolean;
  is_release: boolean;
  is_exclusive: boolean;
};

function VipContent() {
  const [hero, setHero] = useState<Track | null>(null);
  const [dubs, setDubs] = useState<Track[]>([]);
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
        .eq("is_exclusive", true)
        .order("created_at", { ascending: true });
      if (!data) return;

      setHero(data.find((t) => t.is_hero) ?? data[0] ?? null);
      setDubs(data);
    }
    load();
  }, []);

  // Group exclusive mixes that share a base title under one cover.
  const groups = useMemo<ReleaseGroup[]>(() => groupByBaseTitle(dubs), [dubs]);

  function openGroup(g: ReleaseGroup) {
    openTrackSheet({
      title: g.title,
      artist: g.artist,
      cover_path: g.cover_path,
      format: g.mixes[0]?.format,
      price: g.mixes[0]?.price,
      mixes: g.mixes,
    });
  }

  function openHero() {
    if (!hero) return;
    const g = groups.find((g) => g.key === baseTitle(hero.title));
    if (g) openGroup(g);
    else openTrackSheet(hero);
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-2">
          Members Only
        </p>
        <h1>Exclusive Dub Section</h1>
        <p className="text-sm text-neutral-400 mt-2">
          Unreleased mixes and exclusive dubs for registered members
        </p>
      </div>

      {/* ===== FEATURED DUB HERO (full width) ===== */}
      <section
        onClick={openHero}
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
            width={1600}
            height={700}
            className="object-cover w-full h-125 lg:h-140"
          />
        )}

        {/* Hero overlay */}
        {hero && (
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-6 sm:p-8 flex items-end">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-amber-400/80">
                Exclusive Dub
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                {hero.title}
              </h2>
              <p className="text-neutral-300 text-sm">{hero.artist}</p>
            </div>
          </div>
        )}
      </section>

      {/* ===== EXCLUSIVE DUBS (grouped) ===== */}
      <section className="page-section">
        <h2 className="uppercase tracking-widest text-xs text-neutral-500 mb-5">
          Exclusive Dubs
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: Math.max(groups.length, 5) }).map((_, i) => {
            const group = groups[i];
            return (
              <div
                key={group ? group.key : i}
                onClick={() => group && openGroup(group)}
                className={`group bg-neutral-900 rounded-xl overflow-hidden ${
                  group ? "cursor-pointer" : ""
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  {group?.cover_path ? (
                    <img
                      src={getCoverUrl(group.cover_path)}
                      alt={group.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 border border-neutral-800/60 p-2">
                      <span className="text-xs uppercase tracking-widest text-neutral-600 text-center">
                        Dubs Coming Soon…
                      </span>
                    </div>
                  )}
                </div>
                {group && (
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{group.title}</p>
                    <p className="text-xs text-neutral-500 truncate">{group.artist}</p>
                    {group.mixes.length > 1 && (
                      <span className="inline-block mt-2 bg-neutral-800 text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {group.mixes.length} Mixes
                      </span>
                    )}
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

export default function VipShopPage() {
  return (
    <ProtectedRoute requireAuth>
      <VipContent />
    </ProtectedRoute>
  );
}
