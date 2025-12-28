"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HomeHeroGrid from "@/components/HomeHeroGrid";

const heroSlides = [
  {
    image: "/hero/hero1.webp",
    headline: "Exclusive Dubs",
    sub: "Fresh cuts direct from the sound system",
    link: "/shop",
    cta: "Explore Dub Store",
  },
  {
    image: "/hero/hero2.webp",
    headline: "Artists & Producers",
    sub: "Meet the voices behind the music",
    link: "/artists",
    cta: "View Artists",
  },
  {
    image: "/hero/hero3.webp",
    headline: "Roots. Culture. Sound.",
    sub: "South London reggae & dub culture",
    link: "/artists",
    cta: "Discover the Collective",
  },
];

export default function HomePage() {
  return (
    <main className="p-6 space-y-16">

      {/* HERO GRID */}
      <HomeHeroGrid />

      {/* ================= INTRO / WELCOME ================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT TEXT */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl uppercase tracking-widest">
            Welcome to Mystical Roots Warrior
          </h2>

          <p className="text-neutral-300 leading-relaxed">
            Mystical Roots Warrior is a South London based reggae and roots
            collective focused on sound system culture, dubplates, and
            independent music released directly from the artists.
          </p>

          <p className="text-neutral-400 leading-relaxed">
            This platform exists to share new music, support the producers and
            vocalists behind it, and keep the culture moving forward without
            gatekeepers.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href="/shop" className="btn">
              Visit Dub Store
            </Link>
            <Link href="/artists" className="btn btn-outline">
              Meet the Artists
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-square bg-neutral-900 overflow-hidden">
            <img
              src="/home/intro-main.webp"
              alt="Sound system culture"
              className="w-full h-full object-cover"
            />
          </div>

          
        </div>
      </section>
    </main>
  );
}
