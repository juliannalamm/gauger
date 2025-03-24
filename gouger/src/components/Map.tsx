"use client";

import React, { useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Rental {
  formattedAddress: string;
  price: number;
  latitude: number | string;
  longitude: number | string;
}

interface MapProps {
  rentals: Rental[];
  center?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapProps> = ({ rentals, center }) => {
  // If rentals available, use first rental's coordinates as center.
  const defaultCenter =
    center ||
    (rentals.length > 0
      ? { lat: Number(rentals[0].latitude), lng: Number(rentals[0].longitude) }
      : { lat: 34.052235, lng: -118.243683 });

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
          />
        );
      })}
      {/* Uncomment for testing: */}
      {/* <Marker position={{ lat: 34.052235, lng: -118.243683 }} title="Test Marker" /> */}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);