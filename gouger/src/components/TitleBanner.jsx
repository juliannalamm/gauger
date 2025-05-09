import Link from "next/link";

export default function TitleBanner() {
  return (
    <div className="w-screen -mx-4 sm:mx-0 bg-gradient-to-r from-rose-100 via-amber-50 to-rose-50 shadow-sm border-b border-amber-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navbar */}
        <nav className="flex items-center justify-between">
          <ul className="flex space-x-6 text-sm font-medium text-amber-900">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">About</Link>
            </li>
            <li>
              <Link href="/report" className="hover:underline">Report</Link>
            </li>
          </ul>
        </nav>

        {/* Title */}
        <div className="mt-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-rose-600">
            Gouger 
         </h2>
          <p className="mt-3 text-lg text-amber-900 max-w-xl mx-auto font-light">
            A tool for renters to identify price spikes during emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}
