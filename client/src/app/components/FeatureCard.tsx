'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  activeFeature: number | null;
  onFeatureChange: (id: number | null) => void;
}

export default function FeatureCard({ activeFeature, onFeatureChange }: FeatureCardProps) {
  const router = useRouter();

  const handleFeatureClick = (featureId: number) => {
    if (featureId === 0) { // Create Room feature
      router.push('/create-room');
    } else if (featureId === 1) { // Same WiFi feature
      router.push('/same-wifi');
    }
    // Add more navigation logic for other features as needed
  };

  // Feature data configuration - all data is now inside the component
  const features = [
    {
      id: 0,
      title: "Create Room",
      description: "Instantly deploy secure file rooms with enterprise-grade authentication and access controls",
      techStack: ["WebRTC", "GraphQL", "Socket.IO"],
      colorScheme: {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600",
        secondary: "bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-500/90 hover:to-blue-600/90",
        glow: "shadow-blue-500/40",
        border: "border-blue-400/60",
        tech: "bg-blue-500/25 text-blue-300 border-blue-500/40"
      },
      icon: (
        <>
          <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <div className="absolute inset-0 animate-ping opacity-40 duration-2000">
            <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </>
      ),
      colSpan: "md:col-span-1"
    },
    {
      id: 1,
      title: "Same WiFi",
      description: "Optimized local network discovery with zero-configuration peer detection and ultra-low latency",
      techStack: ["mDNS", "P2P", "STUN"],
      colorScheme: {
        primary: "bg-gradient-to-r from-purple-500 to-purple-600",
        secondary: "bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500/90 hover:to-purple-600/90",
        glow: "shadow-purple-500/40",
        border: "border-purple-400/60",
        tech: "bg-purple-500/25 text-purple-300 border-purple-500/40"
      },
      icon: (
        <>
          <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
          </svg>
          <div className="absolute -inset-1 xs:-inset-1.5 sm:-inset-2 md:-inset-2.5 animate-spin opacity-30 duration-3000 border-2 xs:border-3 border-purple-400 border-t-transparent rounded-full"></div>
        </>
      ),
      colSpan: "md:col-span-1"
    },
    {
      id: 2,
      title: "Encrypted Sharing",
      description: "Military-grade end-to-end encryption with perfect forward secrecy and quantum-resistant algorithms",
      techStack: ["AES-256", "DTLS", "SRTP"],
      colorScheme: {
        primary: "bg-gradient-to-r from-cyan-500 to-cyan-600",
        secondary: "bg-gradient-to-r from-cyan-600/80 to-cyan-700/80 hover:from-cyan-500/90 hover:to-cyan-600/90",
        glow: "shadow-cyan-500/40",
        border: "border-cyan-400/60",
        tech: "bg-cyan-500/25 text-cyan-300 border-cyan-500/40"
      },
      icon: (
        <>
          <svg className="w-6 xs:w-7 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 xs:h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <div className="absolute inset-0 animate-ping opacity-30">
            <div className="w-1.5 xs:w-2 sm:w-2.5 md:w-3 h-1.5 xs:h-2 sm:h-2.5 md:h-3 bg-cyan-400 rounded-full absolute top-0.5 xs:top-1 sm:top-1.5 md:top-2 left-1/2 transform -translate-x-1/2 animate-bounce duration-1000"></div>
            <div className="w-1 xs:w-1.5 sm:w-2 md:w-2.5 h-1 xs:h-1.5 sm:h-2 md:h-2.5 bg-cyan-300 rounded-full absolute top-1.5 xs:top-2 sm:top-3 md:top-4 right-1.5 xs:right-2 sm:right-2.5 md:right-3 animate-bounce delay-150 duration-1200"></div>
            <div className="w-1 xs:w-1.5 sm:w-2 md:w-2.5 h-1 xs:h-1.5 sm:h-2 md:h-2.5 bg-cyan-300 rounded-full absolute top-1.5 xs:top-2 sm:top-3 md:top-4 left-1.5 xs:left-2 sm:left-2.5 md:left-3 animate-bounce delay-300 duration-1400"></div>
          </div>
        </>
      ),
      colSpan: "md:col-span-2 lg:col-span-1"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
      {features.map((feature) => {
        const isActive = activeFeature === feature.id;

        return (
          <div 
            key={feature.id}
            className={`group relative cursor-pointer ${feature.colSpan} touch-manipulation select-none`}
            onMouseEnter={() => onFeatureChange(feature.id)}
            onMouseLeave={() => onFeatureChange(null)}
            onTouchStart={() => onFeatureChange(feature.id)}
            onTouchEnd={() => setTimeout(() => onFeatureChange(null), 2000)}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border rounded-xl xs:rounded-2xl sm:rounded-3xl lg:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-700 ease-out ${
              isActive 
                ? `${feature.colorScheme.border} shadow-2xl ${feature.colorScheme.glow} transform -translate-y-1 xs:-translate-y-2 sm:-translate-y-3 md:-translate-y-4 scale-105 xs:scale-[1.02] sm:scale-[1.03] md:scale-105` 
                : 'border-white/10 hover:border-white/25 active:border-white/40 active:scale-[0.98]'
            }`}>
              
              {/* Enhanced Background Glow */}
              {isActive && (
                <div className={`absolute inset-0 ${feature.colorScheme.glow} rounded-xl xs:rounded-2xl sm:rounded-3xl blur-2xl animate-pulse`}></div>
              )}
              
              <div className="relative z-10">
                {/* Icon - Ultra Responsive */}
                <div className={`w-12 xs:w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 rounded-xl xs:rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 transition-all duration-700 ${
                  isActive
                    ? `${feature.colorScheme.primary} shadow-xl sm:shadow-2xl ${feature.colorScheme.glow} scale-110`
                    : `${feature.colorScheme.secondary} hover:${feature.colorScheme.primary.replace('scale-110', '')}`
                }`}>
                  <div className="relative">
                    {feature.icon}
                  </div>
                </div>

                {/* Content - Ultra Responsive Typography */}
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                  {feature.description}
                </p>
                
                {/* Tech Stack - Perfect Mobile */}
                <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
                  {feature.techStack.map((tech, index) => (
                    <span 
                      key={index}
                      className={`px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 ${feature.colorScheme.tech} text-xs xs:text-xs sm:text-sm md:text-base rounded-full border transition-all duration-300 hover:${feature.colorScheme.tech.replace('/25', '/35')} hover:border-opacity-60`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
