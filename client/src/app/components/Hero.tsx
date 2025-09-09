'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const words = [
    'Dropsos',
    'Peer to Peer',
    'Dropsos',
    'Share Securely',
    'Dropsos',
    'Fast & Reliable',
    'Dropsos',
    'Room Creation',
    'Dropsos',
    'End-to-End'
  ];

  const subtitles = [
    'Professional peer-to-peer file sharing with military-grade encryption and seamless collaboration',
    'Connect devices directly without servers for ultra-fast and secure file transfers',
    'Your trusted platform for secure file sharing and real-time collaboration',
    'Share files with end-to-end encryption ensuring your data stays private and secure',
    'Your trusted platform for secure file sharing and real-time collaboration',
    'Lightning-fast transfers with enterprise-grade reliability and performance',
    'Your trusted platform for secure file sharing and real-time collaboration',
    'Create secure rooms for team collaboration and instant file sharing',
    'Your trusted platform for secure file sharing and real-time collaboration',
    'Military-grade encryption protecting your files from source to destination'
  ];
  
  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <header id="hero" className="relative z-10  pb-4 sm:pb-6 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm mb-4 sm:mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
            <span className="text-xs sm:text-sm text-green-300 font-semibold tracking-wide">ENTERPRISE-GRADE SECURITY</span>
          </div>
          
          {/* Main Title - Animated Word Rotation */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-10xl xl:text-11xl font-black mb-3 sm:mb-4 md:mb-6 tracking-tight leading-none">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl transition-all duration-500 ease-in-out">
                {words[currentWord]}
              </span>
            </h1>
            
            {/* Animated Underline */}
            <div className="w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          {/* Subtitle - Animated Text Rotation */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative overflow-hidden">
              <p className={`pt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto font-light leading-relaxed px-4 sm:px-0 transition-all duration-500 ease-in-out ${
                isAnimating 
                  ? 'opacity-0 translate-x-8 transform scale-95' 
                  : 'opacity-100 translate-x-0 transform scale-100'
              }`}>
                {subtitles[currentWord]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
