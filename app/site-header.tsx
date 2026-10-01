"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Booking" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[#4A2C2A]/8 bg-[#FAF3E0]/95 backdrop-blur-sm">
      <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="shrink-0 text-xl font-black tracking-[-0.07em] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d86f3d]">Kopi Kita</Link>

        <div className="hidden items-center gap-1 rounded-full border border-[#4A2C2A]/10 bg-white/45 p-1 text-sm font-bold md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={link.href === "/booking" ? "rounded-full bg-[#4A2C2A] px-4 py-2 text-[#fffaf2] shadow-sm transition-all hover:bg-[#653a36] hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d86f3d]" : "rounded-full px-4 py-2 transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none"}>{link.label}</Link>
          ))}
        </div>

        <button type="button" aria-label="Toggle navigation menu" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen((open) => !open)} className="grid size-11 place-items-center rounded-full border border-[#4A2C2A]/15 bg-white/60 text-[#4A2C2A] transition-colors hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d86f3d] md:hidden">
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="flex w-5 flex-col gap-1.5"><span className={`h-0.5 w-full rounded-full bg-current transition-transform ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} /><span className={`h-0.5 w-full rounded-full bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} /><span className={`h-0.5 w-full rounded-full bg-current transition-transform ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} /></span>
        </button>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-[#4A2C2A]/8 bg-[#FAF3E0] px-5 py-3 shadow-[0_14px_24px_rgba(74,44,42,0.1)] md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className={link.href === "/booking" ? "rounded-xl bg-[#4A2C2A] px-4 py-3 text-sm font-extrabold text-[#fffaf2] transition-colors hover:bg-[#653a36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d86f3d]" : "rounded-xl px-4 py-3 text-sm font-extrabold transition-colors hover:bg-white/70 focus-visible:bg-white focus-visible:outline-none"}>{link.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
