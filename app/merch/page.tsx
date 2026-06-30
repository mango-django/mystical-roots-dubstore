"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartContext";

type MerchProduct = {
  id: string;
  title: string;
  image_path: string;
  base_price: number | null;
};

type MerchVariant = {
  id: string;
  product_id: string;
  colour: string;
  size: string;
  price: number;
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export default function MerchPage() {
  const { addItem } = useCart();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [variants, setVariants] = useState<MerchVariant[]>([]);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMerch();
  }, []);

  async function loadMerch() {
    const { data: products } = await supabase.from("merch_products").select("*");
    const { data: variants } = await supabase.from("merch_variants").select("*");
    setProducts(products || []);
    setVariants(variants || []);
  }

  function getVariants(productId: string) {
    return variants.filter((v) => v.product_id === productId);
  }

  function getMerchImageUrl(imagePath: string) {
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const normalized = imagePath.replace(/^\/+/, "");
    const path = normalized.startsWith("merch/") ? normalized : `merch/${normalized}`;
    return `${supabaseUrl}/storage/v1/object/public/merch/${path}`;
  }

  function handleAddToCart(product: MerchProduct) {
    const size = selectedSize[product.id];
    if (!size) {
      alert("Please choose a size");
      return;
    }

    const variant = getVariants(product.id).find((v) => v.size === size);
    if (!variant) {
      alert("That size is sold out");
      return;
    }

    addItem({
      id: variant.id,
      title: `${product.title} (${variant.size})`,
      price: variant.price / 100,
      image: product.image_path ? getMerchImageUrl(product.image_path) : undefined,
      type: "merch",
      variantId: variant.id,
      size: variant.size,
      colour: variant.colour,
    });
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          Wear the Culture
        </p>
        <h1>Merch</h1>
        <p className="text-sm text-neutral-400 mt-3">
          Official Mystical Roots Warrior tees &mdash; &pound;4.99 each. Flat
          &pound;3.00 postage &amp; packaging per order. UK delivery.
        </p>
      </div>

      {products.length === 0 && (
        <p className="text-sm text-neutral-500">No merch available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => {
          const productVariants = getVariants(product.id);
          const colour = productVariants[0]?.colour;
          const sizes = SIZE_ORDER.filter((s) =>
            productVariants.some((v) => v.size === s)
          );
          const price = (productVariants[0]?.price ?? product.base_price ?? 0) / 100;
          const chosen = selectedSize[product.id];

          return (
            <div
              key={product.id}
              className="group bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Product image (on white for a clean product shot) */}
              <div className="aspect-square bg-white overflow-hidden">
                {product.image_path && (
                  <img
                    src={getMerchImageUrl(product.image_path)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold leading-snug">
                      {product.title}
                    </h2>
                    <span className="shrink-0 text-base font-semibold">
                      &pound;{price.toFixed(2)}
                    </span>
                  </div>
                  {colour && (
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      {colour} &middot; Unisex Tee
                    </p>
                  )}
                </div>

                {/* Size selector */}
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500">Size</p>
                  <div className="flex gap-2">
                    {sizes.map((s) => {
                      const active = chosen === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            setSelectedSize((prev) => ({ ...prev, [product.id]: s }))
                          }
                          aria-pressed={active}
                          className={`w-11 h-10 rounded-lg border text-sm font-medium transition-colors ${
                            active
                              ? "bg-white text-black border-white"
                              : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto space-y-2 pt-2">
                  <button
                    className="btn-primary w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center">
                    + &pound;3.00 P&amp;P at checkout
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
