"use client";

import ArtistCarousel from "./ArtistCarousel";

export default function HomeHeroGrid() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-1">
      {/* LEFT: HERO */}
      <div className="relative aspect-2/1 bg-neutral-900 overflow-hidden">
        <img
          src="/hero/hero-home-main.webp"
          alt="Mystical Roots Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent flex items-end">
          <div className="p-6 sm:p-10 space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-lg">
              Mystical Roots Warrior
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base max-w-md">
              Roots. Culture. Sound.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: ARTIST CAROUSEL */}
      <ArtistCarousel />
    </section>
  );
}
