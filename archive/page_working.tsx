// to run npm run dev make sure you are in Desktop/gauger/gouger


"use client"; // Required for interactive components in Next.js 13+

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import {fetchRentals} from "./api/fetchRentCast";
import { useLoadScript } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"]; // Load Places API

// This is the parent component
export default function Home() {
  const[loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(""); // Store the generated API URL

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });



  const handleSearch = async (query : string) => {
    console.log("clicked")
    console.log ("Searched for:", query);
    setLoading(true);
   

   try { 
    const url = await fetchRentals(query); // ✅ Get the generated API URL instead of making a request
    console.log("🚀 Generated API URL:", url);
    setApiUrl(url); // ✅ Store the URL in state to display it

  } catch (error) {
    console.error("error generating url:", error);
   } finally { 
    setLoading(false); 
   }
  };
   
  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-white-100">
    <header className="absolute top-4 text-6xl font-bold text-red-500">
      Gouger
    </header>
    
    <SearchBar onSearch={handleSearch} isLoaded={isLoaded} />
    {loading && <p>Loading... </p>}
    {apiUrl && (
        <p>Generated API URL: <a href={apiUrl} target="_blank">{apiUrl}</a></p> // ✅ Display the generated API URL
      )}
  </div>
  );

}

  

