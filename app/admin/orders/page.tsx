"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

type MerchItem = {
  id: string;
  title: string | null;
  colour: string | null;
  size: string | null;
  price: number | null;
  quantity: number;
};

type TrackItem = { id: string; title: string | null };

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

type Order = {
  id: string;
  created_at: string;
  email: string | null;
  total: number | null;
  shipping_total: number | null;
  shipping_name: string | null;
  shipping_address: Address | null;
  merch_order_items: MerchItem[];
  purchased_tracks: TrackItem[];
};

function money(pence: number | null | undefined) {
  return `£${((pence ?? 0) / 100).toFixed(2)}`;
}

function formatAddress(a: Address | null) {
  if (!a) return null;
  return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
    .filter(Boolean)
    .join(", ");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load orders");
        setOrders(data.orders || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="uppercase tracking-widest text-xl">Orders</h1>
          <Link href="/admin" className="text-sm text-neutral-400 hover:text-white">
            &larr; Admin
          </Link>
        </div>

        {loading && <p className="text-sm text-neutral-400">Loading orders…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-neutral-400">No orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const hasMerch = order.merch_order_items.length > 0;
            const address = formatAddress(order.shipping_address);
            const itemsTotal =
              (order.total ?? 0) - (order.shipping_total ?? 0);

            return (
              <div
                key={order.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleString("en-GB")}
                    </p>
                    <p className="text-neutral-500">
                      {order.email ?? "—"} &middot; #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{money(order.total)}</p>
                    {hasMerch && (
                      <p className="text-xs text-neutral-500">
                        incl. {money(order.shipping_total)} P&amp;P
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping address (merch only) */}
                {hasMerch && (
                  <div className="rounded-lg bg-neutral-950/60 border border-neutral-800/60 p-3 text-sm">
                    <p className="text-[10px] uppercase tracking-widest text-amber-400/80 mb-1">
                      Ship to
                    </p>
                    <p className="font-medium">{order.shipping_name ?? "—"}</p>
                    <p className="text-neutral-400">{address ?? "No address captured"}</p>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-1.5 text-sm">
                  {order.merch_order_items.map((m) => (
                    <div key={m.id} className="flex justify-between gap-3">
                      <span>
                        <span className="text-neutral-500">{m.quantity}&times;</span>{" "}
                        {m.title}{" "}
                        <span className="text-neutral-500">
                          ({[m.colour, m.size].filter(Boolean).join(" / ")})
                        </span>
                      </span>
                      <span className="text-neutral-400 tabular-nums">
                        {money((m.price ?? 0) * m.quantity)}
                      </span>
                    </div>
                  ))}

                  {order.purchased_tracks.map((t) => (
                    <div key={t.id} className="flex justify-between gap-3">
                      <span>
                        <span className="text-neutral-500">Track</span> {t.title}
                      </span>
                      <span className="text-neutral-600 text-xs self-center">
                        digital
                      </span>
                    </div>
                  ))}
                </div>

                {hasMerch && (
                  <div className="border-t border-neutral-800/60 pt-2 text-xs text-neutral-500 flex justify-between">
                    <span>Items {money(itemsTotal)} + P&amp;P {money(order.shipping_total)}</span>
                    <span>Total {money(order.total)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </ProtectedRoute>
  );
}
