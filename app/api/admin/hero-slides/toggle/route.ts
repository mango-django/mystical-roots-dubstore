import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { trackId, enabled } = await req.json();

  if (!trackId) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }

  if (enabled) {
    // Find next position
    const { data: last } = await supabaseAdmin
      .from("dubstore_hero_slides")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = (last?.position ?? 0) + 1;

    await supabaseAdmin.from("dubstore_hero_slides").insert({
      track_id: trackId,
      position: nextPosition,
    });
  } else {
    await supabaseAdmin
      .from("dubstore_hero_slides")
      .delete()
      .eq("track_id", trackId);
  }

  return NextResponse.json({ success: true });
}
