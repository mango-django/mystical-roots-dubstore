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
      className="group relative block aspect-square overflow-hidden rounded-xl bg-neutral-900"
    >
      <img
        src={hero_image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent flex items-end p-5">
        <div>
          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wider text-white">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
}
