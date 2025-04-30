const fs = require("fs");

// Load the original file
const fmr = JSON.parse(fs.readFileSync("gouger/public/data/fmr.json", "utf-8"));

// Keep only entries with a valid ZIP code and 1BR rent
const trimmed = fmr.filter(entry => {
  return (
    entry.zip_code &&
    typeof entry.zip_code === "string" &&
    entry.zip_code.trim() !== "" &&
    entry.SAFMR_1BR &&
    entry.SAFMR_1BR.trim() !== ""
  );
});

console.log(`Original entries: ${fmr.length}`);
console.log(`Trimmed entries: ${trimmed.length}`);

fs.writeFileSync("fmr_trimmed.json", JSON.stringify(trimmed, null, 2));
console.log("✅ Saved: fmr_trimmed.json");
