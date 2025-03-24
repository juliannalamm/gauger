"use client";

import React, {useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from "../lib/markerIcon"; // adjust the path if needed


const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Rental {
  formattedAddress: string;
  price: number;
  latitude: number | string;
  longitude: number | string;
  //TODO: Add more fields like bed/bath, squareFoot etc.
}

interface MapProps {
  rentals: Rental[];
  center?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapProps> = ({ rentals, center }) => {
  // If rentals available, use first rental's coordinates as center. this allows us to see the markers
  const defaultCenter =
    center ||
    (rentals.length > 0
      ? { lat: Number(rentals[0].latitude), lng: Number(rentals[0].longitude) }
      : { lat: 34.052235, lng: -118.243683 });
  
  // State for tracking which rental (if any) is selected (clicked)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries: ["places"],
  });

  useEffect(() => {
    console.log("Rentals in MapComponent:", rentals);
  }, [rentals]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
      {rentals.map((rental, index) => {
        const lat = Number(rental.latitude);
        const lng = Number(rental.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          console.warn("Invalid coordinates for rental:", rental);
          return null;
        }
        return (
          <Marker
            key={index}
            position={{ lat, lng }}
            title={rental.formattedAddress}
            icon={getMarkerIcon(Number(rental.price))}
            onClick={() => setSelectedRental(rental)}
          />
        );
      })}

      {/* Only render InfoWindow if a rental is selected */}
      {selectedRental && (
        <InfoWindow
          position={{
            lat: Number(selectedRental.latitude),
            lng: Number(selectedRental.longitude),
          }}
          onCloseClick={() => setSelectedRental(null)}
        >
          <div className="text-black p-2 rounded-md max-w-xs">
            <h2 className="m-0 font-bold">{selectedRental.formattedAddress}</h2>
            <p className="mt-1">
              ${selectedRental.price}/mo
              </p>
              </div>
        </InfoWindow>
      )}


      {/* TESTING */}
      {/* <Marker position={{ lat: 34.052235, lng: -118.243683 }} title="Test Marker" /> */}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);