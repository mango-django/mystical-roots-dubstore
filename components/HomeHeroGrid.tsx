"use client";

import Image from "next/image";
import ArtistCarousel from "./ArtistCarousel";

export default function HomeHeroGrid() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
      
      {/* LEFT: HERO */}
      <div className="relative aspect-[2/1] bg-neutral-800 overflow-hidden rounded">
        <Image
          src="/placeholder/hero.jpg"
          alt="Mystical Roots Hero"
          fill
          className="object-cover"
          priority
        />

        {/* Optional overlay text */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-3xl tracking-widest uppercase">
            Mystical Roots Warrior
          </h1>
        </div>
      </div>

      {/* RIGHT: ARTIST CAROUSEL */}
      <ArtistCarousel />

    </section>
  );
}
