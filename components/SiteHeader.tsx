"use client";

import Link from "next/link";

export default function SiteHeader({
  onCartClick,
}: {
  onCartClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center group">
          <img
            src="/logos/mysticalrootswarrior_header_logo.webp"
            alt="Mystical Roots Warrior"
            width={631}
            height={258}
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          <Link
            href="/artists"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Artists
          </Link>
          <Link
            href="/shop"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Music Store
          </Link>
          <Link
            href="/merch"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Merch
          </Link>
          <Link
            href="/shop/vip"
            className="text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            VIP Dubs
          </Link>
        </nav>

        {/* Spacer for hamburger button area (hamburger is fixed positioned separately) */}
        <div className="w-14" />
      </div>
    </header>
  );
}
