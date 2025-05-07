"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getMarkerIcon } from "../lib/markerIcon";
import customMapStyle from "../lib/mapStyle"; // adjust the path if needed
import GougingSlider from "./GougingSlider"; // adjust path as needed

import {
  DollarSign,
  BarChart2,
  Home,
  AlertTriangle,
  ScrollText,
  TrendingUp,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LOS_ANGELES = { lat: 34.052235, lng: -118.243683 };

const mapOptions = {
  styles: customMapStyle,
  disableDefaultUI: true, // optional: removes all controls
  zoomControl: true,      // re-enable zoom if you want it
};

const MapComponent = ({ rentals, isLoaded, onSearch, loading }) => {
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
      <div className="w-full max-w-5xl">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          options={mapOptions}
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
                icon={getMarkerIcon(rental)}
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
              <div className="p-0 m-0">
                <div className="bg-white px-8 py-5 rounded-xl shadow-xl w-[270px] text-sm font-sans leading-snug space-y-3">

                  {/* Status message */}
                  <div className="text-center">
                    <p
                      className={`font-semibold inline-flex items-center gap-2 ${selectedRental.isGouging ? "text-red-600" : "text-green-600"}`}
                    >
                      {selectedRental.isGouging ? (
                        <>
                          <ShieldX className="w-4 h-4" />
                          Potential Rent Gouging
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Below 160% of FMR
                        </>
                      )}
                    </p>
                  </div>

                  {/* Slider */}
                  {selectedRental.fmrValue && selectedRental.price && (
                    <GougingSlider
                      fmr={selectedRental.fmrValue}
                      price={selectedRental.price}
                      hasHistory={selectedRental.hasHistory}
                      previousPrice={selectedRental.previousPrice}
                    />
                  )}

                  {/* Address */}
                  <h2 className="text-center text-[15px] font-semibold text-gray-800 leading-tight">
                    {selectedRental.formattedAddress.split(",")[0]}
                    <br />
                    <span className="text-sm font-normal text-gray-600">
                      {selectedRental.formattedAddress.split(",").slice(1).join(",")}
                    </span>
                  </h2>

                  {/* Price Details */}

                </div>
              </div>
            </InfoWindow>


          )}
        </GoogleMap>
      </div>

      <div className="mt-4 w-[32rem] relative">
        <input
          ref={inputRef}
          type="text"
          id="autocomplete-input"
          placeholder="Enter a Los Angeles ZIP code"
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

      {loading && (
        <p className="mt-4 text-gray-500 text-sm italic">Loading rentals...</p>
      )}

      {!loading && hasSearched && rentals.length === 0 && (
        <p className="mt-4 text-gray-500 text-sm italic">
          No rentals found for this location.
        </p>
      )}


    </div>
  );
};

export default React.memo(MapComponent);
