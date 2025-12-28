import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // ✅ Ignore all events except checkout completion
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Missing Supabase service role configuration");
      return NextResponse.json(
        { error: "Missing Supabase service role configuration" },
        { status: 500 }
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💳 Checkout completed:", session.id);
    console.log("📦 Metadata:", session.metadata);

    const userId = session.metadata?.user_id;
    const trackIds = session.metadata?.track_ids
      ?.split(",")
      .filter(Boolean);
    const merchVariantIds = session.metadata?.merch_variant_ids
      ?.split(",")
      .filter(Boolean);

    if (!userId || (!trackIds?.length && !merchVariantIds?.length)) {
      console.warn("⚠️ Missing metadata — skipping purchase creation");
      return NextResponse.json({ received: true });
    }

    /* =============================
       CREATE ORDER
    ============================= */
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        total: session.amount_total,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("❌ Order insert failed:", orderError);
      return NextResponse.json({ received: true });
    }

    if (trackIds?.length) {
      /* =============================
         FETCH TRACK SNAPSHOTS
      ============================= */
      const { data: tracks, error: tracksError } = await supabaseAdmin
        .from("tracks")
        .select("id, title, file_path")
        .in("id", trackIds);

      if (tracksError || !tracks?.length) {
        console.error("❌ Track fetch failed:", tracksError);
        return NextResponse.json({ received: true });
      }

      /* =============================
         CREATE PURCHASED TRACKS
      ============================= */
      const purchases = tracks.map((track) => ({
        user_id: userId,
        order_id: order.id,
        track_id: track.id,
        title: track.title,
        file_path: track.file_path,
      }));

      const { error: purchaseError } = await supabaseAdmin
        .from("purchased_tracks")
        .insert(purchases);

      if (purchaseError) {
        console.error("❌ Purchased tracks insert failed:", purchaseError);
      } else {
        console.log("✅ Purchased tracks inserted:", purchases.length);
      }
    }

    if (merchVariantIds?.length) {
      const { data: variants, error: variantsError } =
        await supabaseAdmin
          .from("merch_variants")
          .select("id, colour, size, price, product_id, merch_products ( title )")
          .in("id", merchVariantIds);

      if (variantsError || !variants?.length) {
        console.error("❌ Merch variants fetch failed:", variantsError);
        return NextResponse.json({ received: true });
      }

      const merchItems = variants.map((variant: any) => ({
        order_id: order.id,
        variant_id: variant.id,
        product_id: variant.product_id,
        title: variant.merch_products?.title ?? "Merch",
        colour: variant.colour,
        size: variant.size,
        price: variant.price,
      }));

      const { error: merchError } = await supabaseAdmin
        .from("merch_order_items")
        .insert(merchItems);

      if (merchError) {
        console.error("❌ Merch order items insert failed:", merchError);
      } else {
        console.log("✅ Merch order items inserted:", merchItems.length);
      }
    }
  } catch (err) {
    console.error("🔥 Webhook processing error:", err);
  }

  return NextResponse.json({ received: true });
}
