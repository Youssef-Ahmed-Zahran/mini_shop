import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

/**
 * Full-area loading spinner.
 * Drop it anywhere you need a centered loading state.
 */
export default function PageLoader({ message = "Loading…" }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100" />
          {/* Spinning arc */}
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin absolute inset-0" />
        </div>
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}
