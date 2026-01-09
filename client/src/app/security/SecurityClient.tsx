'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecurityClient() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { 
      id: 'overview', 
      title: 'Security Overview', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      id: 'encryption', 
      title: 'Encryption', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      id: 'data-protection', 
      title: 'Data Protection', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      id: 'infrastructure', 
      title: 'Infrastructure', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'compliance', 
      title: 'Compliance', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'best-practices', 
      title: 'Best Practices', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'incident-response', 
      title: 'Incident Response', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    { 
      id: 'reporting', 
      title: 'Security Reporting', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    }
  ];

  const content = {
    overview: {
      title: 'Security Overview',
      content: [
        {
          title: 'Our Security Commitment',
          text: 'At Dropsos, security is our top priority. We implement industry-leading security measures to protect your data and ensure the privacy of your file sharing activities. Our security-first approach means your files are protected at every step of the process.'
        },
        {
          title: 'Zero-Knowledge Architecture',
          text: 'We operate on a zero-knowledge principle, meaning we never have access to your file content. All files are shared directly between devices using peer-to-peer technology, ensuring your data never touches our servers.'
        },
        {
          title: 'End-to-End Encryption',
          text: 'Every file transfer is protected with military-grade encryption. Files are encrypted on your device before transmission and can only be decrypted by the intended recipient, ensuring complete privacy and security.'
        }
      ]
    },
    encryption: {
      title: 'Encryption Standards',
      content: [
        {
          title: 'AES-256 Encryption',
          text: 'We use AES-256 encryption, the same standard used by banks and government agencies. This provides 256-bit key length, making it virtually impossible to break through brute force attacks.'
        },
        {
          title: 'Perfect Forward Secrecy',
          text: 'Each file transfer uses unique encryption keys that are generated for that specific session. Even if one transfer is compromised, all other transfers remain secure with their own unique keys.'
        },
        {
          title: 'TLS 1.3 for Communication',
          text: 'All communication between devices and our servers uses TLS 1.3, the latest and most secure version of the Transport Layer Security protocol, ensuring your data is protected in transit.'
        },
        {
          title: 'Key Management',
          text: 'Encryption keys are generated using cryptographically secure random number generators and are never stored in plain text. Keys are automatically rotated and destroyed after use.'
        }
      ]
    },
    'data-protection': {
      title: 'Data Protection Measures',
      content: [
        {
          title: 'No File Storage',
          text: 'We never store your files on our servers. All file sharing happens directly between devices, ensuring your data remains under your control at all times.'
        },
        {
          title: 'Minimal Data Collection',
          text: 'We collect only the minimum amount of data necessary to provide our services. This includes basic account information and file metadata (names, sizes, types) but never the actual file content.'
        },
        {
          title: 'Data Anonymization',
          text: 'Any data we do collect is anonymized and aggregated to protect your privacy. We use this data only to improve our services and cannot identify individual users from this information.'
        },
        {
          title: 'Secure Deletion',
          text: 'When you delete files or close rooms, all associated metadata is permanently and securely deleted from our systems using cryptographic erasure methods.'
        }
      ]
    },
    infrastructure: {
      title: 'Infrastructure Security',
      content: [
        {
          title: 'Secure Data Centers',
          text: 'Our infrastructure is hosted in SOC 2 Type II certified data centers with 24/7 physical security, biometric access controls, and environmental monitoring.'
        },
        {
          title: 'Network Security',
          text: 'We implement multiple layers of network security including firewalls, intrusion detection systems, and DDoS protection to safeguard our infrastructure from external threats.'
        },
        {
          title: 'Regular Security Audits',
          text: 'We conduct regular security audits and penetration testing by independent third-party security firms to identify and address potential vulnerabilities.'
        },
        {
          title: 'Security Monitoring',
          text: 'Our systems are monitored 24/7 by our security team using advanced threat detection and response tools to identify and mitigate security incidents in real-time.'
        }
      ]
    },
    compliance: {
      title: 'Compliance and Certifications',
      content: [
        {
          title: 'SOC 2 Type II',
          text: 'We are SOC 2 Type II compliant, demonstrating our commitment to security, availability, processing integrity, confidentiality, and privacy of customer data.'
        },
        {
          title: 'GDPR Compliance',
          text: 'We fully comply with the General Data Protection Regulation (GDPR), ensuring your data protection rights are respected and your privacy is protected according to EU standards.'
        },
        {
          title: 'CCPA Compliance',
          text: 'We comply with the California Consumer Privacy Act (CCPA), providing California residents with specific rights regarding their personal information.'
        },
        {
          title: 'Industry Standards',
          text: 'We follow industry best practices and standards including OWASP guidelines, NIST cybersecurity framework, and ISO 27001 security management standards.'
        }
      ]
    },
    'best-practices': {
      title: 'Security Best Practices',
      content: [
        {
          title: 'For Users',
          text: 'Use strong, unique passwords for your account. Enable two-factor authentication when available. Only share files with trusted recipients. Keep your devices and software updated. Be cautious of phishing attempts.'
        },
        {
          title: 'For Organizations',
          text: 'Implement proper access controls and user management. Regular security training for employees. Monitor and audit file sharing activities. Use endpoint protection software. Establish clear data handling policies.'
        },
        {
          title: 'File Sharing Guidelines',
          text: 'Verify recipient identities before sharing sensitive files. Use descriptive file names that don\'t reveal sensitive information. Regularly review and clean up old shared files. Report any suspicious activities immediately.'
        }
      ]
    },
    'incident-response': {
      title: 'Incident Response',
      content: [
        {
          title: '24/7 Security Team',
          text: 'Our dedicated security team monitors our systems around the clock and responds to security incidents within minutes of detection.'
        },
        {
          title: 'Incident Response Plan',
          text: 'We have a comprehensive incident response plan that includes immediate containment, investigation, notification procedures, and recovery steps to minimize impact.'
        },
        {
          title: 'User Notification',
          text: 'In the event of a security incident that may affect users, we will notify affected users within 24 hours and provide regular updates on our response efforts.'
        },
        {
          title: 'Post-Incident Review',
          text: 'After any security incident, we conduct a thorough post-incident review to identify lessons learned and implement improvements to prevent similar incidents.'
        }
      ]
    },
    reporting: {
      title: 'Security Reporting',
      content: [
        {
          title: 'Vulnerability Disclosure',
          text: 'We encourage security researchers to responsibly disclose vulnerabilities through our coordinated disclosure program. We appreciate your help in keeping our platform secure.'
        },
        {
          title: 'How to Report',
          text: 'Report security vulnerabilities to security@dropsos.com. Include detailed information about the vulnerability, steps to reproduce, and any proof-of-concept code.'
        },
        {
          title: 'Response Timeline',
          text: 'We will acknowledge your report within 24 hours and provide regular updates on our investigation and remediation progress.'
        },
        {
          title: 'Recognition',
          text: 'We recognize security researchers who help us improve our security through our responsible disclosure program and may offer rewards for significant vulnerabilities.'
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
              Security
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
              Comprehensive security measures to protect your data and privacy
            </p>
          </div>

          {/* Security Badges */}
          <div className="grid md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-green-300 transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AES-256 Encryption</h3>
              <p className="text-gray-600 text-sm">Military-grade encryption</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-orange-300 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-gray-600 text-sm">Certified compliance</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-orange-300 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero-Knowledge</h3>
              <p className="text-gray-600 text-sm">We can&apos;t see your files</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 text-center shadow-sm hover:border-green-300 transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Privacy protected</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Topics</h3>
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
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Security Features Highlight */}
                {activeSection === 'overview' && (
                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 sm:p-6">
                      <h4 className="text-lg font-semibold text-green-700 mb-3">What We Protect</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>File content and metadata</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>User communications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Account information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Network communications</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 sm:p-6">
                      <h4 className="text-lg font-semibold text-orange-700 mb-3">Security Guarantees</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Files never stored on our servers</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>End-to-end encryption for all transfers</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Zero-knowledge architecture</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Regular security audits</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Contact */}
          <div className="mt-12 sm:mt-16 bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Report Security Issues</h3>
            <p className="text-gray-700 mb-6">Help us keep Dropsos secure by reporting vulnerabilities or security concerns</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:security@dropsos.com" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                Report Vulnerability
              </a>
              <a href="/contact" className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-orange-300 transition-all duration-300">
                Contact Security Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

