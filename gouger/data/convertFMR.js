// convertFMR.js (run once)
import fs from "fs";
import csv from "csvtojson";

csv()
  .fromFile("FMR_LA.csv")
  .then((jsonObj) => {
    fs.writeFileSync("fmr.json", JSON.stringify(jsonObj, null, 2));
    console.log("FMR JSON saved to gouger/data/fmr.json");
  });
