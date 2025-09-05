'use client';

import { useState } from 'react';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0.1))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/60 transition-all cursor-pointer"></div>
        <div className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></div>
        <div className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-8 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">Enterprise-Grade Security</span>
          </div>
          
          <h1 className="text-8xl font-black mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dropsos
            </span>
          </h1>
          
          <p className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Industrial-strength peer-to-peer file sharing platform engineered for 
            <span className="text-white font-medium"> mission-critical </span>
            secure communications
          </p>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="container mx-auto px-8 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three pillars of secure, professional file collaboration
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Create Room */}
            <div 
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveFeature(0)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-10 transition-all duration-500 ${
                activeFeature === 0 
                  ? 'border-blue-400/50 shadow-2xl shadow-blue-500/20 transform -translate-y-3' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                
                {/* Background Glow */}
                {activeFeature === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
                    activeFeature === 0
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-600/80 to-blue-700/80'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-bold text-white mb-6">Create Room</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Instantly deploy secure video rooms with enterprise-grade authentication and access controls
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">WebRTC</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">GraphQL</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">Socket.IO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Same WiFi */}
            <div 
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveFeature(1)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-10 transition-all duration-500 ${
                activeFeature === 1 
                  ? 'border-purple-400/50 shadow-2xl shadow-purple-500/20 transform -translate-y-3' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                
                {/* Background Glow */}
                {activeFeature === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
                    activeFeature === 1
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-2xl shadow-purple-500/30'
                      : 'bg-gradient-to-r from-purple-600/80 to-purple-700/80'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-bold text-white mb-6">Same WiFi</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Optimized local network discovery with zero-configuration peer detection and ultra-low latency
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">mDNS</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">P2P</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">STUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypted Sharing */}
            <div 
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveFeature(2)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border rounded-3xl p-10 transition-all duration-500 ${
                activeFeature === 2 
                  ? 'border-cyan-400/50 shadow-2xl shadow-cyan-500/20 transform -translate-y-3' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                
                {/* Background Glow */}
                {activeFeature === 2 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-3xl blur-xl"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
                    activeFeature === 2
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-2xl shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-cyan-600/80 to-cyan-700/80'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-bold text-white mb-6">Encrypted Sharing</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Military-grade end-to-end encryption with perfect forward secrecy and quantum-resistant algorithms
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30">AES-256</span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30">DTLS</span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30">SRTP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-8 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Experience enterprise-grade file sharing with military-level encryption
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1">
              <span className="relative z-10">Create Room</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="px-12 py-4 border-2 border-white/20 rounded-2xl font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              Join Room
            </button>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">99.99%</h3>
              <p className="text-gray-400 text-sm">Uptime SLA</p>
            </div>
            <div className="group">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">&lt; 10ms</h3>
              <p className="text-gray-400 text-sm">Network Latency</p>
            </div>
            <div className="group">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">256-bit</h3>
              <p className="text-gray-400 text-sm">Encryption</p>
            </div>
            <div className="group">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">ISO 27001</h3>
              <p className="text-gray-400 text-sm">Compliance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
