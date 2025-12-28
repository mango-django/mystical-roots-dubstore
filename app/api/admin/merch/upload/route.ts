import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const COLOURS = [
  "Black",
  "White",
  "Grey",
  "Green",
  "Red",
  "Yellow",
  "Blue",
  "Purple",
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

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

  // 📦 Form data
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;

  if (!title || !price || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 🖼 Upload image
  const imagePath = `merch/${Date.now()}-${image.name.replace(/\s+/g, "_")}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("merch")
    .upload(imagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // 🧾 Create product
  const { data: product, error: productError } = await supabaseAdmin
    .from("merch_products")
    .insert({
      title,
      image_path: imagePath,
    })
    .select()
    .single();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  // 🎽 Create variants WITH PRICE
  const variants = [];

  for (const colour of COLOURS) {
    for (const size of SIZES) {
      variants.push({
        product_id: product.id,
        colour,
        size,
        price,     // ✅ PRICE LIVES HERE
        stock: 0,  // ignored for now
      });
    }
  }

  const { error: variantError } = await supabaseAdmin
    .from("merch_variants")
    .insert(variants);

  if (variantError) {
    return NextResponse.json({ error: variantError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
