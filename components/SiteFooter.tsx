"use client";

import Link from "next/link";

const navLinks = [
  { label: "Dub Store", href: "/shop" },
  { label: "Artists", href: "/artists" },
  { label: "Merch", href: "/merch" },
  { label: "Account", href: "/account" },
];

const socialLinks = [
  { label: "Facebook", icon: "/social/facebook.svg", href: "https://facebook.com" },
  { label: "Instagram", icon: "/social/instagram.svg", href: "https://instagram.com" },
  { label: "TikTok", icon: "/social/tiktok.svg", href: "https://tiktok.com" },
  { label: "YouTube", icon: "/social/youtube.svg", href: "https://youtube.com" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800/60 mt-20 sm:mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3
              className="text-xl font-bold uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
            >
              Mystical Roots Warrior
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              South London reggae & roots collective. Independent music direct
              from the artists.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center hover:bg-neutral-700/60 hover:border-neutral-600 transition-all"
                >
                  <img
                    src={social.icon}
                    alt={social.label}
                    className="w-4 h-4 opacity-70"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Mystical Roots Warrior. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Roots. Culture. Sound.
          </p>
          <p className="text-xs text-neutral-600">
            Developed and Maintained by{" "}
            <a
              href="https://builtweb.co.uk"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              BuiltWeb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
