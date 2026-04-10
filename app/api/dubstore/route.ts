import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const exclusive = req.nextUrl.searchParams.get("exclusive") === "true";

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
        cover_path,
        is_exclusive
      )
    `)
    .eq("section_key", "hero")
    .order("position", { ascending: true })
    .limit(10);

  const heroTrack = heroRows
    ?.map((r) => r.tracks)
    .filter(Boolean)
    .find((t: any) => t.is_exclusive === exclusive) ?? null;

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
        cover_path,
        is_exclusive
      )
    `)
    .eq("section_key", "top10")
    .order("position", { ascending: true });

  const top10 =
    top10Rows
      ?.map((r) => r.tracks)
      .filter((t: any) => t && t.is_exclusive === exclusive) ?? [];

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
        cover_path,
        is_exclusive
      )
    `)
    .eq("section_key", "releases")
    .order("created_at", { ascending: false });

  const releases =
    releaseRows
      ?.map((r) => r.tracks)
      .filter((t: any) => t && t.is_exclusive === exclusive) ?? [];

  /* =============================
     ALL TRACKS
  ============================= */
  const { data: all } = await supabase
    .from("tracks")
    .select(
      "id, title, artist, price, format, preview_path, cover_path, is_exclusive"
    )
    .eq("is_exclusive", exclusive)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    hero: heroTrack,
    top10,
    releases,
    all: all ?? [],
  });
}
