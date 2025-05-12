import { unparse } from "papaparse";
import { saveAs } from "file-saver";

function flattenHistory(historyObj) {
  if (!historyObj || typeof historyObj !== "object") return "";

  return Object.entries(historyObj)
    .map(([date, entry]) => {
      const price = entry?.price;
      return price ? `${date}: $${price}` : null;
    })
    .filter(Boolean)
    .join(" | ");
}

export function exportListingsToCSV(listings, filename = "rentals.csv") {
  if (!Array.isArray(listings) || listings.length === 0) return;

  const data = listings.map((rental) => {
    const percentOverCutoff = rental.percentOverCutoff != null
      ? `${rental.percentOverCutoff.toFixed(2)}%`
      : "";

      const percentOverFMR =
      rental.percentOverCutoff != null && !rental.hasHistory
        ? `${(160 + rental.percentOverCutoff).toFixed(2)}%`
        : "";  // 

    return {
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
      PercentOverCutoff: percentOverCutoff,
      PercentOverFMR: percentOverFMR,
      IsGouging: rental.isGouging ? "Yes" : "No",
      RentCategory: rental.rentCategory,
      LastSeen: rental.lastSeenDate,
      History: flattenHistory(rental.history),

      // Agent info
      AgentName: rental.listingAgent?.name ?? "",
      AgentPhone: rental.listingAgent?.phone ?? "",
      AgentEmail: rental.listingAgent?.email ?? "",
      AgentWebsite: rental.listingAgent?.website ?? "",

      // Office info
      OfficeName: rental.listingOffice?.name ?? "",
      OfficePhone: rental.listingOffice?.phone ?? "",

      // Optional extras
      Latitude: rental.latitude,
      Longitude: rental.longitude,
      Source: rental.source,
      FormattedPrice: rental.formattedPrice,
      PropertyType: rental.propertyType,
    };
  });

  const csv = unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
