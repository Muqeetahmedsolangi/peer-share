'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Creator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Compact Creator Section */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Created by
            </span>
          </h3>
        </div>

        {/* Creator Profile - Compact */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Profile Image - Smaller */}
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-0.5 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-white">MA</span>
              </div>
            </div>
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-pulse group-hover:border-blue-300/50 transition-colors duration-300"></div>
          </div>

          {/* Creator Info - Compact */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
              Muqeet Ahmed
            </h4>
            <div className="space-y-1 mb-3">
              <p className="text-sm sm:text-base text-blue-400 font-semibold">Full Stack Developer</p>
              <p className="text-xs sm:text-sm text-purple-400 font-medium">DevOps Engineer</p>
            </div>
            
            {/* Compact Bio */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 line-clamp-2">
              Expert in modern web technologies, cloud infrastructure, and secure file sharing solutions.
            </p>

            {/* Social Links - Compact */}
            <div className="flex justify-center sm:justify-start space-x-3">
              <a 
                href="https://github.com/muqeetahmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-8 h-8 sm:w-9 sm:h-9 bg-slate-700/50 rounded-lg flex items-center justify-center hover:bg-slate-600/50 transition-all duration-300 hover:scale-110"
                title="GitHub"
              >
                <svg className="w-4 h-4 text-white group-hover:text-gray-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/in/muqeetahmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-8 h-8 sm:w-9 sm:h-9 bg-blue-600/50 rounded-lg flex items-center justify-center hover:bg-blue-600/70 transition-all duration-300 hover:scale-110"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 text-white group-hover:text-blue-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                href="https://twitter.com/muqeetahmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-8 h-8 sm:w-9 sm:h-9 bg-cyan-500/50 rounded-lg flex items-center justify-center hover:bg-cyan-500/70 transition-all duration-300 hover:scale-110"
                title="Twitter"
              >
                <svg className="w-4 h-4 text-white group-hover:text-cyan-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="mailto:muqeetahmed@example.com"
                className="group w-8 h-8 sm:w-9 sm:h-9 bg-purple-600/50 rounded-lg flex items-center justify-center hover:bg-purple-600/70 transition-all duration-300 hover:scale-110"
                title="Email"
              >
                <svg className="w-4 h-4 text-white group-hover:text-purple-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links - Compact Grid */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <h5 className="text-sm font-semibold text-white mb-3 text-center">Quick Links</h5>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <a href="/about" className="group flex flex-col items-center p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <span className="text-sm mb-1">ℹ️</span>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">About</span>
            </a>
            
            <Link href="/blog" className="group flex flex-col items-center p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <span className="text-sm mb-1">📝</span>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Blog</span>
            </Link>
            
            <a href="/create-room" className="group flex flex-col items-center p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <span className="text-sm mb-1">➕</span>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Create</span>
            </a>
            
            <a href="/same-wifi" className="group flex flex-col items-center p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <span className="text-sm mb-1">📶</span>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">WiFi</span>
            </a>
            
            <a href="/pricing" className="group flex flex-col items-center p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <span className="text-sm mb-1">💰</span>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Pricing</span>
            </a>
          </div>
        </div>

        {/* Footer Text - Compact */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-400 text-center">
            © 2024 Dropsos. Created with ❤️ by <span className="text-blue-400 font-semibold">Muqeet Ahmed</span>
          </p>
        </div>
      </div>
    </div>
  );
}
