'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  activeFeature: number | null;
  onFeatureChange: (id: number | null) => void;
}

export default function FeatureCard({ activeFeature, onFeatureChange }: FeatureCardProps) {
  const router = useRouter();

  const handleFeatureClick = (featureId: number) => {
    if (featureId === 0) {
      router.push('/create-room');
    } else if (featureId === 1) {
      router.push('/same-wifi');
    }
  };

  const features = [
    {
      id: 0,
      title: "Create Secure Room",
      subtitle: "Password-Protected Sharing",
      description: "Create encrypted rooms with unique access codes for secure file sharing. Perfect for teams, clients, and private collaborations. All transfers use end-to-end encryption with no data saved on servers.",
      benefits: [
        "Password-protected access",
        "End-to-end encryption",
        "No data saved anywhere",
        "Unlimited file sizes"
      ],
      techStack: ["WebRTC", "Socket.IO", "AES-256"],
      icon: (
        <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: 1,
      title: "Same WiFi",
      subtitle: "Lightning-Fast Local Transfer",
      description: "Share files instantly on the same WiFi network with zero configuration. Automatic device discovery ensures seamless connections. Files transfer directly between devices with no internet required.",
      benefits: [
        "Automatic device discovery",
        "No internet required",
        "No data saved on servers",
        "Zero configuration needed"
      ],
      techStack: ["mDNS", "Direct Transfer", "Same WiFi"],
      icon: (
        <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      ),
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {features.map((feature) => {
        const isActive = activeFeature === feature.id;

        return (
          <div 
            key={feature.id}
            className={`group relative cursor-pointer bg-white border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
              isActive 
                ? 'border-orange-500 shadow-lg shadow-orange-500/10' 
                : 'border-gray-200 hover:border-orange-400 hover:shadow-md'
            }`}
            onMouseEnter={() => onFeatureChange(feature.id)}
            onMouseLeave={() => onFeatureChange(null)}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-md ${
                isActive ? 'scale-105' : 'group-hover:scale-105'
              }`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  {feature.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-orange-500">
                  {feature.subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">
              {feature.description}
            </p>

            <div className="mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
              {feature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
              {feature.techStack.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded border border-orange-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <button className="w-full px-4 py-2 sm:py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all text-xs sm:text-sm">
              Get Started
            </button>
          </div>
        );
      })}
    </div>
  );
}
