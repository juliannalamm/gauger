import React from "react";
import { exportListingsToCSV } from "../lib/ExportCSV";
import { ArrowRight, Download } from "lucide-react";

const ExportButton = ({ rentals, filename = "rentals.csv", variant = "all" }) => {
  if (!Array.isArray(rentals) || rentals.length === 0) return null;

  const handleExport = () => {
    const dataToExport =
      variant === "gouging"
        ? rentals.filter((r) => r.isGouging)
        : rentals;

    const file = variant === "gouging" ? "gouging_" + filename : filename;

    exportListingsToCSV(dataToExport, file);
  };

  const label =
    variant === "gouging" ? "Export Gouged Only" : "Export Listings";

  const baseClasses =
    "inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium transition border";

  const variantClasses =
    variant === "gouging"
      ? "bg-gradient-to-r from-red-200 via-red-100 to-red-50 text-red-800 border-red-300 hover:shadow-md"
      : "bg-gradient-to-r from-green-100 via-green-50 to-green-200 text-green-900 border-green-300 hover:shadow-md";

  const iconBg =
    variant === "gouging" ? "bg-red-800" : "bg-green-900";

  return (
    <button onClick={handleExport} className={`${baseClasses} ${variantClasses}`}>
      {label}
      <span className={`flex items-center justify-center w-5 h-5 rounded-full ${iconBg} text-white`}>
        <Download className="w-4 h-4" />
      </span>
    </button>
  );
};

export default ExportButton;
