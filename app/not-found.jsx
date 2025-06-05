import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[10rem] leading-none font-extrabold text-indigo-600 animate-pulse">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
          Oops! Page Not Found 😕
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6">
          <Link href="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-400 transition-all duration-300 hover:bg-indigo-700">
            ⬅️ Go Back Home
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-400">
          Or try exploring something else from the menu.
        </div>
      </div>
    </div>
  );
}
