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

      {/* Performance Metrics Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-r from-slate-900/70 to-gray-900/70 py-12">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center mb-8">
            <div className="group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">99.99%</h3>
              <p className="text-gray-400 text-sm">Uptime SLA</p>
            </div>
            <div className="group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">&lt; 10ms</h3>
              <p className="text-gray-400 text-sm">Network Latency</p>
            </div>
            <div className="group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">256-bit</h3>
              <p className="text-gray-400 text-sm">Encryption</p>
            </div>
            <div className="group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">ISO 27001</h3>
              <p className="text-gray-400 text-sm">Compliance</p>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="text-center pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Dropsos. All rights reserved. | Enterprise file sharing with military-grade security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
