'use client';

import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative scroll-smooth overflow-x-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0.1))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <Hero />

      {/* Main Features Section - Hyper Responsive & Perfect */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 relative z-10">
        <div className="w-full">
          <FeatureCard 
            activeFeature={activeFeature} 
            onFeatureChange={setActiveFeature} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-8 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
            Experience enterprise-grade file sharing with military-level encryption and zero-configuration setup
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group relative px-16 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-2">
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Room
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="group px-16 py-5 border-2 border-white/30 rounded-2xl font-bold text-lg text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0" />
                </svg>
                Join Room
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">SOC 2</div>
              <div className="text-xs text-gray-400">Compliant</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">GDPR</div>
              <div className="text-xs text-gray-400">Ready</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
              <div className="text-xs text-gray-400">Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">24/7</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section - Professional */}
      <section className="relative z-10 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Creator Profile Card */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl shadow-black/30">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                    Created by
                  </span>
                </h2>
              </div>

              {/* Creator Profile */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-1 shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                      {/* Profile Image Placeholder - You can replace with actual image */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">MA</span>
                      </div>
                    </div>
                  </div>
                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse group-hover:border-blue-300/50 transition-colors duration-500"></div>
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </div>

                {/* Creator Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Muqeet Ahmed
                    </span>
                  </h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-xl sm:text-2xl text-blue-400 font-semibold">Full Stack Developer</p>
                    <p className="text-lg sm:text-xl text-purple-400 font-semibold">DevOps Engineer</p>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0">
                      Passionate about building scalable, secure, and innovative web applications. 
                      Specializing in modern technologies and cloud infrastructure.
                    </p>
                  </div>

                  {/* Social Media Icons */}
                  <div className="flex justify-center lg:justify-start space-x-4 sm:space-x-6">
                    <a href="https://github.com/muqeetahmed" target="_blank" rel="noopener noreferrer" 
                       className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-gray-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    
                    <a href="https://linkedin.com/in/muqeetahmed" target="_blank" rel="noopener noreferrer" 
                       className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-blue-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    
                    <a href="https://twitter.com/muqeetahmed" target="_blank" rel="noopener noreferrer" 
                       className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-cyan-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    
                    <a href="mailto:muqeetahmed@example.com" 
                       className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-purple-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="border-t border-white/10 pt-8">
                <h4 className="text-xl font-semibold text-white mb-6 text-center">Explore My Work</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <a href="/about" className="group flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-lg">ℹ️</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">About</span>
                  </a>
                  
                  <a href="/blog" className="group flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                      <span className="text-lg">📝</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Blog</span>
                  </a>
                  
                  <a href="/create-room" className="group flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-500/30 transition-colors">
                      <span className="text-lg">➕</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Create Room</span>
                  </a>
                  
                  <a href="/same-wifi" className="group flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-lg">📶</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Same WiFi</span>
                  </a>
                  
                  <a href="https://github.com/muqeetahmed" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-gray-500/30 transition-colors">
                      <span className="text-lg">💻</span>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">GitHub</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                © 2024 Dropsos. Created with ❤️ by <span className="text-blue-400 font-semibold">Muqeet Ahmed</span> | 
                Enterprise file sharing with military-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
