"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-red-100 via-green-50 to-green-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-10 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-light tracking-wider text-red-800 select-none">
          Gouger
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-8 text-sm font-semibold text-green-900 tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden text-green-900">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden px-6 pb-4 space-y-2 bg-gradient-to-r from-red-100 via-green-50 to-green-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-green-900 font-medium tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
