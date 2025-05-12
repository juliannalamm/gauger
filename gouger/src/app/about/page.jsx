'use client';

import Image from "next/image";
import Navbar from "../../components/NavBar"; // Adjust path if needed
import { MapPin, DollarSign, AlertTriangle, FileText } from "lucide-react";

// Section component supporting alternating backgrounds and JSX content
const Section = ({ id, title, description, buttonText, href, isAlt }) => (
  <section
    id={id}
    className={`relative scroll-mt-24 ${
      isAlt ? "bg-black text-white" : "bg-white text-black"
    } px-6 py-12 sm:px-10 sm:py-16 space-y-6`}
  >
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="uppercase text-sm tracking-widest text-gray-400 font-semibold">About</div>
      <h2 className={`text-4xl sm:text-5xl font-bold ${isAlt ? "text-orange-400" : "text-orange-600"}`}>
        {title}
      </h2>
      <div className={`text-lg leading-relaxed max-w-3xl ${isAlt ? "text-gray-300" : "text-gray-700"}`}>
        {description}
      </div>
      {buttonText && href && (
        <div className="pt-4">
          <a
            href={href}
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold tracking-wide py-3 px-6 rounded shadow"
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-10 text-center w-full max-w-4xl mx-auto space-y-6 bg-white text-black">
        <div className="uppercase text-sm tracking-widest font-semibold">About</div>
        <div className="flex justify-center items-center gap-4">
          <Image src="/icon.svg" alt="Gouger Icon" width={48} height={48} />
          <h1 className="text-4xl sm:text-5xl font-bold text-red-600">Gouger</h1>
        </div>
        <p className="text-justify leading-relaxed max-w-2xl mx-auto">
          This tool helps individuals detect and report illegal rental price gouging during states of emergency. By
          comparing current rental listings with Fair Market Rent (FMR) data, Gouger identifies properties that may be
          overpriced beyond legal limits.
        </p>
        <p className="text-justify leading-relaxed max-w-2xl mx-auto">
          Please proceed to{" "}
          <a
            href="https://www.caloes.ca.gov/office-of-the-director/policy-administration/legal-affairs/price-gouging/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-orange-500 hover:text-orange-600"
          >
            https://www.caloes.ca.gov/office-of-the-director/policy-administration/legal-affairs/price-gouging/
          </a>{" "}
          for current guidelines on price gouging protections as a result of Proclamations or Executive Orders issued by the Governor of California.
        </p>
        <div>
          <a
            href="#features"
            className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold tracking-wide py-3 px-6 rounded shadow"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-24">
        <Section
          isAlt
          id="features"
          title="How It Works"
          description={
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-6 h-6 mt-1 text-orange-400" />
                <span>
                  <strong>Live Rental Listings</strong> → We collect real-time rental listings from{" "}
                  <em>Realtor.com, RentCast, Zumper</em>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 mt-1 text-orange-400" />
                <span>
                  <strong>Fair Market Rent (FMR) Data</strong> → HUD publishes standard rental rates for every ZIP code.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 mt-1 text-orange-400" />
                <span>
                  <strong>Gouging Detection</strong> → If a rental price exceeds FMR by 160% or more, it is flagged as potential price gouging.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-6 h-6 mt-1 text-orange-400" />
                <span>
                  <strong>Export Data</strong> → Users can click "Export" to download a CSV of all listings or only those flagged for gouging to be used in reports.
                </span>
              </li>
            </ul>
          }
          buttonText="Our Mission"
          href="#why"
        />
 
        <Section
          id="why"
          title="Why This Matters"
          description="By making rental pricing data transparent and structured, this app helps renters, journalists, and policymakers detect potential exploitation in the housing market — especially during vulnerable times."
        />
      </div>
    </div>
  );
}
