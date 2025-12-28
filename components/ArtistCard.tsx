import Link from "next/link";

type Artist = {
  name: string;
  slug: string;
  hero_image: string;
};

export default function ArtistCard({ name, slug, hero_image }: Artist) {
  return (
    <Link
      href={`/artists/${slug}`}
      className="group relative block aspect-square overflow-hidden bg-neutral-900"
    >
      <img
        src={hero_image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h2 className="uppercase tracking-widest text-sm sm:text-base">

          {name}
        </h2>
      </div>
    </Link>
  );
}
