'use client';

import Link from 'next/link';

export default function Creator() {
  return (
    <div className="w-full bg-white border-2 border-orange-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/30 rounded-full blur-2xl -z-0"></div>
      
      <div className="relative z-10">
        {/* Compact Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Created by
            </h3>
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Meet the Developer</p>
        </div>

        {/* Professional Profile Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 mb-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 lg:gap-8">
            {/* Large Profile Image */}
            <div className="relative group flex-shrink-0">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center ring-2 ring-orange-100">
                  <img 
                    src="/muqeetahmed.jpeg" 
                    alt="Muqeet Ahmed - Full Stack Developer and DevOps Engineer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* User Info - Large and Prominent */}
            <div className="flex-1 text-center lg:text-left w-full">
              <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Muqeet Ahmed
              </h4>
              
              {/* Compact Role Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Full Stack Developer
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  DevOps Engineer
                </span>
              </div>
              
              {/* Compact Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 max-w-2xl mx-auto lg:mx-0">
                Expert in modern web technologies, cloud infrastructure, and secure file sharing solutions. 
                Passionate about building scalable, secure, and user-friendly applications.
              </p>

              {/* Professional Social Links */}
              <div className="flex justify-center lg:justify-start gap-2 sm:gap-3">
                <a 
                  href="https://github.com/Muqeetahmedsolangi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  title="GitHub Profile"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-white transition-colors group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://linkedin.com/in/muqeetahmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://stackoverflow.com/users/your-user-id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  title="Stack Overflow Profile"
                  aria-label="Stack Overflow"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.134v6.404h15.008zM6.111 19.859H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.266.269-2.484-10.48-2.266-.269 2.484zm1.269-5.056l9.705 4.533.539-2.137-9.705-4.533-.539 2.137zm2.266-4.852l8.217 6.853 1.076-1.291-8.217-6.853-1.076 1.291zm4.532-4.533l5.374 9.023 1.614-.961-5.374-9.023-1.614.961z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://muqeet.dropsos.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  title="Portfolio Website"
                  aria-label="Portfolio"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Quick Links Section */}
        <div className="pt-5 sm:pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Quick Links
            </h5>
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <span>Explore</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            <Link 
              href="/about" 
              className="group relative bg-white rounded-lg p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">About</span>
              </div>
            </Link>
            
            <Link 
              href="/blog" 
              className="group relative bg-white rounded-lg p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">Blog</span>
              </div>
            </Link>
            
            <Link 
              href="/create-room" 
              className="group relative bg-white rounded-lg p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">Create</span>
              </div>
            </Link>
            
            <Link 
              href="/same-wifi" 
              className="group relative bg-white rounded-lg p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">WiFi</span>
              </div>
            </Link>
            
            <Link 
              href="/pricing" 
              className="group relative bg-white rounded-lg p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">Pricing</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
