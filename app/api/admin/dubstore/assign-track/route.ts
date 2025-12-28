import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔐 Admin client (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  // 🔐 Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 🔐 Admin check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { trackId, sectionKey, enabled, position } = await req.json();

  if (!trackId || !sectionKey) {
    return NextResponse.json(
      { error: "Missing trackId or sectionKey" },
      { status: 400 }
    );
  }

  /* =============================
     REMOVE FROM SECTION
  ============================= */
  if (!enabled) {
    await supabaseAdmin
      .from("dubstore_section_tracks")
      .delete()
      .eq("track_id", trackId)
      .eq("section_key", sectionKey);

    return NextResponse.json({ success: true });
  }

  /* =============================
     UPSERT INTO SECTION
  ============================= */
  const { error } = await supabaseAdmin
    .from("dubstore_section_tracks")
    .upsert(
      {
        track_id: trackId,
        section_key: sectionKey,
        position: position ?? 0,
      },
      {
        onConflict: "track_id,section_key",
      }
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
