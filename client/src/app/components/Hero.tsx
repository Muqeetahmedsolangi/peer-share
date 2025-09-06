'use client';

export default function Hero() {
  return (
    <header id="hero" className="relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 md:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-6xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm mb-4 sm:mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
            <span className="text-xs sm:text-sm text-green-300 font-semibold tracking-wide">ENTERPRISE-GRADE SECURITY</span>
          </div>
          
          {/* Main Title - Responsive Typography */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-10xl xl:text-11xl font-black mb-3 sm:mb-4 md:mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
              Dropsos
            </span>
          </h1>
          
          {/* Subtitle - Responsive */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto font-light leading-relaxed px-4 sm:px-0">
            Professional peer-to-peer file sharing with 
            <span className="text-white font-semibold"> military-grade encryption </span>
            and seamless collaboration
          </p>
        </div>
      </div>
    </header>
  );
}
