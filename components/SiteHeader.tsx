"use client";

import Link from "next/link";

export default function SiteHeader({
  onCartClick,
}: {
  onCartClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            Mystical Roots Warrior
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          <Link
            href="/shop"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Dub Store
          </Link>
          <Link
            href="/artists"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Artists
          </Link>
          <Link
            href="/merch"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Merch
          </Link>
        </nav>

        {/* Spacer for hamburger button area (hamburger is fixed positioned separately) */}
        <div className="w-14" />
      </div>
    </header>
  );
}
