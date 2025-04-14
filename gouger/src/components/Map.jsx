"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from "../lib/markerIcon";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LOS_ANGELES = { lat: 34.052235, lng: -118.243683 };

const MapComponent = ({ rentals, isLoaded, onSearch }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [selectedRental, setSelectedRental] = useState(null);
  const [mapCenter, setMapCenter] = useState(LOS_ANGELES);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (
      isLoaded &&
      window.google &&
      inputRef.current &&
      !autocompleteRef.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["formatted_address", "geometry"],
          types: ["geocode"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onSearch(place.formatted_address);
          setHasSearched(true);
        }

        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMapCenter({ lat, lng });
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Map */}
      <div className="w-full max-w-5xl">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
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

      {/* Search input below map */}
      <div className="mt-4 w-[32rem] relative">
        <input
          ref={inputRef}
          type="text"
          id="autocomplete-input"
          placeholder="Enter address or ZIP code"
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg shadow bg-white focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>

      {/* No rentals message */}
      {hasSearched && rentals.length === 0 && (
        <p className="mt-4 text-gray-500 text-sm italic">
          No rentals found for this location.
        </p>
      )}
    </div>
  );
};

export default React.memo(MapComponent);
