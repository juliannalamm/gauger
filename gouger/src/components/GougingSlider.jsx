import React from "react";

const GougingSlider = ({ fmr, price }) => {
    if (!fmr || !price) return null;

    const max = fmr * 1.6; // 160% of FMR is gouging cutoff
    const min = fmr;       // start heatmap from FMR

    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
    const toPercent = (val) => ((clamp(val, min, max) - min) / (max - min)) * 100;

    const pricePosition = toPercent(price);

    return (
        <div className="my-3 w-full">
            {/* Labels */}
            <div className="flex justify-between text-sm font-medium text-gray-700 px-1 mb-1">
                <span>${fmr.toFixed(0)} (FMR)</span>
                <span>${max.toFixed(0)} (Gouging Zone)</span>
            </div>

            {/* Slider Track */}
            {/* Slider Track Container */}
            <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
                {/* Price Marker */}
                <div
                    className="absolute top-[-6px] transform -translate-x-1/2"
                    style={{ left: `${pricePosition}%` }}
                >
                    <div className="w-3 h-3 bg-black rounded-full border-2 border-white shadow" />
                </div>

                {/* Price Label */}
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
