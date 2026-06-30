"use client";

import { useCart } from "@/components/CartContext";

export default function CartButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const { itemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative text-sm uppercase tracking-widest"
    >
      Cart

      {itemCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
