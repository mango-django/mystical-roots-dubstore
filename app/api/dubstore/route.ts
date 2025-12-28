import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  /* =============================
     HERO (SINGLE)
  ============================= */
  const { data: heroRows } = await supabase
    .from("dubstore_section_tracks")
    .select(`
      position,
      tracks (
        id,
        title,
        artist,
        price,
        format,
        preview_path,
        cover_path
      )
    `)
    .eq("section_key", "hero")
    .order("position", { ascending: true })
    .limit(1);

  const hero = heroRows?.[0]?.tracks ?? null;

  /* =============================
     TOP 10
  ============================= */
  const { data: top10Rows } = await supabase
    .from("dubstore_section_tracks")
    .select(`
      position,
      tracks (
        id,
        title,
        artist,
        price,
        format,
        preview_path,
        cover_path
      )
    `)
    .eq("section_key", "top10")
    .order("position", { ascending: true });

  const top10 =
    top10Rows?.map((r) => r.tracks).filter(Boolean) ?? [];

  /* =============================
     RELEASES
  ============================= */
  const { data: releaseRows } = await supabase
    .from("dubstore_section_tracks")
    .select(`
      tracks (
        id,
        title,
        artist,
        price,
        format,
        preview_path,
        cover_path
      )
    `)
    .eq("section_key", "releases")
    .order("created_at", { ascending: false });

  const releases =
    releaseRows?.map((r) => r.tracks).filter(Boolean) ?? [];

  /* =============================
     ALL TRACKS
  ============================= */
  const { data: all } = await supabase
    .from("tracks")
    .select(
      "id, title, artist, price, format, preview_path, cover_path"
    )
    .order("created_at", { ascending: false });

  return NextResponse.json({
    hero,
    top10,
    releases,
    all: all ?? [],
  });
}
