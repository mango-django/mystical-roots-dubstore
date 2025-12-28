import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json(
      { error: "Missing file path" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing Supabase service role configuration" },
      { status: 500 }
    );
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: purchase, error: purchaseError } = await supabaseAdmin
    .from("purchased_tracks")
    .select("id")
    .eq("user_id", user.id)
    .eq("file_path", filePath)
    .limit(1)
    .maybeSingle();

  if (purchaseError) {
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }

  if (!purchase) {
    return NextResponse.json(
      { error: "Not authorized to download this track" },
      { status: 403 }
    );
  }

  // 🔐 Create signed URL for private track
  const { data, error } = await supabaseAdmin.storage
    .from("tracks")
    .createSignedUrl(filePath, 60);

  if (error || !data?.signedUrl) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate download" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
