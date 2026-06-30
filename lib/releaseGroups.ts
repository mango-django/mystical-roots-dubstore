// Shared grouping for the music store + dub store: collapse mixes that share a
// base title (e.g. "Just About Life (Radio Edit)") under one release group.

export type ReleaseTrack = {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  preview_path: string | null;
  cover_path: string | null;
};

export type ReleaseGroup = {
  key: string;
  title: string;
  artist: string;
  cover_path: string | null;
  mixes: ReleaseTrack[];
};

// "Just About Life (Radio Edit)" -> "Just About Life"
export function baseTitle(title: string) {
  return title.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export function groupByBaseTitle(tracks: ReleaseTrack[]): ReleaseGroup[] {
  const map = new Map<string, ReleaseGroup>();
  for (const t of tracks) {
    const key = baseTitle(t.title);
    if (!map.has(key)) {
      map.set(key, {
        key,
        title: key,
        artist: t.artist,
        cover_path: t.cover_path,
        mixes: [],
      });
    }
    map.get(key)!.mixes.push(t);
  }
  // Put the bare "Original" mix first within each group.
  for (const g of map.values()) {
    g.mixes.sort(
      (a, b) => (/\(/.test(a.title) ? 1 : 0) - (/\(/.test(b.title) ? 1 : 0)
    );
  }
  return [...map.values()];
}
