export default function AboutPage() {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 space-y-6">
        <h1 className="text-3xl font-bold mb-4">About This App</h1>
  
        <p>
          This tool helps identify potential rent gouging during states of emergency by analyzing active rental listings in relation to historical rent data and government-defined Fair Market Rent (FMR) values.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">What is Rent Gouging?</h2>
        <p>
          Rent gouging refers to situations where landlords dramatically raise rental prices beyond reasonable thresholds — often in response to demand surges caused by natural disasters, housing shortages, or emergencies. Many states define gouging as exceeding a certain percentage above a baseline rent (such as the prior rent paid, or the FMR).
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">How Gouging Is Calculated</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>If the listing has prior rental history</strong>: We check if the price has increased more than <strong>10%</strong> over the most recent rental price in the past 12 months.
          </li>
          <li>
            <strong>If there is no recent history</strong>: We use HUD’s Small Area Fair Market Rent (SAFMR) for the ZIP code and bedroom count. A listing is flagged if its price is more than <strong>160% of the FMR</strong>.
          </li>
        </ul>
  
        <h2 className="text-2xl font-semibold mt-8">Understanding the Export</h2>
        <p>
          You can export the data as a CSV using the buttons on the homepage. There are two export options:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Export Listings:</strong> Downloads all rental data currently shown on the map.</li>
          <li><strong>Export Gouging Only:</strong> Downloads only listings flagged as potentially gouging.</li>
        </ul>
  
        <p>
          The exported CSV includes detailed fields such as price, FMR, gouging threshold, previous rent (if available), agent and office contact information, and a flattened rental price history.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">Percent Over FMR</h2>
        <p>
          For listings with no rent history, we also include a column called <strong>Percent Over FMR</strong>. This is calculated by adding <strong>160%</strong> (the gouging threshold) to the percent by which the listing exceeds that threshold. For example, if a listing is 12.5% over the gouging threshold, its total percentage over FMR would be <strong>172.5%</strong>.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8">Why This Matters</h2>
        <p>
          By making rental pricing data transparent and structured, this app helps renters, journalists, and policymakers detect potential exploitation in the housing market — especially during vulnerable times.
        </p>
      </div>
    );
  }
  