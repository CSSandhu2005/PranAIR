"use client";

// App Router error boundary
// Required to prevent build-manifest.json lookup failures for /_error
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
