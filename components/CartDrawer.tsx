"use client";

import { useCart } from "@/components/CartContext";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, total } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-neutral-900 border-l border-neutral-800 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="uppercase tracking-widest text-sm">
            Your Cart
          </h2>
          <button onClick={onClose} className="text-neutral-400">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-neutral-500 text-sm">
              Your cart is empty.
            </p>
          )}

          {items.map((item) => (
  <div
    key={`${item.type}-${item.id}`}
    className="flex gap-3 items-center border-b border-neutral-800 pb-3"
  >

              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-12 h-12 object-cover bg-neutral-800"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm">{item.title}</p>
                <p className="text-xs text-neutral-400">
                  £{item.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <button
  className="btn w-full"
  disabled={items.length === 0}
  onClick={async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Checkout failed");
      return;
    }

    window.location.href = data.url;
  }}
>
  Checkout
</button>

        </div>
      </div>
    </div>
  );
}
