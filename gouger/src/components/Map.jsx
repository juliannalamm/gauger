"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from "../lib/markerIcon";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ rentals, center }) => {
  const defaultCenter =
    center ||
    (rentals.length > 0
      ? { lat: Number(rentals[0].latitude), lng: Number(rentals[0].longitude) }
      : { lat: 34.052235, lng: -118.243683 });

  const [selectedRental, setSelectedRental] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
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
            <p className="mt-1">${selectedRental.price}/mo</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default React.memo(MapComponent);
