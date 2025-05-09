"use client"; // Ensures this runs only on the client side

import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../components/Map";
import ExportButton from "../components/exportbutton";

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
    <div className="min-h-screen flex flex-col items-center bg-black-100 py-10 px-4">
      <header className="text-6xl font-bold text-red-500 mb-6">Gouger</header>

      {/* MAP */}
      <div className="w-full sm:w-[800px] max-w-5xl mx-auto h-[72vh] sm:h-[500px] overflow-hidden rounded-lg mb-4">
        <MapComponent
          rentals={rentals}
          isLoaded={isLoaded}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

      {/* EXPORT BUTTON OUTSIDE THE CLIPPED BOX */}
      {rentals.length > 0 && (
        <div className="mb-10">
          <ExportButton rentals={rentals} filename="rentals.csv" />
        </div>
      )}

      {/* LOADING TEXT */}
      {loading && <p className="mt-2 text-black text-sm italic">Loading...</p>}
    </div>
  );
}
