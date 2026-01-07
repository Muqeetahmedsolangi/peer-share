'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import Creator from './components/Creator';

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Features Section - Moved Higher for Immediate Visibility */}
      <section aria-label="File sharing methods" className="py-4 sm:py-8 md:py-12 bg-white -mt-4 sm:-mt-6 md:-mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Choose Your Sharing Method
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Select how you want to share files. Both methods use end-to-end encryption with no data storage.
            </p>
          </div> */}
          <FeatureCard 
            activeFeature={activeFeature} 
            onFeatureChange={setActiveFeature} 
          />
        </div>
      </section>

      {/* Benefits Section - SEO Rich */}
      <section aria-label="Security benefits" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Why Choose Secure File Sharing?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Experience the most secure file transfer solution with military-grade encryption and zero data storage
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">End-to-End Encryption</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                All files are encrypted with AES-256 encryption before transfer. Your data is protected from source to destination with zero access by third parties.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">No Data Saved Anywhere</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Files transfer directly between devices. We never store, log, or access your files. Complete privacy with zero server-side data retention.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4 sm:mb-5">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Unlimited File Sizes</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Transfer files of any size without restrictions. No upload limits, no download caps. Share large videos, datasets, or entire project folders instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Get started" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Get Started in Seconds
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Select your preferred method to start sharing files securely with end-to-end encryption
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <button
              onClick={() => router.push('/create-room')}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 text-left hover:border-orange-500 hover:shadow-xl transition-all group w-full"
              aria-label="Create secure room for file sharing"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Create Secure Room</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Set up a password-protected room for encrypted file sharing with anyone, anywhere. Perfect for remote collaboration.</p>
            </button>

            <button
              onClick={() => router.push('/join-room')}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 text-left hover:border-orange-500 hover:shadow-xl transition-all group w-full"
              aria-label="Join existing secure room"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Join Existing Room</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Enter a room code to access and download files from a secure sharing session. No registration required.</p>
            </button>

            <Link
              href="/same-wifi"
              className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 text-left hover:border-orange-500 hover:shadow-xl transition-all group block w-full sm:col-span-2 lg:col-span-1"
              aria-label="Same WiFi file sharing"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Same WiFi</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Transfer files instantly on the same WiFi network with automatic device discovery. No internet required.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - SEO Rich - Super Compact */}
      <section aria-label="How it works" className="py-6 sm:py-8 md:py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 px-2">
              How Secure File Sharing Works
            </h2>
            <p className="text-[8px] sm:text-xs md:text-sm text-gray-600 max-w-3xl mx-auto px-2">
              Our platform uses advanced WebRTC technology to ensure your files are transferred securely with zero server storage
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-[16px] sm:text-lg md:text-xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-[16px] sm:text-lg md:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-1">Create or Join</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 px-0.5 leading-tight">Create a secure room or join with a code. No account needed.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-[16px] sm:text-lg md:text-xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-[16px] sm:text-lg md:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-1">Encrypt Files</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 px-0.5 leading-tight">Files are encrypted with AES-256 before transfer begins.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-[16px] sm:text-lg md:text-xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-[16px] sm:text-lg md:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-1">Direct Transfer</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 px-0.5 leading-tight">Files transfer directly between devices using WebRTC.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-[16px] sm:text-lg md:text-xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-[16px] sm:text-lg md:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-1">Zero Storage</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 px-0.5 leading-tight">No files are saved on servers. Complete privacy guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section aria-label="About creator" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Creator />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">About</Link>
                  <Link href="/pricing" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Pricing</Link>
                  <Link href="/create-room" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Create Room</Link>
                  <Link href="/same-wifi" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Same WiFi</Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                <div className="space-y-2">
                  <span className="block text-sm text-gray-600">Direct File Transfer</span>
                  <span className="block text-sm text-gray-600">End-to-End Encryption</span>
                  <span className="block text-sm text-gray-600">Real-time Chat</span>
                  <span className="block text-sm text-gray-600">Zero Configuration</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Support</h4>
                <div className="space-y-2">
                  <Link href="/help" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Help Center</Link>
                  <Link href="/docs" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Documentation</Link>
                  <Link href="/contact" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Contact Us</Link>
                  <Link href="/status" className="block text-sm text-gray-600 hover:text-orange-500 transition-colors">Status</Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="https://github.com/Muqeetahmedsolangi" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/muqeetahmed" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://stackoverflow.com/users/your-user-id" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="Stack Overflow">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.134v6.404h15.008zM6.111 19.859H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.266.269-2.484-10.48-2.266-.269 2.484zm1.269-5.056l9.705 4.533.539-2.137-9.705-4.533-.539 2.137zm2.266-4.852l8.217 6.853 1.076-1.291-8.217-6.853-1.076 1.291zm4.532-4.533l5.374 9.023 1.614-.961-5.374-9.023-1.614.961z"/>
                    </svg>
                  </a>
                  <a href="https://muqeet.dropsos.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="Portfolio">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center">
                © {new Date().getFullYear()} Dropsos. Secure file sharing platform with end-to-end encryption. Created by <Link href="https://muqeet.dropsos.com" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">Muqeet Ahmed</Link>
              </p>
              <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mt-4 text-xs text-gray-500">
                <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
                <Link href="/security" className="hover:text-orange-500 transition-colors">Security</Link>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
