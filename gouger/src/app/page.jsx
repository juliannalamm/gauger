"use client"; // Ensures this runs only on the client side

import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../components/Map";

const libraries = ["places"];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries,
    version: "beta", // needed for <gmpx-place-autocomplete>
  });

  const handleSearch = async (query) => {
    console.log("Searching for:", query);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/fetchRentCast?query=${encodeURIComponent(query)}&limit=50`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rentals");
      }

      console.log("API Response Data:", data);
      setRentals(data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("📍 Listings received:", rentals.length);
    const gouging = rentals.filter((r) => r.isGouging);
    console.log("🚨 Gouging listings:", gouging);
  }, [rentals]);

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-white-100">
      <header className="absolute top-4 text-6xl font-bold text-red-500 z-10">
        Gouger
      </header>

      <div className="w-[800px] max-w-5xl mx-auto h-[400px] mb-10 mt-20">
        <MapComponent
          rentals={rentals}
          isLoaded={isLoaded}
          onSearch={handleSearch}
          loading={loading}
        />

      </div>


      {loading && <p className="mt-2">Loading...</p>}
    </div>
  );

}
