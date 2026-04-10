"use client";

import Link from "next/link";
import HomeHeroGrid from "@/components/HomeHeroGrid";

export default function HomePage() {
  return (
    <main>
      {/* HERO GRID — full bleed, no container constraint */}
      <section className="pt-16">
        <HomeHeroGrid />
      </section>

      {/* INTRO / WELCOME */}
      <section className="page-container page-section">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="space-y-6 animate-fadeIn">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              South London Reggae & Roots Collective
            </p>

            <h2 className="text-3xl sm:text-4xl">
              Welcome to Mystical Roots Warrior
            </h2>

            <p className="text-neutral-300 leading-relaxed max-w-lg">
              Mystical Roots Warrior is a South London based reggae and roots
              collective focused on sound system culture, dubplates, and
              independent music released directly from the artists.
            </p>

            <p className="text-neutral-400 leading-relaxed max-w-lg">
              This platform exists to share new music, support the producers and
              vocalists behind it, and keep the culture moving forward without
              gatekeepers.
            </p>

            <div className="flex gap-3 flex-wrap pt-2">
              <Link href="/shop" className="btn-primary">
                Visit Music Store
              </Link>
              <Link href="/artists" className="btn">
                Meet the Artists
              </Link>
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="aspect-square bg-neutral-900">
              <img
                src="/home/intro-main.webp"
                alt="Sound system culture"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-transparent opacity-40" />
          </div>
        </div>
      </section>
    </main>
  );
}
