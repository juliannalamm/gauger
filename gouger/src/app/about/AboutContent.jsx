'use client';
import Image from "next/image";
import Link from "next/link";

export default function AboutContent() {
  const Section = ({ title, description, buttonText, href }) => (
    <section className="relative bg-zinc-900 text-left text-white px-6 py-12 sm:px-10 sm:py-16 space-y-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-white" />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="uppercase text-sm tracking-widest text-gray-400 font-semibold">
          We Are
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-orange-600">{title}</h2>
        <p className="text-lg leading-relaxed text-gray-200 max-w-3xl">
          {description}
        </p>
        {buttonText && href && (
          <div className="pt-4">
            <Link
              href={href}
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold tracking-wide py-3 px-6 rounded shadow"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="bg-black text-white">
      {/* Hero Block */}
      <section className="py-20 px-6 sm:px-10 text-center w-full max-w-4xl mx-auto space-y-6">
        <div className="uppercase text-sm tracking-widest text-gray-400 font-semibold">We Are</div>
        <div className="flex justify-center items-center gap-4">
          <Image src="/icon.svg" alt="Gouger Icon" width={48} height={48} />
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600">Pioneering</h1>
        </div>
        <p className="text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto">
          This tool identifies potential rent gouging during states of emergency by analyzing rental listings
          against historical rent data and HUD's Fair Market Rent benchmarks. We empower communities to detect
          price hikes and ensure housing access during crisis-driven displacement.
        </p>
        <div>
          <a
            href="#what-is"
            className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold tracking-wide py-3 px-6 rounded shadow"
          >
            View Our Process
          </a>
        </div>
      </section>

      {/* Styled Cards Below */}
      <div id="what-is" className="space-y-24">
        <Section
          title="Understanding Rent Gouging"
          description="Rent gouging refers to situations where landlords dramatically raise rental prices beyond reasonable thresholds — often in response to demand surges caused by natural disasters, housing shortages, or emergencies. Many states define gouging as exceeding a certain percentage above a baseline rent (such as the prior rent paid, or the FMR)."
          buttonText="See Examples"
          href="/report"
        />

        <Section
          title="How Gouging Is Calculated"
          description="If the listing has prior rental history, we check if the price has increased more than 10% over the most recent rental price in the past 12 months. If there's no recent history, we use HUD’s Small Area Fair Market Rent (SAFMR) for the ZIP code and bedroom count. A listing is flagged if its price exceeds 160% of the FMR."
        />

        <Section
          title="Exporting Data"
          description="You can export data as a CSV using the homepage buttons. Choose between exporting all listings or only those flagged for potential gouging. Each CSV includes rent, FMR, gouging threshold, agent contact info, and a flattened rental price history."
          buttonText="Try It Now"
          href="/"
        />

        <Section
          title="Percent Over FMR"
          description="For listings with no rent history, we include a column called Percent Over FMR. This is calculated by adding 160% (the gouging threshold) to the percent by which the listing exceeds that threshold. For example, if a listing is 12.5% over the gouging threshold, the total is 172.5%."
        />

        <Section
          title="Why This Matters"
          description="By making rental pricing data transparent and structured, this app helps renters, journalists, and policymakers detect potential exploitation in the housing market — especially during vulnerable times."
        />
      </div>
    </div>
  );
}
