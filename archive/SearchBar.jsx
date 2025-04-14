"use client";
import { useEffect } from "react";

export default function SearchBar({ onSearch, isLoaded }) {
  useEffect(() => {
    const handler = (event) => {
      const place = event.detail?.place;
      if (place?.formattedAddress) {
        onSearch(place.formattedAddress);
      }
    };

    const el = document.querySelector("gmpx-place-autocomplete");
    if (el) {
      el.addEventListener("gmpx-place-select", handler);
    }

    return () => {
      if (el) {
        el.removeEventListener("gmpx-place-select", handler);
      }
    };
  }, [isLoaded, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("autocomplete-input");
    if (!input || !input.value.trim()) {
      alert("Enter a valid ZIP code or address.");
      return;
    }
    onSearch(input.value.trim());
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <label
        htmlFor="autocomplete-input"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>

      <div className="relative">
        {/* Icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
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

        {/* New Web Component */}
        <gmpx-place-autocomplete
          input-id="autocomplete-input"
          place-selection-mode="autocomplete"
          class="w-full"
        ></gmpx-place-autocomplete>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 z-20 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>

        {/* Style override */}
        <style>
          {`
            gmpx-place-autocomplete::part(input) {
              width: 100%;
              padding: 0.75rem 2.5rem 0.75rem 2.5rem;
              font-size: 0.875rem;
              color: #111827;
              background-color: #f9fafb;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              outline: none;
            }
            gmpx-place-autocomplete::part(input):focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 1px #3b82f6;
            }

            html.dark gmpx-place-autocomplete::part(input) {
              background-color: #374151;
              color: white;
              border-color: #4b5563;
            }
          `}
        </style>
      </div>
    </form>
  );
}
