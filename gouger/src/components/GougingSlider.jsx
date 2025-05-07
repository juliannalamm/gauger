import React from "react";

const GougingSlider = ({ fmr, price, hasHistory, previousPrice }) => {
  if (!fmr || !price) return null;

  // 🐞 Debug
  console.log(
    hasHistory
      ? `Using history-based threshold: previous = $${previousPrice}, cutoff = $${(previousPrice * 1.1).toFixed(2)}`
      : `Using FMR-based threshold: FMR = $${fmr}, cutoff = $${(fmr * 1.6).toFixed(2)}`
  );

  const max = hasHistory ? previousPrice * 1.1 : fmr * 1.6;
  const min = hasHistory ? previousPrice : fmr;

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
  const toPercent = (val) => ((clamp(val, min, max) - min) / (max - min)) * 100;

  const pricePosition = toPercent(price);

  return (
    <div className="my-3 w-full">
      <div className="flex justify-between text-sm font-medium text-gray-700 px-1 mb-1">
        <span>
          ${min.toFixed(0)} {hasHistory ? "(Prev Rent)" : "(FMR)"}
        </span>
        <span>
          ${max.toFixed(0)} {hasHistory ? "(+10%)" : "(Gouging Threshold)"}
        </span>
      </div>

      <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
        <div
          className="absolute top-[-6px] transform -translate-x-1/2"
          style={{ left: `${pricePosition}%` }}
        >
          <div className="w-3 h-3 bg-black rounded-full border-2 border-white shadow" />
        </div>

        <div
          className="absolute top-[16px] text-xs text-black font-semibold"
          style={{ left: `${pricePosition}%`, transform: "translateX(-50%)" }}
        >
          ${price.toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default GougingSlider;
