import axios from "axios";

const RENTCAST_API_KEY = "757bf9ec87c9492a8560db0ac506672a"; // Make sure this is correct
const url = "https://api.rentcast.io/v1/listings/rental/long-term?city=Beverly%20Hills&state=CA&zipCode=90210&status=Active&limit=50";

axios.get(url, {
   headers: {
      Accept: "application/json",
      "X-Api-Key": RENTCAST_API_KEY,  // Ensure correct casing
   },
})
.then(res => console.log("✅ RentCast Response:", res.data))
.catch(err => console.error("❌ RentCast API Error:", err.response?.data || err.message));
