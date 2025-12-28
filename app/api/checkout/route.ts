import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

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

  const body = await req.json();
  const items = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body?.cartItems)
      ? body.cartItems
      : body?.trackId
        ? [{ id: body.trackId, type: "track" }]
        : [];

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  const trackIds = items
    .filter((item: any) => item?.type !== "merch")
    .map((item: any) => item.id);

  const merchVariantIds = items
    .filter((item: any) => item?.type === "merch")
    .map((item: any) => item.id);

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (trackIds.length > 0) {
    const { data: tracks, error } = await supabase
      .from("tracks")
      .select("id, title, price")
      .in("id", trackIds);

    if (error || !tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: "Tracks not found" },
        { status: 404 }
      );
    }

    line_items.push(
      ...tracks.map((track) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: track.title,
        },
        unit_amount: track.price, // already in pence
      },
      quantity: 1,
      }))
    );
  }

  if (merchVariantIds.length > 0) {
    const { data: variants, error } = await supabase
      .from("merch_variants")
      .select(
        "id, price, colour, size, merch_products ( title )"
      )
      .in("id", merchVariantIds);

    if (error || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: "Merch variants not found" },
        { status: 404 }
      );
    }

    line_items.push(
      ...variants.map((variant: any) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${variant.merch_products?.title ?? "Merch"} (${variant.colour} / ${variant.size})`,
          },
          unit_amount: variant.price,
        },
        quantity: 1,
      }))
    );
  }

  if (line_items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  customer_email: user.email!,
  line_items,

  // 🔑 MUST be here
  metadata: {
    user_id: user.id,
    track_ids: trackIds.join(","),
    merch_variant_ids: merchVariantIds.join(","),
  },

  // 🔑 ALSO REQUIRED for webhook reliability
  payment_intent_data: {
    metadata: {
      user_id: user.id,
      track_ids: trackIds.join(","),
      merch_variant_ids: merchVariantIds.join(","),
    },
  },

  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?success=1`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
});

  return NextResponse.json({ url: session.url });
}
