import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  error,
  message,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm px-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-gray-900">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {message ||
              error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>
        </div>

        {/* Retry */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 rounded-xl transition-all duration-150 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
