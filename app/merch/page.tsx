"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartContext";

type MerchProduct = {
  id: string;
  title: string;
  image_path: string;
};

type MerchVariant = {
  id: string;
  product_id: string;
  colour: string;
  size: string;
  price: number;
};

export default function MerchPage() {
  const { addItem } = useCart();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [variants, setVariants] = useState<MerchVariant[]>([]);
  const [selectedColour, setSelectedColour] =
    useState<Record<string, string>>({});
  const [selectedSize, setSelectedSize] =
    useState<Record<string, string>>({});

  useEffect(() => {
    loadMerch();
  }, []);

  async function loadMerch() {
    const { data: products } = await supabase
      .from("merch_products")
      .select("*");

    const { data: variants } = await supabase
      .from("merch_variants")
      .select("*");

    setProducts(products || []);
    setVariants(variants || []);
  }

  function getVariants(productId: string) {
    return variants.filter((v) => v.product_id === productId);
  }

  function handleAddToCart(product: MerchProduct) {
    const colour = selectedColour[product.id];
    const size = selectedSize[product.id];

    if (!colour || !size) {
      alert("Please select colour & size");
      return;
    }

    const variant = variants.find(
      (v) =>
        v.product_id === product.id &&
        v.colour === colour &&
        v.size === size
    );

    if (!variant) {
      alert("This combination is not available");
      return;
    }

    addItem({
      id: variant.id,
      title: `${product.title} (${variant.colour} / ${variant.size})`,
      price: variant.price / 100,
      image: product.image_path
        ? getMerchImageUrl(product.image_path)
        : undefined,
      type: "merch",
    });
  }

  function getMerchImageUrl(imagePath: string) {
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const normalized = imagePath.replace(/^\/+/, "");
    const path = normalized.startsWith("merch/")
      ? normalized
      : `merch/${normalized}`;
    return `${supabaseUrl}/storage/v1/object/public/merch/${path}`;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="uppercase tracking-widest text-xl">
        Merch
      </h1>

      {products.length === 0 && (
        <p className="text-sm text-neutral-400">
          No merch available yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const productVariants = getVariants(product.id);

          const colours = Array.from(
            new Set(productVariants.map((v) => v.colour))
          );

          const sizes = Array.from(
            new Set(productVariants.map((v) => v.size))
          );

          return (
            <div
              key={product.id}
              className="bg-neutral-900 border border-neutral-800 p-4 space-y-4"
            >
              {/* IMAGE */}
              <div className="aspect-square bg-neutral-800 overflow-hidden">
                {product.image_path && (
                  <img
                    src={getMerchImageUrl(product.image_path)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* TITLE */}
              <h2 className="font-medium">{product.title}</h2>

              {/* VARIANT SELECT */}
              <div className="space-y-2 text-sm">
                {/* COLOUR */}
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 p-2"
                  value={selectedColour[product.id] ?? ""}
                  onChange={(e) => {
                    const colour = e.target.value;
                    setSelectedColour((prev) => ({
                      ...prev,
                      [product.id]: colour,
                    }));
                  }}
                >
                  <option value="" disabled>
                    Select colour
                  </option>
                  {colours.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* SIZE */}
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 p-2"
                  value={selectedSize[product.id] ?? ""}
                  onChange={(e) => {
                    const size = e.target.value;
                    setSelectedSize((prev) => ({
                      ...prev,
                      [product.id]: size,
                    }));
                  }}
                >
                  <option value="" disabled>
                    Select size
                  </option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              {selectedColour[product.id] &&
                selectedSize[product.id] && (
                <div className="text-sm">
                  £
                  {(
                    (variants.find(
                      (v) =>
                        v.product_id === product.id &&
                        v.colour === selectedColour[product.id] &&
                        v.size === selectedSize[product.id]
                    )?.price ?? 0) / 100
                  ).toFixed(2)}
                </div>
              )}

              {/* ADD TO CART */}
              <button
                className="btn w-full"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
