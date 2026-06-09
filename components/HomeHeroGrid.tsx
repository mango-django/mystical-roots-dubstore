"use client";

import { useEffect, useState } from "react";

type Slide = {
  src: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    src: "/hero/hero-home-main.webp",
    eyebrow: "South London Reggae & Roots",
    title: "Mystical Roots Warrior",
    subtitle: "Roots. Culture. Sound.",
  },
  {
    src: "/webp/mystical-roots-splash-01.webp",
    eyebrow: "Independent Music",
    title: "No Gatekeepers",
    subtitle: "New reggae & roots, released direct from the artists.",
  },
  {
    src: "/webp/sellassi-mural.webp",
    eyebrow: "Honour the Roots",
    title: "Rastafari Heritage",
    subtitle: "Sound system culture and conscious music from the ends.",
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
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Black overlay for caption legibility */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Caption */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 sm:p-10 space-y-2 max-w-2xl">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                {slide.eyebrow}
              </p>
              {i === 0 ? (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-lg">
                  {slide.title}
                </h1>
              ) : (
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-lg">
                  {slide.title}
                </h2>
              )}
              <p className="text-neutral-200 text-sm sm:text-base max-w-md drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          </div>
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
