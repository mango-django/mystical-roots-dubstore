"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import { AudioPlayerProvider } from "@/components/AudioPlayerContext";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase/client";

// Defined at module scope so the component identity is stable across renders —
// otherwise the sheet remounts (losing its selected version) on every toast.
const TrackSheet = dynamic(() => import("@/components/TrackSheet"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<any>(null);

  useEffect(() => {
    function handleOpen(e: any) {
      setActiveTrack(e.detail);
    }
    document.addEventListener("open-track-sheet", handleOpen);
    return () => document.removeEventListener("open-track-sheet", handleOpen);
  }, []);

  useEffect(() => {
    function openAuth() {
      setAuthOpen(true);
    }
    document.addEventListener("open-auth", openAuth);
    return () => document.removeEventListener("open-auth", openAuth);
  }, []);

  useEffect(() => {
    function handleToast(e: Event) {
      const detail = (e as CustomEvent).detail as string | undefined;
      setToastMessage(detail ?? "Added to cart");
    }
    document.addEventListener("cart-toast", handleToast);
    return () => document.removeEventListener("cart-toast", handleToast);
  }, []);

  // Detect Supabase PASSWORD_RECOVERY event and redirect to reset page
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.location.href = "/auth/reset-password";
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <AudioPlayerProvider>
            {/* Fixed nav elements */}
            <SiteHeader onCartClick={() => setCartOpen(true)} />
            <HamburgerMenu
              onAuthClick={() => setAuthOpen(true)}
              onCartClick={() => setCartOpen(true)}
            />

            {/* Main content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Footer */}
            <SiteFooter />

            {/* Overlays */}
            <TrackSheet
              track={activeTrack}
              onClose={() => setActiveTrack(null)}
            />

            <AuthModal
              open={authOpen}
              onClose={() => setAuthOpen(false)}
            />

            <CartDrawer
              open={cartOpen}
              onClose={() => setCartOpen(false)}
            />

            {toastMessage && (
              <Toast
                message={toastMessage}
                onClose={() => setToastMessage(null)}
              />
            )}
          </AudioPlayerProvider>
        </CartProvider>
      </body>
    </html>
  );
}
