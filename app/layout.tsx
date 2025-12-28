"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import { AudioPlayerProvider } from "@/components/AudioPlayerContext";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CartButton from "@/components/CartButton";
import dynamic from "next/dynamic";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
const [activeTrack, setActiveTrack] = useState<any>(null);
const TrackSheet = dynamic(
  () => import("@/components/TrackSheet"),
  { ssr: false }
);


useEffect(() => {
  function handleOpen(e: any) {
    setActiveTrack(e.detail);
  }

  document.addEventListener("open-track-sheet", handleOpen);
  return () =>
    document.removeEventListener("open-track-sheet", handleOpen);
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
    return () =>
      document.removeEventListener("cart-toast", handleToast);
  }, []);

  return (
  <html lang="en">
    <body>
      <CartProvider>
        <AudioPlayerProvider>
          <HamburgerMenu
            onAuthClick={() => setAuthOpen(true)}
            onCartClick={() => setCartOpen(true)}
          />
        <TrackSheet
  track={activeTrack}
  onClose={() => setActiveTrack(null)}
/>

          {children}

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
