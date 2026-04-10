import ArtistCard from "@/components/ArtistCard";

const artists = [
  { name: "David Knotts", slug: "david-knotts", hero_image: "/artists/david-knotts.jpg" },
  { name: "Elli Hakema", slug: "eli-hakema", hero_image: "/artists/eli-hakema.jpg" },
  { name: "Ezy Star", slug: "ezy-star", hero_image: "/artists/ezy-star.jpg" },
  { name: "Jah Mirikle", slug: "jah-mirikle", hero_image: "/artists/jah-mirikle.jpg" },
  { name: "Marky Roots", slug: "marky-roots", hero_image: "/artists/marky-roots.jpg" },
  { name: "Me Ca Melody", slug: "me-ca-melody", hero_image: "/artists/me-ca-melody.jpg" },
  { name: "Ricky Ricardo", slug: "ricky-ricardo", hero_image: "/artists/ricky-ricardo.jpg" },
  { name: "Shaii", slug: "shaii", hero_image: "/artists/shaii.jpg" },
];

export default async function ArtistsPage() {
  return (
    <main className="page-container">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          The Collective
        </p>
        <h1>Artists</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.slug}
            name={artist.name}
            slug={artist.slug}
            hero_image={artist.hero_image}
          />
        ))}
      </div>
    </main>
  );
}
