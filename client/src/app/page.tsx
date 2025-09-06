'use client';

import { useState, useEffect } from 'react';
import Hero from './components/Hero';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative scroll-smooth overflow-x-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0.1))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <Hero />

      {/* Main Features Section - Hyper Responsive & Perfect */}
      <section id="features" className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 relative z-10">
        <div className="max-w-8xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            
            {/* Create Room - Hyper Responsive & Perfect */}
            <div 
              className="group relative cursor-pointer md:col-span-1 touch-manipulation select-none"
              onMouseEnter={() => setActiveFeature(0)}
              onMouseLeave={() => setActiveFeature(null)}
              onTouchStart={() => setActiveFeature(0)}
              onTouchEnd={() => setTimeout(() => setActiveFeature(null), 2000)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border rounded-xl xs:rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-700 ease-out ${
                activeFeature === 0 
                  ? 'border-blue-400/60 shadow-2xl shadow-blue-500/25 transform -translate-y-1 xs:-translate-y-2 sm:-translate-y-3 md:-translate-y-4 scale-105 xs:scale-[1.02] sm:scale-[1.03] md:scale-105' 
                  : 'border-white/10 hover:border-white/25 active:border-blue-300/40 active:scale-[0.98]'
              }`}>
                
                {/* Enhanced Background Glow */}
                {activeFeature === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/25 to-purple-600/25 rounded-xl xs:rounded-2xl sm:rounded-3xl blur-2xl animate-pulse"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon - Ultra Responsive */}
                  <div className={`w-12 xs:w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 rounded-xl xs:rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 transition-all duration-700 ${
                    activeFeature === 0
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl sm:shadow-2xl shadow-blue-500/40 scale-110'
                      : 'bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-500/90 hover:to-blue-600/90'
                  }`}>
                    <div className="relative">
                      <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <div className="absolute inset-0 animate-ping opacity-40 duration-2000">
                        <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content - Ultra Responsive Typography */}
                  <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 leading-tight">Create Room</h3>
                  <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                    Instantly deploy secure file rooms with enterprise-grade authentication and access controls
                  </p>
                  
                  {/* Tech Stack - Perfect Mobile */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-blue-500/25 text-blue-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-blue-500/40 transition-all duration-300 hover:bg-blue-500/35 hover:border-blue-400/60">WebRTC</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-blue-500/25 text-blue-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-blue-500/40 transition-all duration-300 hover:bg-blue-500/35 hover:border-blue-400/60">GraphQL</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-blue-500/25 text-blue-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-blue-500/40 transition-all duration-300 hover:bg-blue-500/35 hover:border-blue-400/60">Socket.IO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Same WiFi - Hyper Responsive & Perfect */}
            <div 
              className="group relative cursor-pointer md:col-span-1 touch-manipulation select-none"
              onMouseEnter={() => setActiveFeature(1)}
              onMouseLeave={() => setActiveFeature(null)}
              onTouchStart={() => setActiveFeature(1)}
              onTouchEnd={() => setTimeout(() => setActiveFeature(null), 2000)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border rounded-xl xs:rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-700 ease-out ${
                activeFeature === 1 
                  ? 'border-purple-400/60 shadow-2xl shadow-purple-500/25 transform -translate-y-1 xs:-translate-y-2 sm:-translate-y-3 md:-translate-y-4 scale-105 xs:scale-[1.02] sm:scale-[1.03] md:scale-105' 
                  : 'border-white/10 hover:border-white/25 active:border-purple-300/40 active:scale-[0.98]'
              }`}>
                
                {/* Enhanced Background Glow */}
                {activeFeature === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/25 to-pink-600/25 rounded-xl xs:rounded-2xl sm:rounded-3xl blur-2xl animate-pulse"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon - Ultra Responsive */}
                  <div className={`w-12 xs:w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 rounded-xl xs:rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 transition-all duration-700 ${
                    activeFeature === 1
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-xl sm:shadow-2xl shadow-purple-500/40 scale-110'
                      : 'bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500/90 hover:to-purple-600/90'
                  }`}>
                    <div className="relative">
                      <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                      </svg>
                      <div className="absolute -inset-1 xs:-inset-1.5 sm:-inset-2 md:-inset-2.5 animate-spin opacity-30 duration-3000 border-2 xs:border-3 border-purple-400 border-t-transparent rounded-full"></div>
                    </div>
                  </div>

                  {/* Content - Ultra Responsive Typography */}
                  <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 leading-tight">Same WiFi</h3>
                  <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                    Optimized local network discovery with zero-configuration peer detection and ultra-low latency
                  </p>
                  
                  {/* Tech Stack - Perfect Mobile */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-purple-500/25 text-purple-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-purple-500/40 transition-all duration-300 hover:bg-purple-500/35 hover:border-purple-400/60">mDNS</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-purple-500/25 text-purple-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-purple-500/40 transition-all duration-300 hover:bg-purple-500/35 hover:border-purple-400/60">P2P</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-purple-500/25 text-purple-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-purple-500/40 transition-all duration-300 hover:bg-purple-500/35 hover:border-purple-400/60">STUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypted Sharing - Hyper Responsive & Perfect */}
            <div 
              className="group relative cursor-pointer md:col-span-2 lg:col-span-1 touch-manipulation select-none"
              onMouseEnter={() => setActiveFeature(2)}
              onMouseLeave={() => setActiveFeature(null)}
              onTouchStart={() => setActiveFeature(2)}
              onTouchEnd={() => setTimeout(() => setActiveFeature(null), 2000)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border rounded-xl xs:rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-700 ease-out ${
                activeFeature === 2 
                  ? 'border-cyan-400/60 shadow-2xl shadow-cyan-500/25 transform -translate-y-1 xs:-translate-y-2 sm:-translate-y-3 md:-translate-y-4 scale-105 xs:scale-[1.02] sm:scale-[1.03] md:scale-105' 
                  : 'border-white/10 hover:border-white/25 active:border-cyan-300/40 active:scale-[0.98]'
              }`}>
                
                {/* Enhanced Background Glow */}
                {activeFeature === 2 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/25 to-teal-600/25 rounded-xl xs:rounded-2xl sm:rounded-3xl blur-2xl animate-pulse"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon - Ultra Responsive */}
                  <div className={`w-12 xs:w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 rounded-xl xs:rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 transition-all duration-700 ${
                    activeFeature === 2
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-xl sm:shadow-2xl shadow-cyan-500/40 scale-110'
                      : 'bg-gradient-to-r from-cyan-600/80 to-cyan-700/80 hover:from-cyan-500/90 hover:to-cyan-600/90'
                  }`}>
                    <div className="relative">
                      <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <div className="absolute inset-0 animate-ping opacity-30">
                        <div className="w-1.5 xs:w-2 sm:w-2.5 md:w-3 h-1.5 xs:h-2 sm:h-2.5 md:h-3 bg-cyan-400 rounded-full absolute top-0.5 xs:top-1 sm:top-1.5 md:top-2 left-1/2 transform -translate-x-1/2 animate-bounce duration-1000"></div>
                        <div className="w-1 xs:w-1.5 sm:w-2 md:w-2.5 h-1 xs:h-1.5 sm:h-2 md:h-2.5 bg-cyan-300 rounded-full absolute top-1.5 xs:top-2 sm:top-3 md:top-4 right-1.5 xs:right-2 sm:right-2.5 md:right-3 animate-bounce delay-150 duration-1200"></div>
                        <div className="w-1 xs:w-1.5 sm:w-2 md:w-2.5 h-1 xs:h-1.5 sm:h-2 md:h-2.5 bg-cyan-300 rounded-full absolute top-1.5 xs:top-2 sm:top-3 md:top-4 left-1.5 xs:left-2 sm:left-2.5 md:left-3 animate-bounce delay-300 duration-1400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content - Ultra Responsive Typography */}
                  <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 leading-tight">Encrypted Sharing</h3>
                  <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                    Military-grade end-to-end encryption with perfect forward secrecy and quantum-resistant algorithms
                  </p>
                  
                  {/* Tech Stack - Perfect Mobile */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-cyan-500/25 text-cyan-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-cyan-500/40 transition-all duration-300 hover:bg-cyan-500/35 hover:border-cyan-400/60">AES-256</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-cyan-500/25 text-cyan-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-cyan-500/40 transition-all duration-300 hover:bg-cyan-500/35 hover:border-cyan-400/60">DTLS</span>
                    <span className="px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 bg-cyan-500/25 text-cyan-300 text-xs xs:text-xs sm:text-sm md:text-base rounded-full border border-cyan-500/40 transition-all duration-300 hover:bg-cyan-500/35 hover:border-cyan-400/60">SRTP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section - Super Responsive */}
      <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 md:mb-16 max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-0">
            Experience enterprise-grade file sharing with military-level encryption and zero-configuration setup
          </p>
          
          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
            <button className="group relative px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl font-semibold sm:font-bold text-base sm:text-lg text-white shadow-xl sm:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Room
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="group px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 border-2 border-white/30 rounded-xl sm:rounded-2xl font-semibold sm:font-bold text-base sm:text-lg text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center justify-center">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0" />
                </svg>
                Join Room
              </span>
            </button>
          </div>

          {/* Trust Indicators - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 mb-1">SOC 2</div>
              <div className="text-xs text-gray-400">Compliant</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 mb-1">GDPR</div>
              <div className="text-xs text-gray-400">Ready</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-1">99.9%</div>
              <div className="text-xs text-gray-400">Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 mb-1">24/7</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Footer - Super Responsive */}
      <footer className="border-t border-white/10 bg-gradient-to-r from-slate-900/70 to-gray-900/70 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center mb-6 sm:mb-8">
            <div className="group">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors">99.99%</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Uptime SLA</p>
            </div>
            <div className="group">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">&lt; 10ms</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Network Latency</p>
            </div>
            <div className="group">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-400 transition-colors">256-bit</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Encryption</p>
            </div>
            <div className="group">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-green-400 transition-colors">ISO 27001</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Compliance</p>
            </div>
          </div>
          
          {/* Footer Links - Mobile Friendly */}
          <div className="text-center pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Security</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Documentation</a>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-0">
              © 2024 Dropsos. All rights reserved. | Enterprise file sharing with military-grade security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
