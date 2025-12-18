import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 py-16 z-10 text-center">
        <h1 className="text-9xl font-bold mb-8 text-gray-900">
          <span className="inline-block">4</span>
          <span className="inline-block mx-4">
            <svg
              className="w-32 h-32"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="50" fill="#FF5A5A" />
              <circle cx="30" cy="35" r="8" fill="#661F1F" />
              <circle cx="70" cy="30" r="6" fill="#661F1F" />
              <circle cx="45" cy="60" r="10" fill="#661F1F" />
              <circle cx="65" cy="65" r="5" fill="#661F1F" />
            </svg>
          </span>
          <span className="inline-block">4</span>
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold mb-8">Page Not Found</h2>

        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-700">
          Oops! The page you are looking for might have been moved, deleted, or
          never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-full font-medium text-lg transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
