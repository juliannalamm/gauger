"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from "../lib/markerIcon";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ rentals, center, isLoaded, onSearch }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [selectedRental, setSelectedRental] = useState(null);

  const defaultCenter =
    center ||
    (rentals.length > 0
      ? { lat: Number(rentals[0].latitude), lng: Number(rentals[0].longitude) }
      : { lat: 34.052235, lng: -118.243683 });

  useEffect(() => {
    if (isLoaded && window.google && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address"],
        types: ["geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onSearch(place.formatted_address);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative">
      {/* Search input overlaid on map */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter address or ZIP code"
        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-[32rem] p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg shadow bg-white focus:ring-blue-500 focus:border-blue-500"
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={(map) => (mapRef.current = map)}
      >
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
    </div>
  );
};

export default React.memo(MapComponent);
