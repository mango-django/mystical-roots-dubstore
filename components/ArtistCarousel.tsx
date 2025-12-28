import { useEffect, useState } from "react";
import Image from "next/image";

const artists = [
  { name: "David Knotts", image: "/artists/david-knotts.jpg" },
  { name: "Eli Hakema", image: "/artists/eli-hakema.jpg" },
  { name: "Ezy Star", image: "/artists/ezy-star.jpg" },
  { name: "General", image: "/artists/general.jpg" },
  { name: "Jah Mirikle", image: "/artists/jah-mirikle.jpg" },
  { name: "Marky Roots", image: "/artists/marky-roots.jpg" },
  { name: "Me Ca Melody", image: "/artists/me-ca-melody.jpg" },
  { name: "Melody Ca", image: "/artists/melody-ca.jpg" },
  { name: "Ricky Ricardo", image: "/artists/ricky-ricardo.jpg" },
  { name: "Shaii", image: "/artists/shaii.jpg" },
];

export default function ArtistCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % artists.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        relative aspect-[3/4]
        bg-neutral-900
        rounded
        overflow-hidden
      "
    >
      {artists.map((artist, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={artist.image}
            className={`
              absolute inset-0
              transition-opacity duration-700 ease-in-out
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          >
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover"
              priority={isActive}
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/70 p-2 text-sm">
              {artist.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
