"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const artists = [
  { name: "David Knotts", slug: "david-knotts", image: "/artists/david-knotts.jpg" },
  { name: "Eli Hakema", slug: "eli-hakema", image: "/artists/eli-hakema.jpg" },
  { name: "Ezy Star", slug: "ezy-star", image: "/artists/ezy-star.jpg" },
  { name: "Jah Mirikle", slug: "jah-mirikle", image: "/artists/jah-mirikle.jpg" },
  { name: "Marky Roots", slug: "marky-roots", image: "/artists/marky-roots.jpg" },
  { name: "Me Ca Melody", slug: "me-ca-melody", image: "/artists/me-ca-melody.jpg" },
  { name: "Melody Ca", slug: "melody-ca", image: "/artists/melody-ca.jpg" },
  { name: "Ricky Ricardo", slug: "ricky-ricardo", image: "/artists/ricky-ricardo.jpg" },
  { name: "Shaii", slug: "shaii", image: "/artists/shaii.jpg" },
];

export default function ArtistCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % artists.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const active = artists[activeIndex];

  return (
    <div className="relative aspect-3/4 lg:aspect-auto bg-neutral-900 overflow-hidden">
      {artists.map((artist, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={artist.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover"
              priority={isActive}
            />
          </div>
        );
      })}

      {/* Bottom overlay with name + link */}
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-12">
        <Link
          href={`/artists/${active.slug}`}
          className="block group"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
            Featured Artist
          </p>
          <h3 className="text-lg font-semibold text-white group-hover:text-neutral-300 transition-colors">
            {active.name}
          </h3>
        </Link>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-3">
          {artists.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-neutral-600 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
