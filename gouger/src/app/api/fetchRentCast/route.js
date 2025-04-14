import { NextResponse } from "next/server";
import localRentals from "../../../../data/rentals.json";

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

console.log("RENTCAST_API_KEY from process.env:", RENTCAST_API_KEY || "Not Found");

if (!RENTCAST_API_KEY) {
  throw new Error("Missing RentCast API Key. Check your .env.local file.");
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

  // DEVELOPMENT MODE: Filter local JSON data based on query
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: filtering local rentals data");

    let params = {};
    const parts = query.replace(", USA", "").trim().split(",").map((part) => part.trim());

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
      console.warn("Query format did not match expected cases, using raw query for filtering");
      params = { city: query };
    }

    const filteredRentals = localRentals.filter((rental) => {
      let match = true;

      if (params.zipCode) {
        match = match && rental.zipCode && rental.zipCode.toString().includes(params.zipCode);
      } else {
        if (params.city) {
          match = match && rental.city && rental.city.toLowerCase().includes(params.city.toLowerCase());
        }
      }

      if (params.state) {
        match = match && rental.state && rental.state.toLowerCase().includes(params.state.toLowerCase());
      }

      if (params.address) {
        match = match && rental.address && rental.address.toLowerCase().includes(params.address.toLowerCase());
      }

      return match;
    });

    return NextResponse.json(filteredRentals.slice(0, Number(limit)));
  }

  // PRODUCTION MODE (leave this unchanged or remove if unused)
  try {
    console.log("Using RentCast API Key:", RENTCAST_API_KEY);

    let params = { status: "Active", limit: limit.toString() };
    const parts = query.replace(", USA", "").trim().split(",").map((part) => part.trim());

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
          { error: "Invalid address format. Expected 'Street, City, State ZIP'." },
          { status: 400 }
        );
      }
    } else {
      console.warn("Query format did not match expected cases, sending raw to RentCast.");
      params = { city: query, ...params };
    }

    let requestUrl = `https://api.rentcast.io/v1/listings/rental/long-term?${new URLSearchParams(params).toString()}`;
    requestUrl = requestUrl.replace(/\+/g, "%20");

    console.log("RentCast Full Request URL:", requestUrl);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Api-Key": RENTCAST_API_KEY,
      },
    });

    const data = await response.json();

    console.log("RentCast API Raw Response:", data);

    if (!response.ok) {
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("RentCast API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}
