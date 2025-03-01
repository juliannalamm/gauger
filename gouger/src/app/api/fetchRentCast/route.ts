import { NextResponse } from "next/server";

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

console.log("🔑 RENTCAST_API_KEY from process.env:", RENTCAST_API_KEY || "❌ Not Found");

if (!RENTCAST_API_KEY) {
  throw new Error("❌ Missing RentCast API Key. Check your .env.local file.");
}

export async function GET(req: Request) {
  try {
    console.log("🔑 Using RentCast API Key:", RENTCAST_API_KEY);

    // ✅ Extract search parameters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = searchParams.get("limit") || "50";

    if (!query) {
      return NextResponse.json({ error: "A ZIP code or address is required" }, { status: 400 });
    }

    // ✅ Parse query into address components
    let params: Record<string, string> = { status: "Active", limit: limit.toString() };
    const parts = query.replace(", USA", "").trim().split(",").map((part) => part.trim());

    if (parts.length === 2) {
      // 📌 "City, State ZIP"
      const stateZipParts = parts[1].split(" ");
      if (stateZipParts.length === 2) {
        params = { city: parts[0], state: stateZipParts[0], zipCode: stateZipParts[1], ...params };
      } else {
        return NextResponse.json({ error: "Invalid address format. Expected 'City, State ZIP'." }, { status: 400 });
      }
    } else if (parts.length === 3) {
      // 📌 "Street, City, State ZIP"
      const stateZipParts = parts[2].split(" ");
      if (stateZipParts.length === 2) {
        params = { address: parts[0], city: parts[1], state: stateZipParts[0], zipCode: stateZipParts[1], ...params };
      } else {
        return NextResponse.json({ error: "Invalid address format. Expected 'Street, City, State ZIP'." }, { status: 400 });
      }
    } else {
      console.warn("⚠️ Query format did not match expected cases, sending raw to RentCast.");
      params = { city: query, ...params }; // Allow RentCast to handle unknown formats
    }

    // ✅ Construct API request URL
    let requestUrl = `https://api.rentcast.io/v1/listings/rental/long-term?${new URLSearchParams(params).toString()}`;
    requestUrl = requestUrl.replace(/\+/g, "%20"); // Fix space encoding issue

    console.log("🌍 RentCast Full Request URL:", requestUrl);

    // ✅ Make API request immediately
    console.log("📢 Sending Fetch Request...");
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Api-Key": RENTCAST_API_KEY as string,
      },
    });

    const data = await response.json();

    // ✅ Log the actual response from RentCast
    console.log("✅ RentCast API Raw Response:", data);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ RentCast API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
  }
}
