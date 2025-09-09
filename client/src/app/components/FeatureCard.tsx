'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  activeFeature: number | null;
  onFeatureChange: (id: number | null) => void;
}

export default function FeatureCard({ activeFeature, onFeatureChange }: FeatureCardProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFeatureClick = (featureId: number) => {
    if (featureId === 0) { // Create Room feature
      router.push('/create-room');
    } else if (featureId === 1) { // Same WiFi feature
      router.push('/same-wifi');
    } else if (featureId === 2) { // Security feature
      router.push('/security');
    }
  };

  // Professional Feature data with clean design
  const features = [
    {
      id: 0,
      title: "Create Room",
      subtitle: "Secure Private Sharing",
      description: "Deploy secure file rooms with enterprise-grade authentication and access controls for teams and businesses.",
      techStack: ["WebRTC", "GraphQL", "Socket.IO"],
      colorScheme: {
        primary: "bg-blue-600",
        secondary: "bg-blue-600/90 hover:bg-blue-500",
        glow: "shadow-blue-500/25",
        border: "border-blue-500/30",
        tech: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        accent: "text-blue-400"
      },
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      colSpan: "md:col-span-1"
    },
    {
      id: 1,
      title: "Same WiFi",
      subtitle: "Lightning Fast Local",
      description: "Zero-configuration local network discovery with ultra-low latency for maximum speed file sharing.",
      techStack: ["mDNS", "P2P", "STUN"],
      colorScheme: {
        primary: "bg-purple-600",
        secondary: "bg-purple-600/90 hover:bg-purple-500",
        glow: "shadow-purple-500/25",
        border: "border-purple-500/30",
        tech: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        accent: "text-purple-400"
      },
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      colSpan: "md:col-span-1"
    },
    {
      id: 2,
      title: "Military Security",
      subtitle: "AES-256 Encrypted",
      description: "Military-grade end-to-end encryption with perfect forward secrecy and quantum-resistant algorithms.",
      techStack: ["AES-256", "DTLS", "SRTP"],
      colorScheme: {
        primary: "bg-emerald-600",
        secondary: "bg-emerald-600/90 hover:bg-emerald-500",
        glow: "shadow-emerald-500/25",
        border: "border-emerald-500/30",
        tech: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        accent: "text-emerald-400"
      },
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      colSpan: "md:col-span-2 lg:col-span-1"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const isActive = activeFeature === feature.id;

        return (
          <div 
            key={feature.id}
            className={`group relative cursor-pointer ${feature.colSpan} transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onMouseEnter={() => onFeatureChange(feature.id)}
            onMouseLeave={() => onFeatureChange(null)}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <div className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
              isActive 
                ? `${feature.colorScheme.border} shadow-xl ${feature.colorScheme.glow} transform -translate-y-2` 
                : 'border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-slate-500/10'
            }`}>
              
              <div className="relative z-10">
                {/* Professional Icon */}
                <div className={`w-16 h-16 ${feature.colorScheme.primary} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isActive
                    ? `${feature.colorScheme.glow} scale-105`
                    : 'group-hover:scale-105'
                }`}>
                  {feature.icon}
                </div>

                {/* Clean Typography */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className={`text-sm font-medium ${feature.colorScheme.accent} mb-4`}>
                    {feature.subtitle}
                  </p>
                </div>
                
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Professional Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {feature.techStack.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className={`px-3 py-1 ${feature.colorScheme.tech} text-xs font-medium rounded-md border transition-all duration-200 hover:opacity-80`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Clean Call to Action */}
                <div className="flex items-center justify-between">
                  <button className={`px-6 py-3 ${feature.colorScheme.primary} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 ${feature.colorScheme.glow}`}>
                    Get Started
                  </button>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-200">
                    <span className="text-sm font-medium mr-2">Learn More</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
