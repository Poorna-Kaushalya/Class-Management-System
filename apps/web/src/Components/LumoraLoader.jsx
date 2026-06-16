import logo from "../Assets/Logo2.png";

export default function LumoraLoader() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white px-4">
      
      <style>{`
        @keyframes lumoraBar {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
      `}</style>

      {/* Logo */}
      <img
        src={logo}
        alt="LUMORA Logo"
        className="w-40 sm:w-52 md:w-72 lg:w-96 h-auto object-contain"
      />

      {/* Loading text */}
      <p className="mt-5 sm:mt-6 text-indigo-700 font-semibold text-base sm:text-lg tracking-wide">
        Loading...
      </p>

      {/* Progress bar container */}
      <div className="mt-5 sm:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-2 sm:px-4">
        
        <div className="relative h-2.5 sm:h-3 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full w-20 sm:w-28 rounded-full bg-indigo-600"
            style={{ animation: "lumoraBar 1.2s linear infinite" }}
          />
        </div>

        {/* Welcome paragraph */}
        <p className="mt-4 text-center text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
          Welcome to{" "}
          <span className="font-semibold text-indigo-600">LUMORA</span>,
          where smarter learning meets clear understanding.
        </p>
      </div>
    </div>
  );
}