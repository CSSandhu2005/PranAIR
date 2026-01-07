import Link from "next/link";

// App Router 404 page
// Required for proper route handling and prevents Next.js lookup errors
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
