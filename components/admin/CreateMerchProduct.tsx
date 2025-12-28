"use client";

import { useState } from "react";

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

export default function CreateMerchProduct() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(2500);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", String(price));
    if (image) formData.append("image", image);
    selectedColours.forEach((colour) =>
      formData.append("colours", colour)
    );
    selectedSizes.forEach((size) =>
      formData.append("sizes", size)
    );

    const res = await fetch("/api/admin/merch/create-product", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Failed");
      return;
    }

    setMessage("✅ Merch product created");
    setTitle("");
    setImage(null);
    setSelectedColours([]);
    setSelectedSizes([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-900 border border-neutral-800 p-6 space-y-4"
    >
      <h2 className="uppercase tracking-widest text-sm">
        Create Merch Product
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product title"
        className="w-full p-2 bg-neutral-800 border border-neutral-700"
        required
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price (pence)"
        className="w-full p-2 bg-neutral-800 border border-neutral-700"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
        required
      />

      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Colours
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {COLOURS.map((colour) => (
              <label key={colour} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedColours.includes(colour)}
                  onChange={(e) => {
                    setSelectedColours((prev) =>
                      e.target.checked
                        ? [...prev, colour]
                        : prev.filter((c) => c !== colour)
                    );
                  }}
                />
                {colour}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Sizes
          </p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {SIZES.map((size) => (
              <label key={size} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={(e) => {
                    setSelectedSizes((prev) =>
                      e.target.checked
                        ? [...prev, size]
                        : prev.filter((s) => s !== size)
                    );
                  }}
                />
                {size}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn"
        disabled={
          loading ||
          selectedColours.length === 0 ||
          selectedSizes.length === 0
        }
      >
        {loading ? "Creating…" : "Create Product"}
      </button>

      {message && (
        <p className="text-sm text-neutral-400">{message}</p>
      )}
    </form>
  );
}
