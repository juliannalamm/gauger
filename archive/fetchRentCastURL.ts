import axios from "axios";


const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY; //  Server-side only

// if (!RENTCAST_API_KEY) {
//   throw new Error("Missing RentCast API Key. Check your .env.local file.");
// }

export async function fetchRentals(query: string, limit = 50) {
  if (!query) {
    throw new Error("A ZIP code or address is required");
  }

  query = query.replace(", USA", "").trim(); //google autofills with USA but rentcast does not take this as a parameter. remove it 


  let params: Record <string,string> = {
    status: "Active",
    limit: limit.toString(), // 
  };

  const parts = query.split(",").map((part) => part.trim()); // Split by commas


  if (parts.length === 2) {
    //  if google returns "City, State ZIP" (USA removed)
    const stateZipParts = parts[1].split(" ") // Split "CA 90272" → ["CA", "90272"]
    if (stateZipParts.length === 2) {
    params = {
      city: parts[0],
      state: parts[1],
      zipCode: parts[2],
      ...params,
    };

  } else {
    throw new Error("Invalid address format. Expected 'City, State ZIP'.");
  }
  // address
} else if (parts.length ===3) {
  const stateZipParts = parts[2].split(" ");
  if (stateZipParts.length == 2) {
    params = {
      address: parts[0],
      city: parts[1],
      state: stateZipParts[0],
      zipCode: stateZipParts[1],
      ... params, 

  };


    } else {
      throw new Error("Invalid address format. Expected 'City, State ZIP' or 'Street, City, State, ZIP'.");
    }
  } else {
    throw new Error("Invalid address format. Expected 'City, State ZIP' or 'Street, City, State ZIP'.");
  }


  ///TESTING URL GENERATION
  const baseUrl = "https://api.rentcast.io/v1/listings/rental/long-term"
  let paramString = new URLSearchParams(params).toString();
  paramString = paramString.replace(/\+/g, "%20"); //  Fix space encoding from + (string generated) to %20

  const fullUrl = `${baseUrl}?${paramString}`;


  //DEBUGGING
  console.log("🚀 Generated API URL:", fullUrl); // Log the generated URL

  const axiosUrl = axios.getUri({
    url: "https://api.rentcast.io/v1/listings/rental/long-term",
    params: params,
  });
  
  console.log("Axios-Generated URL:", axiosUrl); //  Axios' actual request URL

  return fullUrl; // Returning URL for now (comment this out later)
}


  

  
  
  // ===========================
  // API REQUEST - UNCOMMENT FOR DEPLOYMENT
  // ===========================
  // try {
  //   const response = await axios.get("https://api.rentcast.io/v1/listings/rental/long-term", {
  //     params: {
  //       city: isNaN(Number(query)) ? query : undefined, // If it's not a number, treat it as a city/address
  //       zipcode: isNaN(Number(query)) ? undefined : query, // If it's a number, treat it as a ZIP code
  //       status: "Active",
  //       limit: 5,
  //     },
  //     headers: {
  //       Accept: "application/json",
  //       "X-API-Key": RENTCAST_API_KEY,
  //     },
  //   });

  //   return response.data || []; // Return the API response
  // } catch (error: any) {
  //   console.error("Error fetching rentals:", error.response?.data || error.message);
  //   return []; // Return an empty array if the request fails
  // }
// }