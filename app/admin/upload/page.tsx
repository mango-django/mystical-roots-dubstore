"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CreateMerchProduct from "@/components/admin/CreateMerchProduct";

export default function AdminUploadPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget; // 👈 store reference safely

  setLoading(true);
  setMessage(null);

  const formData = new FormData(form);


    const res = await fetch("/api/upload-track", {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      setMessage("Upload failed");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setMessage(data.error || "Upload failed");
      setLoading(false);
      return;
    }

    setMessage("✅ Track uploaded successfully");
    setLoading(false);
    form.reset();

  }

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <main className="p-6 max-w-xl mx-auto space-y-10">
        <h1 className="uppercase tracking-widest text-xl">
          Upload Track
        </h1>

        {message && (
          <div className="surface p-3 text-sm">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="title"
            placeholder="Track title"
            required
            className="w-full p-2 bg-neutral-900 border border-neutral-700"
          />

          <input
            name="artist"
            placeholder="Artist"
            required
            className="w-full p-2 bg-neutral-900 border border-neutral-700"
          />

          <input
            name="price"
            type="number"
            placeholder="Price (pence)"
            required
            className="w-full p-2 bg-neutral-900 border border-neutral-700"
          />

          <input
            name="format"
            placeholder="Format (MP3 / WAV)"
            required
            className="w-full p-2 bg-neutral-900 border border-neutral-700"
          />

          <input
            name="download_limit"
            type="number"
            placeholder="Download limit (default 3)"
            className="w-full p-2 bg-neutral-900 border border-neutral-700"
          />

          <div>
            <label className="block text-sm mb-1">
              Full track (private)
            </label>
            <input
              name="file"
              type="file"
              accept="audio/*"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Preview clip (public)
            </label>
            <input
              name="preview"
              type="file"
              accept="audio/*"
              required
            />
          </div>
        <div>
  <label className="block text-sm mb-1">
    Cover Art (square image)
  </label>
  <input
    type="file"
    name="cover"
    accept="image/*"
    required
    
  />
  
</div>

          <button
            disabled={loading}
            className="btn w-full"
          >
            {loading ? "Uploading…" : "Upload Track"}
          </button>
        </form>

        <CreateMerchProduct />
      </main>
    </ProtectedRoute>
  );
}
