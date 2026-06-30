"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  type: "track" | "merch";
  quantity: number;

  // merch-only
  variantId?: string;
  size?: string;
  colour?: string;
};


type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  clearCartOnLogout: () => void;
  itemCount: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        // Backfill quantity for carts saved before quantity existed.
        setItems(parsed.map((i) => ({ ...i, quantity: i.quantity ?? 1 })));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    const qty = item.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("cart-toast", {
            detail: `${item.title} added to cart`,
          })
        );
      }, 0);

      // Tracks are digital — only ever one. Merch increments quantity.
      if (existing) {
        if (item.type === "track") return prev;
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }

      return [...prev, { ...item, quantity: qty }];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function clearCartOnLogout() {
    setItems([]);
    localStorage.removeItem("cart");
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        clearCartOnLogout,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
