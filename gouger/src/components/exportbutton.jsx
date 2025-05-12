import React from "react";
import { exportListingsToCSV } from "../lib/ExportCSV"; 

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

  const baseClasses =
    "px-2 py-1 font-semibold rounded transition";
  const colorClasses =
    variant === "gouging"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-green-600 text-white hover:bg-green-700";

  return (
    <button
      onClick={handleExport}
      className={`${baseClasses} ${colorClasses}`}
    >
      {variant === "gouging" ? "Export Gouged Only" : "Export Listings"}
    </button>
  );
};

export default ExportButton;
