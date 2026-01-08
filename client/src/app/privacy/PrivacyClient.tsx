'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyClient() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'data-collection', title: 'Data Collection', icon: '📊' },
    { id: 'data-usage', title: 'Data Usage', icon: '🔍' },
    { id: 'data-sharing', title: 'Data Sharing', icon: '🤝' },
    { id: 'data-security', title: 'Data Security', icon: '🔒' },
    { id: 'your-rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies', icon: '🍪' },
    { id: 'changes', title: 'Policy Changes', icon: '📝' }
  ];

  const content = {
    overview: {
      title: 'Privacy Policy Overview',
      lastUpdated: 'January 1, 2024',
      content: [
        {
          title: 'Our Commitment',
          text: 'At Dropsos, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our file sharing services.'
        },
        {
          title: 'Scope of This Policy',
          text: 'This Privacy Policy applies to all users of Dropsos services, including our website, mobile applications, and file sharing platform. By using our services, you agree to the collection and use of information in accordance with this policy.'
        },
        {
          title: 'Contact Information',
          text: 'If you have any questions about this Privacy Policy, please contact us at privacy@dropsos.com or through our contact form.'
        }
      ]
    },
    'data-collection': {
      title: 'Data Collection',
      content: [
        {
          title: 'Information You Provide',
          text: 'We collect information you directly provide to us, including: Account information (name, email address), Room creation and participation data, File metadata (names, sizes, types), Communication preferences, and Support requests.'
        },
        {
          title: 'Information We Collect Automatically',
          text: 'We automatically collect certain information when you use our services: Usage data and analytics, Device information, IP addresses, Browser type and version, Operating system, and Performance metrics.'
        },
        {
          title: 'File Content',
          text: 'Important: We do not store the actual content of your files. All file sharing happens peer-to-peer, and files are never uploaded to our servers. We only collect metadata about files for functionality purposes.'
        }
      ]
    },
    'data-usage': {
      title: 'How We Use Your Data',
      content: [
        {
          title: 'Service Provision',
          text: 'We use your information to: Provide and maintain our file sharing services, Process room creation and management, Enable peer-to-peer connections, and Deliver customer support.'
        },
        {
          title: 'Communication',
          text: 'We may use your contact information to: Send service-related notifications, Provide technical support, Share important updates about our services, and Respond to your inquiries.'
        },
        {
          title: 'Improvement and Analytics',
          text: 'We use aggregated, anonymized data to: Improve our services and user experience, Analyze usage patterns, Develop new features, and Monitor system performance.'
        }
      ]
    },
    'data-sharing': {
      title: 'Data Sharing and Disclosure',
      content: [
        {
          title: 'We Do Not Sell Your Data',
          text: 'We do not sell, trade, or rent your personal information to third parties for marketing purposes. Your privacy is our priority.'
        },
        {
          title: 'Limited Sharing',
          text: 'We may share your information only in these limited circumstances: With your explicit consent, To comply with legal obligations, To protect our rights and safety, and With trusted service providers (under strict confidentiality agreements).'
        },
        {
          title: 'Peer-to-Peer Sharing',
          text: 'When you share files through our platform, the files are shared directly between devices. We facilitate the connection but do not have access to the file content.'
        }
      ]
    },
    'data-security': {
      title: 'Data Security',
      content: [
        {
          title: 'Encryption',
          text: 'We implement industry-standard encryption to protect your data: End-to-end encryption for file transfers, TLS encryption for data in transit, and Encrypted storage for sensitive information.'
        },
        {
          title: 'Access Controls',
          text: 'We maintain strict access controls: Limited access to personal data, Regular security audits, Employee training on data protection, and Multi-factor authentication for administrative access.'
        },
        {
          title: 'Infrastructure Security',
          text: 'Our infrastructure is designed with security in mind: Secure data centers, Regular security updates, Network monitoring, and Incident response procedures.'
        }
      ]
    },
    'your-rights': {
      title: 'Your Rights and Choices',
      content: [
        {
          title: 'Access and Portability',
          text: 'You have the right to: Access your personal data, Request a copy of your data, and Export your data in a portable format.'
        },
        {
          title: 'Correction and Deletion',
          text: 'You can: Correct inaccurate information, Update your account details, and Request deletion of your data (subject to legal requirements).'
        },
        {
          title: 'Communication Preferences',
          text: 'You can: Opt out of marketing communications, Choose notification preferences, and Unsubscribe from emails at any time.'
        }
      ]
    },
    cookies: {
      title: 'Cookies and Tracking',
      content: [
        {
          title: 'Types of Cookies',
          text: 'We use different types of cookies: Essential cookies (required for functionality), Analytics cookies (to understand usage), and Preference cookies (to remember your settings).'
        },
        {
          title: 'Cookie Management',
          text: 'You can: Control cookie settings in your browser, Delete cookies at any time, and Opt out of non-essential cookies.'
        },
        {
          title: 'Third-Party Services',
          text: 'We may use third-party services for analytics and functionality, but we ensure they comply with privacy standards and do not collect personal information without consent.'
        }
      ]
    },
    changes: {
      title: 'Policy Changes',
      content: [
        {
          title: 'Updates to This Policy',
          text: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by: Posting the updated policy on our website, Sending email notifications, and Updating the "Last Updated" date.'
        },
        {
          title: 'Your Continued Use',
          text: 'Continued use of our services after policy changes constitutes acceptance of the updated policy. We encourage you to review this policy periodically.'
        },
        {
          title: 'Contact Us',
          text: 'If you have questions about changes to this policy, please contact us at privacy@dropsos.com.'
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
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {content.overview.lastUpdated}
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
                      className={`${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Key Points Highlight */}
                {activeSection === 'overview' && (
                  <div className="mt-8 bg-blue-500/10 border border-blue-400/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-blue-400 mb-4">Key Privacy Points</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>We never store your file content</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>All file sharing is peer-to-peer</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>End-to-end encryption for all transfers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>We don&apos;t sell your data to third parties</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h3>
            <p className="text-gray-300 mb-6">We&apos;re here to help with any privacy-related questions or concerns</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </a>
              <a href="mailto:privacy@dropsos.com" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Email Privacy Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







