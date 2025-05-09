import React from "react";
import {
  AlertTriangle,
  DollarSign,
  ArrowBigLeft,
  ArrowBigRight,
} from "lucide-react";

const GougingSlider = ({ fmr, price, hasHistory, previousPrice }) => {
  if (!fmr || !price) return null;

  /* ---------- numbers ----------------------------------------------------- */
  const threshold = hasHistory ? previousPrice * 1.1 : fmr * 1.6;

  const MIN = 0;                  // left edge
  const MAX = threshold * 2;      // right edge  (threshold is centred)

  const clamp = (v) => Math.max(MIN, Math.min(v, MAX));
  const toPercent = (v) => ((v - MIN) / (MAX - MIN)) * 100;

  const pricePos  = toPercent(clamp(price));    // 0‥100 %
  const threshPos = 50;                         // always middle

  const priceOverflow =
    price < MIN ? "left" : price > MAX ? "right" : null;

  /* ---------- render ------------------------------------------------------ */
  return (
    <div className="my-6 w-full">
      {/* coloured bar : green → yellow → red with midpoint at 50 % */}
      <div
        className="relative h-3 w-full rounded-full"
        style={{
          background:
            "linear-gradient(to right, #4ade80 0%, #fde047 50%, #f87171 100%)",
        }}
      >
        {/* ⚠️  threshold marker & hover label */}
             {/* Threshold marker: thick black line */}
             <div
          className="group cursor-pointer"
          style={{
            position: "absolute",
            left: `${threshPos}%`,
            top: "-4px",            // rise above the bar slightly
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-[3px] h-6 bg-black rounded-sm drop-shadow-sm" />
          {/* on‑hover numeric label */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-black bg-white px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            ${threshold.toFixed(0)} threshold
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
          </div>
        </div>

        {/* 💲  price marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
          style={{ left: `${pricePos}%` }}
        >
          {priceOverflow === "left" && (
            <ArrowBigLeft className="w-5 h-5 fill-green-500 text-green-500" />
          )}
          {priceOverflow === "right" && (
            <ArrowBigRight className="w-5 h-5 fill-red-500 text-red-500" />
          )}
          {!priceOverflow && (
            <DollarSign className="w-5 h-5 text-black drop-shadow-sm" />
          )}

          {/* price tooltip */}
          <div className="absolute bottom-full mb-1 px-1.5 py-0.5 bg-white text-xs font-semibold text-black rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ${price.toFixed(0)} listed rent
          </div>
        </div>
      </div>
    </div>
  );
};

export default GougingSlider;
