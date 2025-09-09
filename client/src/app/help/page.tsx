'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HelpCenter() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'features', name: 'Features', icon: '⚡' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'billing', name: 'Billing', icon: '💳' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first room?',
      answer: 'Creating a room is simple! Click on "Create Room" in the navigation, enter a room name and password, then click "Create Room". You\'ll get a unique room code that others can use to join.',
      popular: true
    },
    {
      id: 2,
      category: 'features',
      question: 'What file types can I share?',
      answer: 'Dropsos supports all file types including documents, images, videos, audio files, and more. There are no file type restrictions for secure peer-to-peer sharing.',
      popular: true
    },
    {
      id: 3,
      category: 'security',
      question: 'How secure is my data?',
      answer: 'Your data is protected with military-grade end-to-end encryption. Files are shared directly between devices without passing through our servers, ensuring maximum privacy and security.',
      popular: true
    },
    {
      id: 4,
      category: 'troubleshooting',
      question: 'Why can\'t I connect to a room?',
      answer: 'Check your internet connection and ensure the room code is correct. If you\'re still having issues, try refreshing the page or creating a new room.',
      popular: false
    },
    {
      id: 5,
      category: 'features',
      question: 'Can I share files on the same WiFi network?',
      answer: 'Yes! Use the "Same WiFi" feature for ultra-fast local file sharing. This works even without internet connection when devices are on the same network.',
      popular: false
    },
    {
      id: 6,
      category: 'security',
      question: 'Are my files stored on your servers?',
      answer: 'No, we never store your files. All sharing happens directly between devices using peer-to-peer technology, ensuring your data never touches our servers.',
      popular: false
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative scroll-smooth overflow-x-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0.1))]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${
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
                Help Center
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              Find answers to common questions and get help with Dropsos
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full px-6 py-4 pl-14 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="grid gap-6">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
                          {faq.popular && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
            <p className="text-gray-300 mb-6">Can&apos;t find what you&apos;re looking for? Our support team is here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                Contact Support
              </a>
              <a href="mailto:support@dropsos.com" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
