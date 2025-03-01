"use client"; // Ensures this runs only on the client side

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { useLoadScript, Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"]; 


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState<any[]>([]); // Store fetched rental listings

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });

  const handleSearch = async (query: string) => {
    console.log(" Searching for:", query);
    setLoading(true);

    try {
      // Call Next.js API route and directly fetch rentals
      const response = await fetch(`/api/fetchRentCast?query=${encodeURIComponent(query)}&limit=50`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || " Failed to fetch rentals");
      }

      console.log(" API Response Data:", data);
      setRentals(data); // Store fetched rental listings in state

    } catch (error) {
      console.error(" Error fetching rentals:", error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;


  /// UI 
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-white-100">
      <header className="absolute top-4 text-6xl font-bold text-red-500">
        Gouger
      </header>

      <SearchBar onSearch={handleSearch} isLoaded={isLoaded} />

      {loading && <p>Loading...</p>}


      {rentals.length > 0 ? (
        <ul>
          {rentals.map((rental, index) => (
            <li key={index} className="text-gray-900 p-2">
              {rental.formattedAddress} - 💰 ${rental.price}/month
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No listings found.</p>
      )}
    </div>
  );
}
