"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/report", label: "Report" },
];

export default function TitleBanner() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-screen bg-gradient-to-r from-rose-100 via-amber-50 to-rose-50 shadow-sm border-b border-amber-200">
      {/* NAV BAR – sits at the very top */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-20 sm:pt-6">
        {/* Desktop links */}
        <ul className="hidden sm:flex space-x-8 text-sm font-medium text-amber-900">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          className="sm:hidden text-amber-900"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <nav className="sm:hidden bg-rose-100/90 backdrop-blur pb-4">
          <ul className="flex flex-col space-y-4 px-6 pt-4 text-amber-900 text-lg">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Centered title + tagline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-rose-600">
          Gouger
        </h2>
        <p className="mt-3 text-lg text-amber-900 max-w-xl mx-auto font-light">
          A tool for renters to identify price spikes during emergencies.
        </p>
      </div>
    </header>
  );
}
