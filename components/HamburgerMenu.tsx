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
  const { user, isAdmin } = useUser();
  const { items, clearCartOnLogout } = useCart();

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
          fixed top-3.5 right-4 z-50
          w-12 h-12
          rounded-full
          bg-neutral-900/90 backdrop-blur-sm border border-neutral-700/50
          flex flex-col justify-center items-center gap-1.5
          active:scale-95
          hover:bg-neutral-800/90 hover:border-neutral-600
          transition-all duration-200
        "
      >
        <span className="w-5 h-[1.5px] bg-white rounded-full" />
        <span className="w-5 h-[1.5px] bg-white rounded-full" />
        <span className="w-5 h-[1.5px] bg-white rounded-full" />
      </button>

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-80
          bg-neutral-950 border-l border-neutral-800/60 z-50
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 pt-8 flex flex-col justify-between h-full">
          {/* TOP */}
          <div className="flex flex-col gap-1">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="
                absolute top-4 right-4
                text-xs text-neutral-500
                px-3 py-1.5
                border border-neutral-800 rounded-lg
                hover:bg-neutral-800/60 hover:text-white
                transition-all duration-200
              "
            >
              Close
            </button>

            {/* User info */}
            {user && (
              <div className="text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-800/60">
                Logged in as
                <div className="text-white mt-1 text-sm break-all">
                  {user.email}
                </div>
              </div>
            )}

            {/* Navigation */}
            <NavLink href="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink href="/artists" onClick={() => setOpen(false)}>
              Artists
            </NavLink>
            <NavLink href="/shop" onClick={() => setOpen(false)}>
              Dub Store
            </NavLink>
            <NavLink href="/merch" onClick={() => setOpen(false)}>
              Merch
            </NavLink>

            {user && (
              <NavLink href="/account" onClick={() => setOpen(false)}>
                Account
              </NavLink>
            )}

            <button
              onClick={() => {
                setOpen(false);
                onCartClick();
              }}
              className="flex justify-between items-center px-3 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition-all text-left"
            >
              <span>Cart</span>
              {items.length > 0 && (
                <span className="text-[10px] bg-white text-black font-semibold rounded-full px-2 py-0.5">
                  {items.length}
                </span>
              )}
            </button>

            {isAdmin && (
              <>
                <div className="border-t border-neutral-800/40 my-2" />
                <p className="text-[10px] uppercase tracking-widest text-neutral-600 px-3 pt-2 pb-1">
                  Admin
                </p>
                <NavLink
                  href="/admin"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  href="/admin/tracks"
                  onClick={() => setOpen(false)}
                >
                  Manage Tracks
                </NavLink>
              </>
            )}
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col gap-4 pt-6 border-t border-neutral-800/60">
            {user ? (
              <button
                onClick={handleLogout}
                className="btn text-left text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  onAuthClick();
                }}
                className="btn-primary text-sm"
              >
                Login / Sign Up
              </button>
            )}

            <div className="flex gap-3 items-center">
              {[
                { icon: "/social/facebook.svg", label: "Facebook", href: "https://facebook.com" },
                { icon: "/social/instagram.svg", label: "Instagram", href: "https://instagram.com" },
                { icon: "/social/tiktok.svg", label: "TikTok", href: "https://tiktok.com" },
                { icon: "/social/youtube.svg", label: "YouTube", href: "https://youtube.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-800/50 border border-neutral-700/40 flex items-center justify-center hover:bg-neutral-700/50 transition-all"
                >
                  <img src={s.icon} alt={s.label} className="w-3.5 h-3.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

function NavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition-all"
    >
      {children}
    </Link>
  );
}
