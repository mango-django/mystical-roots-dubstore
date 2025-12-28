"use client";

import { useCart } from "@/components/CartContext";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user } = useUser();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (user === null) {
      router.push("/?login=1");
    }
  }, [user, router]);

  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: items }),
    });

    if (!res.ok) {
      alert("Checkout failed");
      return;
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  // While redirecting
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-neutral-400">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl uppercase tracking-widest">
        Checkout
      </h1>

      {items.length === 0 ? (
        <p className="text-neutral-400">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-4 border border-neutral-800 p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <span>{item.title}</span>
                <span>£{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg">
            <strong>Total</strong>
            <strong>£{total.toFixed(2)}</strong>
          </div>

          <button
            className="btn w-full"
            onClick={handleCheckout}
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}
