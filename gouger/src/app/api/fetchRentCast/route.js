import { NextResponse } from "next/server";

// ENV vars
const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_RENTALS === "true";
const rentalsUrl = process.env.RENTALS_JSON_URL;
const fmrUrl = process.env.FMR_JSON_URL;
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

if (!RENTCAST_API_KEY) {
  console.warn("RENTCAST_API_KEY is not set. Live RentCast API mode may fail.");
}

// -------------------------
// Shared function
// -------------------------
function getBaseRent(listing, fmrData) {
  const zip = listing.zipCode?.toString();
  const bedrooms = listing.bedrooms || 1;
  const price = listing.price;
  const now = new Date();

  const fmr = fmrData.find((entry) => entry.zip_code === zip);
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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = searchParams.get("limit") || "50";

  if (!query) {
    return NextResponse.json({ error: "A ZIP code or address is required" }, { status: 400 });
  }

  const parts = query.replace(", USA", "").trim().split(",").map(p => p.trim());
  let params = {};

  if (parts.length === 2) {
    const [city, stateZip] = parts;
    const [state, zipCode] = stateZip.split(" ");
    if (state && zipCode) {
      params = { city, state, zipCode };
    }
  } else if (parts.length === 3) {
    const [address, city, stateZip] = parts;
    const [state, zipCode] = stateZip.split(" ");
    if (state && zipCode) {
      params = { address, city, state, zipCode };
    }
  } else {
    params = { city: query };
  }

  // -------------------------------
  // LOCAL MODE: fetch from S3
  // -------------------------------
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

    const filteredRentals = localRentals.filter((rental) => {
      let match = true;
      if (params.zipCode) {
        match &&= rental.zipCode?.toString().includes(params.zipCode);
      } else if (params.city) {
        match &&= rental.city?.toLowerCase().includes(params.city.toLowerCase());
      }
      if (params.state) {
        match &&= rental.state?.toLowerCase().includes(params.state.toLowerCase());
      }
      if (params.address) {
        match &&= rental.address?.toLowerCase().includes(params.address.toLowerCase());
      }
      return match;
    });

    const rentalsWithBase = filteredRentals
      .slice(0, Number(limit))
      .map((rental) => ({
        ...rental,
        ...getBaseRent(rental, fmrData),
      }));

    return NextResponse.json(rentalsWithBase);
  }

  // -------------------------------
  // PRODUCTION MODE: RentCast + S3 FMR
  // -------------------------------
  try {
    console.log("Using RentCast API");

    const apiParams = {
      status: "Active",
      limit: limit.toString(),
      ...params,
    };

    const requestUrl = `https://api.rentcast.io/v1/listings/rental/long-term?${new URLSearchParams(apiParams).toString()}`.replace(/\+/g, "%20");

    const [rentalsRes, fmrRes] = await Promise.all([
      fetch(requestUrl, {
        method: "GET",
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

    const rentalsWithBase = data.map((rental) => ({
      ...rental,
      ...getBaseRent(rental, fmrData),
    }));

    return NextResponse.json(rentalsWithBase);
  } catch (error) {
    console.error("RentCast API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}
