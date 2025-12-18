import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-800 to-red-800">
      <div
        className="absolute inset-0 bg-pattern opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative lock-shake">
              <svg
                className="w-40 h-40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="20"
                  y="45"
                  width="60"
                  height="50"
                  rx="5"
                  fill="#FFD700"
                />
                <path
                  d="M35 45V30C35 19.5066 43.5066 11 54 11V11C64.4934 11 73 19.5066 73 30V45"
                  stroke="#FFD700"
                  strokeWidth="8"
                />
                <circle cx="50" cy="65" r="8" fill="#5D4037" />
                <rect
                  x="48"
                  y="65"
                  width="4"
                  height="15"
                  rx="2"
                  fill="#5D4037"
                />
              </svg>

              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pulse">
                <span className="text-5xl font-bold text-red-600">403</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Access Denied
          </h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <div className="bg-red-500/20 rounded-lg p-4 flex-1 min-w-[200px] max-w-[300px]">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Authentication Required
                </h3>
                <p className="text-white/80">
                  You need proper credentials to access this resource.
                </p>
              </div>

              <div className="bg-yellow-500/20 rounded-lg p-4 flex-1 min-w-[200px] max-w-[300px]">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Missing Permissions
                </h3>
                <p className="text-white/80">
                  Your account doesn't have the required permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium text-lg transition-colors flex items-center"
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

      {/* Police/Shield Icons */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 opacity-50">
        <svg
          className="w-16 h-16 sm:w-24 sm:h-24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10L85 25V45C85 65.6667 70 85 50 90C30 85 15 65.6667 15 45V25L50 10Z"
            fill="#3B82F6"
          />
          <path
            d="M35 45L45 55L65 35"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-50">
        <svg
          className="w-16 h-16 sm:w-24 sm:h-24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M67.5 40H32.5C30.2909 40 28.5 41.7909 28.5 44V76C28.5 78.2091 30.2909 80 32.5 80H67.5C69.7091 80 71.5 78.2091 71.5 76V44C71.5 41.7909 69.7091 40 67.5 40Z"
            fill="#F59E0B"
          />
          <path
            d="M34.5 40V28C34.5 21.3726 39.8726 16 46.5 16H53.5C60.1274 16 65.5 21.3726 65.5 28V40"
            stroke="#F59E0B"
            strokeWidth="8"
          />
          <circle cx="50" cy="60" r="6" fill="#78350F" />
        </svg>
      </div>
    </div>
  );
};

export default Forbidden;
