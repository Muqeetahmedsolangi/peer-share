'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Documentation() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { 
      id: 'getting-started', 
      title: 'Getting Started', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 'api-reference', 
      title: 'API Reference', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    { 
      id: 'sdk-guides', 
      title: 'SDK Guides', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'examples', 
      title: 'Examples', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      id: 'troubleshooting', 
      title: 'Troubleshooting', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'changelog', 
      title: 'Changelog', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const content = {
    'getting-started': {
      title: 'Getting Started with Dropsos',
      content: [
        {
          title: 'Installation',
          content: 'Install Dropsos using npm or yarn: `npm install dropsos` or `yarn add dropsos`'
        },
        {
          title: 'Basic Setup',
          content: 'Initialize Dropsos in your application with your API key and configuration options.'
        },
        {
          title: 'Creating Your First Room',
          content: 'Learn how to create secure rooms for file sharing and collaboration.'
        },
        {
          title: 'Joining Rooms',
          content: 'Discover how users can join existing rooms using room codes.'
        }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      content: [
        {
          title: 'Authentication',
          content: 'Learn about API authentication methods and security best practices.'
        },
        {
          title: 'Room Management',
          content: 'Complete API reference for creating, managing, and deleting rooms.'
        },
        {
          title: 'File Operations',
          content: 'API endpoints for file upload, download, and sharing operations.'
        },
        {
          title: 'WebSocket Events',
          content: 'Real-time events and WebSocket API documentation.'
        }
      ]
    },
    'sdk-guides': {
      title: 'SDK Guides',
      content: [
        {
          title: 'JavaScript SDK',
          content: 'Complete guide to using the Dropsos JavaScript SDK in web applications.'
        },
        {
          title: 'React Integration',
          content: 'Step-by-step guide to integrating Dropsos with React applications.'
        },
        {
          title: 'Node.js SDK',
          content: 'Server-side integration using the Dropsos Node.js SDK.'
        },
        {
          title: 'Mobile SDKs',
          content: 'iOS and Android SDK documentation for mobile app integration.'
        }
      ]
    },
    'examples': {
      title: 'Code Examples',
      content: [
        {
          title: 'Basic File Sharing',
          content: 'Simple example of implementing file sharing between two users.'
        },
        {
          title: 'Room Management',
          content: 'Advanced example showing room creation, user management, and permissions.'
        },
        {
          title: 'Real-time Chat',
          content: 'Implementing real-time messaging alongside file sharing.'
        },
        {
          title: 'Custom UI Components',
          content: 'Building custom UI components for file sharing interfaces.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      content: [
        {
          title: 'Common Issues',
          content: 'Solutions to frequently encountered problems and error messages.'
        },
        {
          title: 'Connection Problems',
          content: 'Troubleshooting network connectivity and peer-to-peer connection issues.'
        },
        {
          title: 'Performance Optimization',
          content: 'Tips for optimizing file transfer speeds and application performance.'
        },
        {
          title: 'Debug Mode',
          content: 'Using debug mode and logging to diagnose issues.'
        }
      ]
    },
    'changelog': {
      title: 'Changelog',
      content: [
        {
          title: 'Version 1.2.0',
          content: 'Added support for video streaming, improved encryption, and new mobile SDKs.'
        },
        {
          title: 'Version 1.1.0',
          content: 'Enhanced file sharing performance and added real-time collaboration features.'
        },
        {
          title: 'Version 1.0.0',
          content: 'Initial release with core file sharing and room management features.'
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 mb-6 sm:mb-8"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 tracking-tight leading-none text-gray-900">
              Documentation
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
              Complete guides and API reference for Dropsos
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-orange-50 text-orange-700 border-2 border-orange-200'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          activeSection === section.id ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {section.icon}
                        </div>
                        <span className="font-medium text-sm sm:text-base">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                  {content[activeSection as keyof typeof content]?.title}
                </h2>
                
                <div className="space-y-6 sm:space-y-8">
                  {content[activeSection as keyof typeof content]?.content.map((item, index) => (
                    <div
                      key={index}
                      className={`border-l-4 border-orange-500 pl-5 sm:pl-6 py-4 bg-orange-50/30 rounded-r-lg ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* Code Example */}
                {activeSection === 'getting-started' && (
                  <div className="mt-8 bg-gray-50 border-2 border-gray-200 rounded-xl p-5 sm:p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Example</h4>
                    <pre className="text-xs sm:text-sm text-gray-800 overflow-x-auto bg-white border-2 border-gray-200 rounded-lg p-4">
                      <code>{`// Initialize Dropsos
import { Dropsos } from 'dropsos';

const dropsos = new Dropsos({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create a room
const room = await dropsos.createRoom({
  name: 'My Room',
  password: 'secure-password'
});

console.log('Room created:', room.code);`}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 sm:mt-16 grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-orange-300 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
              <p className="text-gray-600 text-sm">Complete API documentation with examples</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-orange-300 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Examples</h3>
              <p className="text-gray-600 text-sm">Ready-to-use code snippets and examples</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-orange-300 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">Get help from our community and support team</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 sm:mt-16 bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h3>
            <p className="text-gray-700 mb-6">Can&apos;t find what you&apos;re looking for? Our documentation team is here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                Contact Us
              </a>
              <a href="mailto:docs@dropsos.com" className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-orange-300 transition-all duration-300">
                Email Documentation Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
