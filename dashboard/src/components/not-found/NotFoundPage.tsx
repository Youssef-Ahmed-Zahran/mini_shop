import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

/**
 * Shown for unmatched routes (wildcard *) or when a resource doesn't exist.
 * Linked back to "/" so protected users land on the dashboard.
 */
export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md px-6 py-12">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-8 shadow-sm">
          <SearchX className="w-10 h-10 text-indigo-400" />
        </div>

        {/* Headline */}
        <p className="text-7xl font-black text-indigo-500 mb-3 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Check the
          URL or head back to the dashboard.
        </p>

        {/* CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 rounded-xl transition-all duration-150 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
