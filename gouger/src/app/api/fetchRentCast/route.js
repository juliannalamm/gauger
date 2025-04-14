import { NextResponse } from "next/server";
import localRentals from "../../../../data/rentals.json";
import fmrData from "../../../../data/fmr.json";

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

console.log("RENTCAST_API_KEY from process.env:", RENTCAST_API_KEY || "Not Found");

if (!RENTCAST_API_KEY) {
  throw new Error("Missing RentCast API Key. Check your .env.local file.");
}

// -------------------
// Base rent + gouging logic
// -------------------
function getBaseRent(listing) {
  const zip = listing.zipCode?.toString();
  const bedrooms = listing.bedrooms || 1;
  const price = listing.price;
  const now = new Date();
  const lastSeen = listing.lastSeenDate ? new Date(listing.lastSeenDate) : null;

  const fmr = fmrData.find((entry) => entry.zip_code === zip);
  const fmrKey = `SAFMR_${bedrooms}BR`;
  const fmrRaw = fmr?.[fmrKey]?.replace(/[$,]/g, "");
  const fmrValue = fmrRaw ? Number(fmrRaw) : null;
  const fmrGougingCutoff = fmrValue ? fmrValue * 1.6 : null;

  // Determine previous price
  let previousPrice = null;
  let percentIncrease = null;
  let isPercentGouging = false;
  let hasHistory = false;

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
    isGouging,
  };
}

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

  // -------------------------------
  // DEVELOPMENT MODE
  // -------------------------------
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: filtering local rentals data");

    let params = {};
    const parts = query
      .replace(", USA", "")
      .trim()
      .split(",")
      .map((part) => part.trim());

    if (parts.length === 2) {
      const stateZipParts = parts[1].split(" ");
      if (stateZipParts.length === 2) {
        params = {
          city: parts[0],
          state: stateZipParts[0],
          zipCode: stateZipParts[1],
        };
      }
    } else if (parts.length === 3) {
      const stateZipParts = parts[2].split(" ");
      if (stateZipParts.length === 2) {
        params = {
          address: parts[0],
          city: parts[1],
          state: stateZipParts[0],
          zipCode: stateZipParts[1],
        };
      }
    } else {
      console.warn(
        "Query format did not match expected cases, using raw query for filtering"
      );
      params = { city: query };
    }

    const filteredRentals = localRentals.filter((rental) => {
      let match = true;

      if (params.zipCode) {
        match =
          match &&
          rental.zipCode &&
          rental.zipCode.toString().includes(params.zipCode);
      } else {
        if (params.city) {
          match =
            match &&
            rental.city &&
            rental.city.toLowerCase().includes(params.city.toLowerCase());
        }
      }

      if (params.state) {
        match =
          match &&
          rental.state &&
          rental.state.toLowerCase().includes(params.state.toLowerCase());
      }

      if (params.address) {
        match =
          match &&
          rental.address &&
          rental.address.toLowerCase().includes(params.address.toLowerCase());
      }

      return match;
    });

    const rentalsWithBase = filteredRentals
      .slice(0, Number(limit))
      .map((rental) => {
        const {
          fmrValue, // <- ADDED
          fmrGougingCutoff, // <- ADDED
          baseRent,
          rentCategory,
          previousPrice,
          percentIncrease,
          isGouging,
        } = getBaseRent(rental);

        return {
          ...rental,
          fmrValue, // <- ADDED
          fmrGougingCutoff, // <- ADDED
          baseRent,
          rentCategory,
          previousPrice,
          percentIncrease,
          isGouging,
        };
      });

    return NextResponse.json(rentalsWithBase);
  }

  // -------------------------------
  // PRODUCTION MODE
  // -------------------------------
  try {
    console.log("Using RentCast API Key:", RENTCAST_API_KEY);

    let params = { status: "Active", limit: limit.toString() };
    const parts = query
      .replace(", USA", "")
      .trim()
      .split(",")
      .map((part) => part.trim());

    if (parts.length === 2) {
      const stateZipParts = parts[1].split(" ");
      if (stateZipParts.length === 2) {
        params = {
          city: parts[0],
          state: stateZipParts[0],
          zipCode: stateZipParts[1],
          ...params,
        };
      } else {
        return NextResponse.json(
          { error: "Invalid address format. Expected 'City, State ZIP'." },
          { status: 400 }
        );
      }
    } else if (parts.length === 3) {
      const stateZipParts = parts[2].split(" ");
      if (stateZipParts.length === 2) {
        params = {
          address: parts[0],
          city: parts[1],
          state: stateZipParts[0],
          zipCode: stateZipParts[1],
          ...params,
        };
      } else {
        return NextResponse.json(
          {
            error: "Invalid address format. Expected 'Street, City, State ZIP'.",
          },
          { status: 400 }
        );
      }
    } else {
      console.warn("Query format did not match expected cases, sending raw to RentCast.");
      params = { city: query, ...params };
    }

    const requestUrl = `https://api.rentcast.io/v1/listings/rental/long-term?${new URLSearchParams(
      params
    ).toString()}`.replace(/\+/g, "%20");
    console.log("RentCast Full Request URL:", requestUrl);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Api-Key": RENTCAST_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    const rentalsWithBase = data.map((rental) => {
      const {
        fmrValue, // <- ADDED
        fmrGougingCutoff, // <- ADDED
        baseRent,
        rentCategory,
        previousPrice,
        percentIncrease,
        isGouging,
      } = getBaseRent(rental);

      return {
        ...rental,
        fmrValue, // <- ADDED
        fmrGougingCutoff, // <- ADDED
        baseRent,
        rentCategory,
        previousPrice,
        percentIncrease,
        isGouging,
      };
    });

    return NextResponse.json(rentalsWithBase);
  } catch (error) {
    console.error("RentCast API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}
