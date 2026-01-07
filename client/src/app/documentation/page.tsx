'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Documentation() {
  const router = useRouter();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const docs = [
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      description: 'Learn how to create secure rooms, share files with end-to-end encryption, and use Same WiFi sharing for local peer-to-peer transfers.',
      category: 'Getting Started',
      icon: (
        <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'Creating Your First Secure Room',
            content: 'To create a secure room, navigate to the "Create Room" page. Enter a room name and set a strong password. Once created, you\'ll receive a unique room code that you can share with others. All files shared in this room are protected with AES-256 end-to-end encryption.'
          },
          {
            title: 'Joining a Room',
            content: 'To join an existing room, click "Join Room" and enter the room code provided by the room creator. You\'ll need the room password to access files. All transfers happen directly between devices using WebRTC peer-to-peer technology.'
          },
          {
            title: 'Same WiFi Sharing',
            content: 'For ultra-fast local file sharing, use the "Same WiFi" feature. This allows devices on the same network to discover each other automatically and transfer files without internet connection. Perfect for large files or when you need maximum speed.'
          }
        ]
      }
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation for developers including authentication, WebRTC endpoints, room management, and file transfer APIs.',
      category: 'API',
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'Authentication',
            content: 'All API requests require authentication using API keys. Include your API key in the Authorization header: `Authorization: Bearer YOUR_API_KEY`. API keys can be generated from your account settings.'
          },
          {
            title: 'Base URL',
            content: 'All API requests should be made to: `https://api.dropsos.com/v1`. The API uses RESTful conventions and returns JSON responses.'
          },
          {
            title: 'Creating Rooms via API',
            content: 'POST `/api/rooms` - Create a new secure room. Required parameters: name, password. Returns room code and connection details for WebRTC peer-to-peer setup.'
          },
          {
            title: 'File Transfer Endpoints',
            content: 'POST `/api/files/upload` - Initiate file upload. GET `/api/files/:id` - Retrieve file metadata. All file transfers use WebRTC for direct peer-to-peer connections.'
          }
        ]
      }
    },
    {
      id: 'security',
      title: 'Security & Encryption',
      description: 'Detailed information about AES-256 encryption, zero-server architecture, WebRTC security, and privacy features.',
      category: 'Security',
      icon: (
        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'AES-256 Encryption',
            content: 'All files are encrypted with AES-256 (Advanced Encryption Standard) before transfer. This military-grade encryption ensures your data is protected from source to destination. Encryption keys are generated client-side and never transmitted to our servers.'
          },
          {
            title: 'Zero-Server Architecture',
            content: 'Dropsos uses a zero-server architecture for file storage. Files transfer directly between devices using WebRTC peer-to-peer technology. We never store, log, or access your files, ensuring complete privacy.'
          },
          {
            title: 'WebRTC Security',
            content: 'WebRTC connections use DTLS (Datagram Transport Layer Security) for encryption and SRTP (Secure Real-time Transport Protocol) for media streams. All peer-to-peer connections are secured end-to-end.'
          },
          {
            title: 'Privacy Guarantees',
            content: 'We maintain zero-knowledge architecture. Room passwords and encryption keys are never stored on our servers. Only room metadata (room codes, connection status) is temporarily stored for signaling purposes.'
          }
        ]
      }
    },
    {
      id: 'webrtc',
      title: 'WebRTC Integration',
      description: 'Technical guides for integrating WebRTC peer-to-peer technology, connection establishment, and file transfer protocols.',
      category: 'Technical',
      icon: (
        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'Connection Establishment',
            content: 'WebRTC connections are established through a signaling server that exchanges SDP (Session Description Protocol) offers and answers. Once connected, data flows directly between peers without server intervention.'
          },
          {
            title: 'Data Channels',
            content: 'File transfers use WebRTC Data Channels for reliable, ordered delivery of file chunks. Data channels support both reliable and unreliable transmission modes depending on your use case.'
          },
          {
            title: 'NAT Traversal',
            content: 'WebRTC uses ICE (Interactive Connectivity Establishment) for NAT traversal. STUN servers help discover public IP addresses, while TURN servers provide relay services when direct connections fail.'
          },
          {
            title: 'File Chunking',
            content: 'Large files are automatically chunked into smaller pieces for efficient transfer. Each chunk is encrypted independently and reassembled on the receiving end.'
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions for connection problems, file transfer errors, WebRTC issues, and peer-to-peer connection troubleshooting.',
      category: 'Troubleshooting',
      icon: (
        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'Connection Issues',
            content: 'If you\'re unable to connect to a room, check your internet connection and firewall settings. WebRTC requires UDP ports to be open. Try refreshing the page or creating a new room if the issue persists.'
          },
          {
            title: 'File Transfer Failures',
            content: 'If file transfers fail, ensure both devices are online and have stable connections. Large files may take time to transfer. Check browser console for error messages and ensure WebRTC is supported in your browser.'
          },
          {
            title: 'Same WiFi Not Working',
            content: 'For Same WiFi sharing, ensure both devices are on the same network. Some routers have client isolation enabled which prevents device-to-device communication. Check your router settings if discovery fails.'
          },
          {
            title: 'Browser Compatibility',
            content: 'Dropsos requires modern browsers with WebRTC support. Chrome, Firefox, Edge, and Safari (iOS 11+) are fully supported. Ensure your browser is up to date for the best experience.'
          }
        ]
      }
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      description: 'Recommended practices for secure file sharing, room management, encryption usage, and optimizing peer-to-peer transfers.',
      category: 'Guides',
      icon: (
        <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: {
        sections: [
          {
            title: 'Room Security',
            content: 'Always use strong, unique passwords for your rooms. Share room codes through secure channels. Consider using temporary rooms for one-time file sharing and deleting them after use.'
          },
          {
            title: 'File Organization',
            content: 'Organize files before sharing to reduce transfer time. Compress large directories when possible. Use descriptive file names to help recipients identify content quickly.'
          },
          {
            title: 'Network Optimization',
            content: 'For best performance, use wired connections when transferring large files. Ensure sufficient bandwidth is available. Close unnecessary applications that may consume network resources.'
          },
          {
            title: 'Privacy Considerations',
            content: 'Remember that room codes provide access to all files in a room. Only share codes with trusted recipients. Consider creating separate rooms for different groups or purposes.'
          }
        ]
      }
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 sm:mb-8"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Documentation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Complete guides, API reference, and technical documentation for secure file sharing and peer-to-peer transfers
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn how to use Dropsos for secure file sharing, integrate our API, understand encryption, and implement peer-to-peer 
              file transfers with WebRTC technology.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Cards */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Documentation Topics
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Browse comprehensive guides and technical resources for secure file sharing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:border-orange-500 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {doc.icon}
                </div>
                <div className="mb-2">
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">{doc.category}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{doc.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{doc.description}</p>
                <div className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors text-sm sm:text-base">
                  {selectedDoc === doc.id ? 'Hide Details' : 'View Details'}
                  <svg className={`w-4 h-4 transition-transform ${selectedDoc === doc.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Content */}
          {selectedDoc && (
            <div className="mt-10 sm:mt-12">
              {docs
                .filter(doc => doc.id === selectedDoc)
                .map((doc) => (
                  <div key={doc.id} className="bg-white border-2 border-orange-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{doc.title}</h3>
                      <button
                        onClick={() => setSelectedDoc(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-6">
                      {doc.content.sections.map((section, index) => (
                        <div key={index} className="border-l-4 border-orange-500 pl-6">
                          <h4 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h4>
                          <p className="text-base text-gray-600 leading-relaxed">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Code Examples
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Quick start code snippets for common integration scenarios
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Room (JavaScript)</h3>
              <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                <code className="text-gray-800">{`const response = await fetch(
  'https://api.dropsos.com/v1/rooms',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'My Secure Room',
      password: 'secure-password'
    })
  }
);
const room = await response.json();`}</code>
              </pre>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">WebRTC Connection</h3>
              <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                <code className="text-gray-800">{`const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.dropsos.com' },
    { urls: 'turn:turn.dropsos.com' }
  ]
});

peerConnection.ondatachannel = (event) => {
  const channel = event.channel;
  channel.onmessage = (event) => {
    // Handle file chunks
  };
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Access additional resources and support for secure file sharing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              href="/help"
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Help Center</h3>
              <p className="text-xs text-gray-600">FAQs & Support</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Contact Us</h3>
              <p className="text-xs text-gray-600">Get Support</p>
            </Link>

            <Link
              href="/status"
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">System Status</h3>
              <p className="text-xs text-gray-600">Service Health</p>
            </Link>

            <Link
              href="/support"
              className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Support</h3>
              <p className="text-xs text-gray-600">Get Help</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Need More Help?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact our support team for assistance with documentation and technical questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
            >
              Browse Help Center
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
