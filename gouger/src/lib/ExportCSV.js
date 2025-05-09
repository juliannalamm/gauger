import { unparse } from "papaparse";
import { saveAs } from "file-saver";

export function exportListingsToCSV(listings, filename = "rentals.csv") {
  if (!Array.isArray(listings) || listings.length === 0) return;

  // Clean/flatten the data you want to export
  const data = listings.map((rental) => ({
    ID: rental.id,
    Address: rental.formattedAddress,
    City: rental.city,
    State: rental.state,
    ZIP: rental.zipCode,
    Bedrooms: rental.bedrooms,
    Bathrooms: rental.bathrooms,
    Price: rental.price,
    PreviousPrice: rental.previousPrice ?? "",
    HasHistory: rental.hasHistory ? "Yes" : "No",
    FMR: rental.fmrValue,
    GougingThreshold: rental.fmrGougingCutoff,
    IsGouging: rental.isGouging ? "Yes" : "No",
    RentCategory: rental.rentCategory,
    LastSeen: rental.lastSeenDate,
  }));

  const csv = unparse(data); // Convert JSON to CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  saveAs(blob, filename);
}
