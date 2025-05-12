"use client";

import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../components/Map";
import ExportButton from "../components/exportbutton";
import TitleBanner from "../components/TitleBanner";
import Navbar from "../components/NavBar"; // adjust path if needed


const libraries = ["places"];

export default function Home() {


  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries,
    version: "beta",
  });

  const handleSearch = async (query) => {
    console.log("Searching for:", query);
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/fetchRentCast?query=${encodeURIComponent(query)}&limit=50`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rentals");
      }

      setRentals(data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Default fetch for Los Angeles
    handleSearch("Los Angeles, CA");
  }, []);

  useEffect(() => {
    console.log("📍 Listings received:", rentals.length);
    const gouging = rentals.filter((r) => r.isGouging);
    console.log("🚨 Gouging listings:", gouging);
  }, [rentals]);

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center">
        <Navbar />
      <TitleBanner />

      <div className="w-screen mt-20 -mx-4 sm:mx-auto sm:w-[800px] max-w-5xl h-[72vh] sm:h-[500px] overflow-hidden rounded-lg sm:rounded-lg">
        <MapComponent
          rentals={rentals}
          isLoaded={isLoaded}
          onSearch={handleSearch}
          loading={loading}
          hasSearched={hasSearched}
        />
      </div>

      {rentals.length > 0 && (
       <div className="flex gap-4 mb-10">
       <ExportButton rentals={rentals} filename="rentals.csv" variant="all" />
       <ExportButton rentals={rentals} filename="rentals.csv" variant="gouging" />
     </div>
      )}

      {loading && <p className="mt-3 text-black text-sm italic">Loading...</p>}
    </div>
  );
}
