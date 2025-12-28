import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

type Payload = {
  trackId?: string;
  isHero?: boolean;
  top10Position?: number | null;
  isRelease?: boolean;
};

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

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

  const payload = (await req.json()) as Payload;
  const { trackId, isHero, top10Position, isRelease } = payload;

  if (!trackId) {
    return NextResponse.json(
      { error: "Missing trackId" },
      { status: 400 }
    );
  }

  if (isHero) {
    await supabaseAdmin
      .from("tracks")
      .update({ is_hero: false })
      .neq("id", trackId);
  }

  const updates: Record<string, unknown> = {};
  if (typeof isHero === "boolean") {
    updates.is_hero = isHero;
  }
  if (typeof isRelease === "boolean") {
    updates.is_release = isRelease;
  }
  if (top10Position !== undefined) {
    updates.top10_position = top10Position;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No updates provided" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("tracks")
    .update(updates)
    .eq("id", trackId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
