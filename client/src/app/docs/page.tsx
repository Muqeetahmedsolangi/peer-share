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
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'api-reference', title: 'API Reference', icon: '🔌' },
    { id: 'sdk-guides', title: 'SDK Guides', icon: '📚' },
    { id: 'examples', title: 'Examples', icon: '💡' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
    { id: 'changelog', title: 'Changelog', icon: '📝' }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative scroll-smooth overflow-x-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0.1))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300 mb-6 mx-auto"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-none">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              Complete guides and API reference for Dropsos
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-blue-500/20 text-white border border-blue-400/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{section.icon}</span>
                        <span className="font-medium">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8">
                  {content[activeSection as keyof typeof content]?.title}
                </h2>
                
                <div className="space-y-8">
                  {content[activeSection as keyof typeof content]?.content.map((item, index) => (
                    <div
                      key={index}
                      className={`border-l-4 border-blue-500 pl-6 py-4 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* Code Example */}
                {activeSection === 'getting-started' && (
                  <div className="mt-8 bg-slate-900/50 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Start Example</h4>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
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
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
              <p className="text-gray-400 text-sm">Complete API documentation with examples</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
              <p className="text-gray-400 text-sm">Ready-to-use code snippets and examples</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
              <p className="text-gray-400 text-sm">Get help from our community and support team</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Need More Help?</h3>
            <p className="text-gray-300 mb-6">Can&apos;t find what you&apos;re looking for? Our documentation team is here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </a>
              <a href="mailto:docs@dropsos.com" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Email Documentation Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
