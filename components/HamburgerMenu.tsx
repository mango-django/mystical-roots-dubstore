"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartContext";


export default function HamburgerMenu({
  onAuthClick,
  onCartClick,
}: {
  onAuthClick: () => void;
  onCartClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user, isVIP, isAdmin } = useUser();
  const { items } = useCart();
  const { clearCartOnLogout } = useCart();

  async function handleLogout() {
    await supabase.auth.signOut();
clearCartOnLogout();
setOpen(false);
window.location.href = "/";

  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="
          fixed top-3 right-3 z-50
          w-14 h-14
          rounded-full
          bg-neutral-900 border border-neutral-700
          flex flex-col justify-center items-center gap-1.5
          active:scale-95
          transition
        "
      >
        <span className="w-6 h-[2px] bg-white" />
        <span className="w-6 h-[2px] bg-white" />
        <span className="w-6 h-[2px] bg-white" />
      </button>

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-80
          bg-neutral-950 border-l border-neutral-800 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 pt-10 flex flex-col justify-between h-full text-lg">
          {/* TOP */}
          <div className="flex flex-col gap-6">
            <button
              onClick={() => setOpen(false)}
              className="
                absolute top-4 right-4
                text-sm text-neutral-400
                px-3 py-1
                border border-neutral-700 rounded
                hover:bg-neutral-800
              "
            >
              Close
            </button>

            {/* User Email */}
            {user && (
              <div className="text-sm text-neutral-400 break-all">
                Logged in as
                <div className="text-white mt-1">
                  {user.email}
                </div>
              </div>
            )}

            {/* Navigation */}
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/artists" onClick={() => setOpen(false)}>
              Artists
            </Link>

            <Link href="/shop" onClick={() => setOpen(false)}>
              Dub Shop
            </Link>

            <Link href="/merch" onClick={() => setOpen(false)}>
              Merch
            </Link>

            {user && (
              <Link href="/account" onClick={() => setOpen(false)}>
                Account
              </Link>
            )}

            <button
  onClick={() => {
    setOpen(false);
    onCartClick();
  }}
  className="flex justify-between items-center"
>
  <span>Cart</span>

  {items.length > 0 && (
    <span className="text-xs bg-white text-black rounded-full px-2 py-0.5">
      {items.length}
    </span>
  )}
</button>


            {isAdmin && (
  <button
    onClick={() => {
      setOpen(false);
      window.location.href = "/admin";
    }}
    className="text-left"
  >
    Admin
  </button>
)}
{isAdmin && (
  <Link href="/admin/tracks" onClick={() => setOpen(false)}>
    Tracks
  </Link>
)}
{isAdmin && (
  <Link href="/admin/tracks" onClick={() => setOpen(false)}>
    Dub Store Sections
  </Link>
)}



          </div>

          {/* BOTTOM */}
          <div className="flex flex-col gap-4 text-sm pt-6 border-t border-neutral-800">
            {/* Auth Action */}
            {user ? (
              <button
                onClick={handleLogout}
                className="
                  text-sm
                  px-3 py-1
                  border border-neutral-700 rounded
                  text-neutral-300
                  hover:bg-neutral-800
                  text-left
                "
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  onAuthClick();
                }}
                className="btn"
              >
                Login / Sign Up
              </button>
            )}

            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact Us
            </Link>

            <div className="flex gap-4 items-center">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/social/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/social/instagram.svg" alt="Instagram" className="w-5 h-5" />
            </a>

            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              <img src="/social/tiktok.svg" alt="TikTok" className="w-5 h-5" />
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src="/social/youtube.svg" alt="YouTube" className="w-5 h-5" />
            </a>
          </div>

          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
