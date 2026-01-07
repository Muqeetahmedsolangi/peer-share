'use client';

import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-24 md:pb-12 bg-gradient-to-b from-white via-orange-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
          Share Files Securely
          <span className="text-orange-500 block mt-2 sm:mt-3">No Data Saved Anywhere</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-light px-2">
          Transfer files directly between devices with end-to-end encryption. 
          <span className="block mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">Your files never touch our servers. Complete privacy guaranteed.</span>
        </p>
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs text-gray-700 px-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium whitespace-nowrap">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-medium whitespace-nowrap">No Data Saved</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-medium whitespace-nowrap">Unlimited File Sizes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
