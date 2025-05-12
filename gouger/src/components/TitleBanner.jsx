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
    <header className="w-screen bg-gradient-to-r from-rose-100 via-amber-50 to-rose-50 shadow-sm border-b border-amber-200 pt-20">
  
      {/* Centered title + tagline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
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
