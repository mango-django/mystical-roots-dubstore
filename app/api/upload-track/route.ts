import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  console.log("▶ Admin upload initiated");

  /* =============================
     AUTH CHECK (ANON CLIENT)
  ============================= */
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

  /* =============================
     ADMIN CHECK (ANON CLIENT)
  ============================= */
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

  /* =============================
     FORM DATA
  ============================= */
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const price = Number(formData.get("price"));
  const format = (formData.get("format") as string)?.toLowerCase();
  const downloadLimit = Number(formData.get("download_limit") || 3);

  const fullFile = formData.get("file") as File;
  const previewFile = formData.get("preview") as File;
  const coverFile = formData.get("cover") as File;

  if (
    !title ||
    !artist ||
    !price ||
    !format ||
    !fullFile ||
    !previewFile ||
    !coverFile
  ) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  console.log("📄 Metadata:", {
    title,
    artist,
    price,
    format,
    downloadLimit,
  });

  /* =============================
     PATHS
  ============================= */
  const timestamp = Date.now();
  const safeName = fullFile.name.replace(/\s+/g, "_");

  const fullPath = `tracks/${timestamp}-${safeName}`;
  const previewPath = `previews/${timestamp}-${safeName}`;
  const coverPath = `covers/${timestamp}-${coverFile.name.replace(/\s+/g, "_")}`;

  /* =============================
     UPLOAD FILES (SERVICE ROLE)
  ============================= */
  const admin = supabaseAdmin;

  const { error: fullUploadError } = await admin.storage
    .from("tracks")
    .upload(fullPath, fullFile, {
      contentType: fullFile.type,
      upsert: false,
    });

  if (fullUploadError) {
    return NextResponse.json(
      { error: fullUploadError.message },
      { status: 500 }
    );
  }

  const { error: previewUploadError } = await admin.storage
    .from("previews")
    .upload(previewPath, previewFile, {
      contentType: previewFile.type,
      upsert: false,
    });

  if (previewUploadError) {
    return NextResponse.json(
      { error: previewUploadError.message },
      { status: 500 }
    );
  }

  const { error: coverUploadError } = await admin.storage
    .from("covers")
    .upload(coverPath, coverFile, {
      contentType: coverFile.type,
      upsert: false,
    });

  if (coverUploadError) {
    return NextResponse.json(
      { error: coverUploadError.message },
      { status: 500 }
    );
  }

  /* =============================
     INSERT TRACK (SERVICE ROLE)
  ============================= */
  const { data: track, error: insertError } = await admin
    .from("tracks")
    .insert({
      title,
      artist,
      price,
      format,
      file_path: fullPath,
      preview_path: previewPath,
      cover_path: coverPath,
      download_limit: downloadLimit,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  console.log("✅ Track uploaded:", track.id);

  return NextResponse.json({
    success: true,
    track: {
      ...track,
      preview_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${previewPath}`,
      cover_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${coverPath}`,
    },
  });
}
