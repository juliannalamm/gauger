import fs from "fs";
import path from "path"; 
import { fetchRentals } from "../app/api/fetchRentCast"; // Adjust the path

const ZIPCODE = "90210"; // Change this as needed

async function saveRentalData() {
  try {
    const data = await fetchRentals(ZIPCODE,50);

    // Define the path to store the file
    const filePath = path.join(__dirname, "../src/data/rentals.json");

    // Save the response to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Data saved to src/data/rentals.json");
  } catch (error) {
    console.error("Error saving rental data:", error);
  }
}

saveRentalData();
