import React from "react";
import { AlertTriangle } from "lucide-react"; // or ShieldExclamation, Info, etc.
import { DollarSign } from "lucide-react"; // or Home, MapPin, etc.


const GougingSlider = ({ fmr, price, hasHistory, previousPrice }) => {
    if (!fmr || !price) return null;

    const threshold = hasHistory ? previousPrice * 1.1 : fmr * 1.6;
    const min = hasHistory ? previousPrice : fmr;
    const max = threshold * 2; // Make threshold the center

    console.log(
        `Min: $${min.toFixed(0)}, Threshold: $${threshold.toFixed(0)}, Max: $${max.toFixed(0)}, Price: $${price}`
    );

    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
    const toPercent = (val) => ((val - min) / (max - min)) * 100;

    const pricePosition = toPercent(price);
    const thresholdPercent = toPercent(threshold);

    return (
        <div className="my-6 w-full">
            <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
                {/* Marker for Gouging Threshold */}
                {/* Threshold Marker Icon */}
                <div
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${thresholdPercent}%` }}
                    title="Gouging Threshold"
                >
                    <AlertTriangle className="w-5 h-5 text-red-600 drop-shadow-md" />

                    {/* Hover label */}
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-[11px] text-black font-semibold whitespace-nowrap px-2 py-0.5 rounded bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        ${threshold.toFixed(0)} threshold
                        {/* Little pointer arrow */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
                    </div>
                </div>

                {/* Price Marker + Tooltip */}
                <div
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${pricePosition}%` }}
                >
                    {/* Icon for price */}
                    <DollarSign className="w-5 h-5 text-black drop-shadow-sm" />

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 px-1.5 py-0.5 bg-white text-xs font-semibold text-black rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        ${price.toFixed(0)} listed rent
                    </div>
                </div>

            </div>


        </div>
    );
};

export default GougingSlider;
