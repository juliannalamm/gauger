"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function TitleBanner() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-screen bg-gradient-to-r from-red-100 via-green-50 to-green-100 shadow-sm border-b border-green-200 pt-20">
      {/* Centered title + icon + tagline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8  text-center">
        <div className="flex justify-center items-center gap-3">
          <Image
            src="/icon.svg"
            alt="Gouger Icon"
            width={60}
            height={60}
            priority
            className="inline-block"
          />
          <h2 className="text-3xl sm:text-5xl font-bold text-red-800 tracking-wide">
            Gouger
          </h2>
        </div>

        <p className="mt-2 mb-2 text-base sm:text-lg text-green-900 max-w-l mx-auto font-regular">
          A tool designed to identify unlawful rent price gouging during states of emergency.

        </p>
      </div>
    </header>
  );
}
