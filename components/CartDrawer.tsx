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

  const POSTAGE = 3;
  const hasMerch = items.some((i) => i.type === "merch");
  const orderTotal = total + (hasMerch ? POSTAGE : 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-neutral-950 border-l border-neutral-800/60 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-neutral-600 text-sm">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex gap-3 items-center border-b border-neutral-800/40 pb-3"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-11 h-11 rounded-lg object-cover bg-neutral-800"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-neutral-500">
                  &pound;{item.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800/60 pt-5 space-y-3 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span>&pound;{total.toFixed(2)}</span>
          </div>
          {hasMerch && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Postage &amp; packaging</span>
              <span>&pound;{POSTAGE.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-neutral-800/40">
            <span>Total</span>
            <span>&pound;{orderTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn-primary w-full"
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
