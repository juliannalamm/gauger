// components/DownloadCSVButton.jsx
import React from "react";
import { exportListingsToCSV } from "../lib/ExportCSV"; // adjust path if needed

const ExportButton = ({ rentals, filename = "rentals.csv" }) => {
  if (!Array.isArray(rentals) || rentals.length === 0) return null;

  return (
    <button
      onClick={() => exportListingsToCSV(rentals, filename)}
      className="mt-2 px-2 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
    >
      Download CSV
    </button>
  );
};

export default ExportButton;
