import { useState,useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";



export default function SearchBar({ onSearch, isLoaded }: { onSearch: (query: string) => void; isLoaded: boolean }) {
    const [query, setQuery] = useState("");
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceSelect = () => {
        if (!autocompleteRef.current) return; //  Ensure Autocomplete is loaded before getting place
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
            setQuery(place.formatted_address);
            onSearch(place.formatted_address); //  Send selected address to RentCast
        }
    };


    const handleSubmit = (e: React.FormEvent ) => {
        e.preventDefault(); 
        if (!query.trim()) {
             alert("Enter a valid ZIP code or address.") // if only whitespace
             return;
        } 
        onSearch(query.trim());
    };

    // if (!isLoaded) return <p>Loading search...</p>;


    return (
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>

            {/* Google Places Autocomplete Input Field */}
            <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceSelect}>
                <input
                type="search"
                id="default-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-96 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter address or ZIP code"
                required
                />
            </Autocomplete>

        
    
            {/* Search Button */}
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Search
            </button>
          </div>
        </form>
      );
    }
    



/* 
  ===========================
  SEARCHBAR COMPONENT 
  ===========================
 *** DEFINITION: function prop**** 
 *** PARENT COMPONENT *** 
    function App() {
        const handleSearch = (query: string) => {
            console.log("Search for:", query); //parent handles search 
        };
        return <SearchBar onSearch={handleSearch}/>     
    }
*** CHILD COMPONENT *** 
    export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
        const [query, setQuery] = useState("");

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSearch(query); // Calls the parent function
        };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit">Search</button>
        </form>
     );
    }  


  - `export default function SearchBar`  
    Creates a React component that can be imported in other files.
    `export default` allows this component to be used elsewhere.

  - `({ onSearch }: { onSearch: (query: string) => void })`  
    - `onSearch` is a **function prop**  passed from the parent.  
    - It **takes a string** (`query`) and **returns nothing (`void`)**.  
    - Similar to `onAction: (message: string) => void` in a generic example.

  - State:
    `const [query, setQuery] = useState("")`  
    - `query`: Stores the user's input (ZIP code or address).
    - `setQuery`: Updates `query` when the user types.
    
- handleSubmit(e) : Handles form submission.
    - Prevents default page reload with `e.preventDefault()`.
    - Calls `onSearch(query)` to pass input to parent component.
  */



    
