"use client";

import { useCart } from "@/components/CartContext";

export default function CartDebug() {
  const { items, total } = useCart();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white text-sm p-4 border border-neutral-700">
      <p>Cart items: {items.length}</p>
      <p>Total: £{total.toFixed(2)}</p>
    </div>
  );
}
