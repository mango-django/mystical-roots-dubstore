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
  const [selectedColour, setSelectedColour] = useState<Record<string, string>>({});
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
    <main className="page-container">
      <div className="page-header">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          Wear the Culture
        </p>
        <h1>Merch</h1>
      </div>

      {products.length === 0 && (
        <p className="text-sm text-neutral-500">No merch available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => {
          const productVariants = getVariants(product.id);
          const colours = Array.from(new Set(productVariants.map((v) => v.colour)));
          const sizes = Array.from(new Set(productVariants.map((v) => v.size)));

          return (
            <div
              key={product.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden"
            >
              {/* Product image */}
              <div className="aspect-square bg-neutral-800 overflow-hidden">
                {product.image_path && (
                  <img
                    src={getMerchImageUrl(product.image_path)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <h2 className="text-base font-semibold">{product.title}</h2>

                {/* Variant selectors */}
                <div className="space-y-2.5">
                  <select
                    className="input"
                    value={selectedColour[product.id] ?? ""}
                    onChange={(e) =>
                      setSelectedColour((prev) => ({
                        ...prev,
                        [product.id]: e.target.value,
                      }))
                    }
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

                  <select
                    className="input"
                    value={selectedSize[product.id] ?? ""}
                    onChange={(e) =>
                      setSelectedSize((prev) => ({
                        ...prev,
                        [product.id]: e.target.value,
                      }))
                    }
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

                {/* Price display */}
                {selectedColour[product.id] && selectedSize[product.id] && (
                  <div className="text-lg font-semibold">
                    &pound;
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

                <button
                  className="btn-primary w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
