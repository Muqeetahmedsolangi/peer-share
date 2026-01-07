'use client';

import Link from 'next/link';
import Creator from '../components/Creator';

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Hero Section - Simple */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              About <span className="text-orange-500">Dropsos</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              The World's Most Secure Peer-to-Peer File Sharing Platform
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dropsos is an enterprise-grade secure file sharing platform that uses AES-256 military-grade encryption, 
              WebRTC peer-to-peer technology, and zero-server architecture to ensure your files are transferred securely 
              with complete privacy. Trusted by 500K+ professionals worldwide for confidential file transfers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Simple */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To provide the world's most secure, fast, and reliable peer-to-peer file sharing solutions that prioritize 
                user privacy and data security. We believe that file sharing should be instant, secure, and completely private 
                without compromising on performance or user experience.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To revolutionize file sharing by eliminating the need for centralized servers while ensuring maximum security, 
                privacy, and performance. We envision a future where file sharing is instant, secure, and completely decentralized, 
                giving users complete control over their data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Simple */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Dropsos?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security features that make Dropsos the #1 choice for secure file sharing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">AES-256 Military-Grade Encryption</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                All files are encrypted with AES-256 encryption before transfer, ensuring military-grade security. 
                Your data is protected from source to destination with zero access by third parties or servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Zero Server Storage</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Files transfer directly between devices using WebRTC peer-to-peer technology. We never store, 
                log, or access your files. Complete privacy with zero server-side data retention.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Lightning-Fast WebRTC Technology</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Direct peer-to-peer connections using WebRTC technology ensure maximum transfer speeds. 
                No intermediate servers mean faster file transfers and lower latency.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">GDPR & SOC 2 Compliant</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Dropsos is fully compliant with GDPR regulations and SOC 2 standards, ensuring enterprise-grade 
                security and privacy for businesses and organizations worldwide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Unlimited File Sizes</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Transfer files of any size without restrictions. No upload limits, no download caps. 
                Share large videos, datasets, or entire project folders instantly.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Zero Configuration Required</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Works instantly without complex setup or configuration. Simply create a room or use Same WiFi sharing 
                for instant, secure file transfers. No technical knowledge required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section - Using Component */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Creator />
        </div>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Experience Secure File Sharing?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join 500K+ professionals who trust Dropsos for secure, private file transfers. 
            Get started in seconds - no registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-room"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
            >
              Create Secure Room
            </Link>
            <Link
              href="/same-wifi"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
            >
              Try Same WiFi Sharing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
