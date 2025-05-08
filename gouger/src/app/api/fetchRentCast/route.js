import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// ENV vars
// ------------------------------------------------------------------
const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_RENTALS === "true";
const rentalsUrl = process.env.RENTALS_JSON_URL;
const fmrUrl = process.env.FMR_JSON_URL;
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

if (!RENTCAST_API_KEY) {
  console.warn("RENTCAST_API_KEY is not set. Live RentCast API mode may fail.");
}

// ------------------------------------------------------------------
// Utility: base‑rent / gouging calculation (unchanged)
// ------------------------------------------------------------------
function getBaseRent(listing, fmrData) {
  const zip = listing.zipCode?.toString();
  const bedrooms = listing.bedrooms || 1;
  const price = listing.price;
  const now = new Date();

  const fmr = fmrData.find((e) => e.zip_code === zip);
  const fmrKey = `SAFMR_${bedrooms}BR`;
  const fmrRaw = fmr?.[fmrKey]?.replace(/[$,]/g, "");
  const fmrValue = fmrRaw ? Number(fmrRaw) : null;
  const fmrGougingCutoff = fmrValue ? fmrValue * 1.6 : null;

  let previousPrice = null;
  let percentIncrease = null;
  let isPercentGouging = false;
  let hasHistory = false;
  let percentOverCutoff = null;

  if (listing.history && typeof listing.history === "object") {
    const sorted = Object.entries(listing.history)
      .map(([date, data]) => ({ date, ...data }))
      .filter((d) => typeof d.price === "number")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length > 1) {
      hasHistory = true;
      previousPrice = sorted[1].price;

      const date = new Date(sorted[1].date);
      const diffMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      if (diffMonths <= 12) {
        percentIncrease = ((price - previousPrice) / previousPrice) * 100;
        isPercentGouging = percentIncrease > 10;
      }
    }
  }

  if (hasHistory && previousPrice) {
    const cutoff = previousPrice * 1.1;
    percentOverCutoff = ((price - cutoff) / cutoff) * 100;
  } else if (!hasHistory && fmrGougingCutoff) {
    percentOverCutoff = ((price - fmrGougingCutoff) / fmrGougingCutoff) * 100;
  }

  const isFMRGouging =
    !hasHistory && fmrGougingCutoff && price > fmrGougingCutoff;
  const isGouging = isFMRGouging || isPercentGouging;

  return {
    fmrValue,
    fmrGougingCutoff,
    baseRent: hasHistory ? previousPrice : fmrValue,
    rentCategory: hasHistory ? "history" : "fmr-default",
    previousPrice,
    hasHistory,
    percentIncrease,
    percentOverCutoff,
    isGouging,
  };
}

// ------------------------------------------------------------------
// Utility: robust address → RentCast params
// ------------------------------------------------------------------
function startsWithDigit(str = "") {
  return /^\d/.test(str);
}

function parseQuery(query) {
  // a) trim trailing ", USA"
  const cleaned = query.replace(/,\s*USA$/i, "").trim();

  // b) split on commas, trim, drop empties
  const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return {};

  // c) LAST chunk  = "CA" or "CA 90210"
  const [state, zipCode] = parts.pop().split(/\s+/);
  const params = { state };
  if (zipCode) params.zipCode = zipCode;

  // d) SECOND‑LAST chunk  (if present)
  if (parts.length) {
    let candidate = parts.pop();       // ← potential city _or_ address

    if (startsWithDigit(candidate)) {
      // Looks like street address, so city must be the previous chunk
      params.address = candidate;
      if (parts.length) params.city = parts.pop();
    } else {
      // candidate has no digits → could be city or neighbourhood
      if (parts.length && !startsWithDigit(parts[parts.length - 1])) {
        // Two adjoining “no‑digit” chunks → treat *first* as city
        params.city = candidate;               // Pacific Palisades
        // drop the other chunk (“Los Angeles”) – it confuses RentCast
      } else {
        // Normal case: candidate is city
        params.city = candidate;
        // Anything left is street address (only keep if numeric)
        if (parts.length && startsWithDigit(parts[parts.length - 1])) {
          params.address = parts.join(", ");
        }
      }
    }
  }

  // e) Fallback: user typed only “Los Angeles”
  if (!params.city && !params.state) params.city = cleaned;

  return params;
}
// ------------------------------------------------------------------
// GET handler
// ------------------------------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = searchParams.get("limit") || "50";

  if (!query) {
    return NextResponse.json(
      { error: "A ZIP code or address is required" },
      { status: 400 }
    );
  }

  const params = parseQuery(query);
  console.log("query → params", query, params);


  // --------------------------------------------------------------
  // LOCAL MODE: use pre‑scraped JSON from S3
  // --------------------------------------------------------------
  if (useLocal) {
    console.log("Using local S3 rentals + FMR JSON");

    const [rentalsRes, fmrRes] = await Promise.all([
      fetch(rentalsUrl),
      fetch(fmrUrl),
    ]);

    if (!rentalsRes.ok || !fmrRes.ok) {
      return NextResponse.json(
        { error: "Failed to load S3-hosted rentals or FMR data" },
        { status: 500 }
      );
    }

    const localRentals = await rentalsRes.json();
    const fmrData = await fmrRes.json();

    const filtered = localRentals.filter((rental) => {
      let ok = true;
      if (params.zipCode) ok &&= rental.zipCode?.toString().includes(params.zipCode);
      else if (params.city) ok &&= rental.city?.toLowerCase().includes(params.city.toLowerCase());
      if (params.state) ok &&= rental.state?.toLowerCase().includes(params.state.toLowerCase());
      if (params.address) ok &&= rental.address?.toLowerCase().includes(params.address.toLowerCase());
      return ok;
    });

    const rentalsWithBase = filtered
      .slice(0, Number(limit))
      .map((r) => ({ ...r, ...getBaseRent(r, fmrData) }));

    return NextResponse.json(rentalsWithBase);
  }

  // --------------------------------------------------------------
  // PRODUCTION MODE: RentCast + S3 FMR
  // --------------------------------------------------------------
  try {
    console.log("Using RentCast API");

    const cleanParams = Object.fromEntries(
      Object.entries({
        status: "Active",
        limit: limit.toString(),
        ...params,
      }).filter(([, v]) => v != null && v !== "")
    );

    const requestUrl =
      "https://api.rentcast.io/v1/listings/rental/long-term?" +
      new URLSearchParams(cleanParams).toString();

    const [rentalsRes, fmrRes] = await Promise.all([
      fetch(requestUrl, {
        headers: {
          Accept: "application/json",
          "X-Api-Key": RENTCAST_API_KEY,
        },
      }),
      fetch(fmrUrl),
    ]);

    const data = await rentalsRes.json();
    const fmrData = await fmrRes.json();

    if (!rentalsRes.ok) {
      throw new Error(`RentCast API Error: ${JSON.stringify(data)}`);
    }

    const rentalsWithBase = data.map((r) => ({
      ...r,
      ...getBaseRent(r, fmrData),
    }));

    return NextResponse.json(rentalsWithBase);
  } catch (err) {
    console.error("RentCast API Error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}
