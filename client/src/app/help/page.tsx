'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HelpCenter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      question: 'How do I create my first secure room?',
      answer: 'Creating a secure room is simple! Click on "Create Room" in the navigation, enter a room name and password, then click "Create Room". You\'ll get a unique room code that others can use to join. All files shared in the room are protected with AES-256 end-to-end encryption.',
      popular: true
    },
    {
      id: 2,
      category: 'features',
      question: 'What file types can I share with Dropsos?',
      answer: 'Dropsos supports all file types including documents, images, videos, audio files, archives, and more. There are no file type restrictions for secure peer-to-peer sharing. You can transfer files of any size without limitations.',
      popular: true
    },
    {
      id: 3,
      category: 'security',
      question: 'How secure is my data with Dropsos?',
      answer: 'Your data is protected with military-grade AES-256 end-to-end encryption. Files are shared directly between devices using WebRTC peer-to-peer technology without passing through our servers, ensuring maximum privacy and security. We never store, log, or access your files.',
      popular: true
    },
    {
      id: 4,
      category: 'troubleshooting',
      question: 'Why can\'t I connect to a secure room?',
      answer: 'Check your internet connection and ensure the room code is correct. If you\'re still having issues, try refreshing the page or creating a new room. For WebRTC connection problems, ensure your firewall allows peer-to-peer connections.',
      popular: false
    },
    {
      id: 5,
      category: 'features',
      question: 'Can I share files on the same WiFi network?',
      answer: 'Yes! Use the "Same WiFi" feature for ultra-fast local file sharing. This works even without internet connection when devices are on the same network. Files transfer directly between devices using local network discovery.',
      popular: false
    },
    {
      id: 6,
      category: 'security',
      question: 'Are my files stored on your servers?',
      answer: 'No, we never store your files. All sharing happens directly between devices using peer-to-peer technology, ensuring your data never touches our servers. This zero-server architecture guarantees complete privacy.',
      popular: false
    },
    {
      id: 7,
      category: 'getting-started',
      question: 'Do I need to create an account to use Dropsos?',
      answer: 'No account registration is required! You can start sharing files immediately by creating a secure room or using Same WiFi sharing. All features are available without creating an account.',
      popular: false
    },
    {
      id: 8,
      category: 'features',
      question: 'What is the maximum file size I can share?',
      answer: 'Dropsos supports unlimited file sizes. There are no upload limits or download caps. You can share large videos, datasets, entire project folders, or any file size instantly using our peer-to-peer technology.',
      popular: false
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              Help <span className="text-orange-500">Center</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Find answers to common questions about secure file sharing, encryption, and peer-to-peer transfers
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
              />
              <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
            {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{faq.question}</h3>
                        {faq.popular && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Still need help?</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help with secure file sharing questions!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@dropsos.com"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
