import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing Supabase service role configuration" },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey
  );

  // 🔐 Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 🔐 Admin check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }

  const { trackId } = await req.json();

  if (!trackId) {
    return NextResponse.json(
      { error: "Missing trackId" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch track paths
  const { data: track, error: fetchError } = await supabaseAdmin
    .from("tracks")
    .select("file_path, preview_path")
    .eq("id", trackId)
    .single();

  if (fetchError || !track) {
    return NextResponse.json(
      { error: "Track not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Delete files (best-effort)
  if (track.file_path) {
    await supabaseAdmin.storage
      .from("tracks")
      .remove([track.file_path]);
  }

  if (track.preview_path) {
    await supabaseAdmin.storage
      .from("previews")
      .remove([track.preview_path]);
  }

  // 3️⃣ Remove dependent rows (best-effort)
  await supabaseAdmin
    .from("order_items")
    .delete()
    .eq("track_id", trackId);

  await supabaseAdmin
    .from("purchased_tracks")
    .delete()
    .eq("track_id", trackId);

  // 4️⃣ Delete DB row
  const { error: deleteError } = await supabaseAdmin
    .from("tracks")
    .delete()
    .eq("id", trackId);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
