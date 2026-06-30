"use client";

import { useEffect, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  // Optional caption — slides that are self-contained promo art omit it.
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

const SLIDES: Slide[] = [
  {
    src: "/hero/hero4.webp",
    alt: "Ezy Star — His Majesty, out now on all digital platforms",
  },
  {
    src: "/hero/hero-home-main.webp",
    alt: "Mystical Roots Warrior",
    eyebrow: "South London Reggae & Roots",
    title: "Mystical Roots Warrior",
    subtitle: "Roots. Culture. Sound.",
  },
  {
    src: "/hero/dubstore-hero.webp",
    alt: "Dub Store — register now for VIP access to dubs",
  },
  {
    src: "/webp/sellassi-mural.webp",
    alt: "Rastafari Heritage",
    eyebrow: "Honour the Roots",
    title: "Rastafari Heritage",
    subtitle: "Sound system culture and conscious music from the ends.",
  },
  {
    src: "/webp/his_majesty_by_ezy_star_promo.webp",
    alt: "Out Now in the Dub Store",
    eyebrow: "Featured Release",
    title: "Out Now in the Dub Store",
    subtitle: "Ezy Star — His Majesty. Stream the preview, own the track.",
  },
];

const INTERVAL = 6000;

export default function HomeHeroGrid() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full aspect-video sm:aspect-2/1 lg:aspect-12/5 bg-neutral-900 overflow-hidden">
      {/* Single page h1 for SEO/accessibility, regardless of active slide */}
      <h1 className="sr-only">Mystical Roots Warrior</h1>

      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i === active ? undefined : true}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Caption (omitted for self-contained promo art) */}
          {slide.title && (
            <div className="absolute inset-0 flex items-end">
              <div className="p-6 sm:p-10 space-y-2 max-w-2xl">
                {slide.eyebrow && (
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                    {slide.eyebrow}
                  </p>
                )}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-lg">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-neutral-200 text-sm sm:text-base max-w-md drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 right-6 z-10 flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
