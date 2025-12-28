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

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;
  const colours = formData
    .getAll("colours")
    .map((value) => String(value));
  const sizes = formData
    .getAll("sizes")
    .map((value) => String(value));

  if (
    !title ||
    !price ||
    !image ||
    colours.length === 0 ||
    sizes.length === 0
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const path = `merch/${Date.now()}-${image.name.replace(/\s+/g, "_")}`;

  await supabaseAdmin.storage
    .from("merch")
    .upload(path, image, {
      contentType: image.type,
    });

  // Create product
  const { data: product, error } = await supabaseAdmin
    .from("merch_products")
    .insert({
      title,
      base_price: price,
      image_path: path,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create variants
  const variants = colours.flatMap((colour) =>
    sizes.map((size) => ({
      product_id: product.id,
      colour,
      size,
      price,
    }))
  );

  await supabaseAdmin
    .from("merch_variants")
    .insert(variants);

  return NextResponse.json({ success: true });
}
