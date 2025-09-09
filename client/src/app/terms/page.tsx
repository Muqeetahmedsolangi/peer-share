'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsOfService() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: '✅' },
    { id: 'description', title: 'Service Description', icon: '📋' },
    { id: 'user-accounts', title: 'User Accounts', icon: '👤' },
    { id: 'acceptable-use', title: 'Acceptable Use', icon: '⚖️' },
    { id: 'prohibited-uses', title: 'Prohibited Uses', icon: '🚫' },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: '💡' },
    { id: 'privacy', title: 'Privacy', icon: '🔒' },
    { id: 'disclaimers', title: 'Disclaimers', icon: '⚠️' },
    { id: 'limitation-liability', title: 'Limitation of Liability', icon: '🛡️' },
    { id: 'termination', title: 'Termination', icon: '🔚' },
    { id: 'governing-law', title: 'Governing Law', icon: '⚖️' },
    { id: 'changes', title: 'Changes to Terms', icon: '📝' }
  ];

  const content = {
    acceptance: {
      title: 'Acceptance of Terms',
      lastUpdated: 'January 1, 2024',
      content: [
        {
          title: 'Agreement to Terms',
          text: 'By accessing and using Dropsos services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
        },
        {
          title: 'Eligibility',
          text: 'You must be at least 18 years old to use our services. By using our services, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into this agreement.'
        },
        {
          title: 'Updates to Terms',
          text: 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms on our website. Your continued use of our services constitutes acceptance of the modified terms.'
        }
      ]
    },
    description: {
      title: 'Service Description',
      content: [
        {
          title: 'What We Provide',
          text: 'Dropsos is a peer-to-peer file sharing platform that enables secure, encrypted file transfers between users. Our service facilitates direct connections between devices without storing files on our servers.'
        },
        {
          title: 'Core Features',
          text: 'Our platform includes: Secure file sharing between devices, Real-time chat and communication, Room-based collaboration, End-to-end encryption, and Cross-platform compatibility.'
        },
        {
          title: 'Service Availability',
          text: 'We strive to maintain high service availability but cannot guarantee uninterrupted access. We may perform maintenance, updates, or modifications that temporarily affect service availability.'
        }
      ]
    },
    'user-accounts': {
      title: 'User Accounts',
      content: [
        {
          title: 'Account Creation',
          text: 'To use certain features of our service, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        },
        {
          title: 'Account Information',
          text: 'You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.'
        },
        {
          title: 'Account Security',
          text: 'You are responsible for safeguarding your password and for all activities under your account. You must notify us immediately of any unauthorized use of your account.'
        }
      ]
    },
    'acceptable-use': {
      title: 'Acceptable Use Policy',
      content: [
        {
          title: 'Permitted Uses',
          text: 'You may use our services for: Legitimate file sharing purposes, Personal and business communications, Educational and research activities, and Other lawful purposes that do not violate these terms.'
        },
        {
          title: 'User Responsibilities',
          text: 'You are responsible for: Ensuring you have the right to share any files you upload, Respecting the privacy and rights of other users, Using the service in accordance with applicable laws, and Maintaining appropriate security measures for your devices.'
        },
        {
          title: 'Compliance',
          text: 'You agree to comply with all applicable local, state, national, and international laws and regulations when using our services.'
        }
      ]
    },
    'prohibited-uses': {
      title: 'Prohibited Uses',
      content: [
        {
          title: 'Illegal Activities',
          text: 'You may not use our services for: Sharing illegal content, including copyrighted material without permission, Distributing malware, viruses, or other harmful code, Engaging in illegal activities or facilitating illegal activities, or Violating any applicable laws or regulations.'
        },
        {
          title: 'Harmful Content',
          text: 'You may not share: Content that is defamatory, harassing, or threatening, Content that promotes violence or discrimination, Explicit or inappropriate content involving minors, or Content that violates intellectual property rights.'
        },
        {
          title: 'System Abuse',
          text: 'You may not: Attempt to gain unauthorized access to our systems, Interfere with the proper functioning of our services, Use automated systems to access our services without permission, or Engage in any activity that could harm our infrastructure.'
        }
      ]
    },
    'intellectual-property': {
      title: 'Intellectual Property Rights',
      content: [
        {
          title: 'Our Rights',
          text: 'Dropsos and its original content, features, and functionality are owned by Dropsos and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
        },
        {
          title: 'Your Content',
          text: 'You retain ownership of the files and content you share through our platform. By using our services, you grant us a limited license to facilitate the sharing of your content as intended by the service.'
        },
        {
          title: 'Respect for Rights',
          text: 'You agree not to infringe upon the intellectual property rights of others. We respect intellectual property rights and will respond to valid takedown requests in accordance with applicable law.'
        }
      ]
    },
    privacy: {
      title: 'Privacy and Data Protection',
      content: [
        {
          title: 'Privacy Policy',
          text: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy.'
        },
        {
          title: 'Data Security',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: 'Data Minimization',
          text: 'We collect only the minimum amount of personal information necessary to provide our services. We do not store the content of files shared through our platform.'
        }
      ]
    },
    disclaimers: {
      title: 'Disclaimers',
      content: [
        {
          title: 'Service Availability',
          text: 'Our services are provided "as is" and "as available" without warranties of any kind. We do not guarantee that our services will be uninterrupted, secure, or error-free.'
        },
        {
          title: 'Third-Party Content',
          text: 'We are not responsible for the content shared by users through our platform. Users are solely responsible for the content they share and must ensure they have the right to share such content.'
        },
        {
          title: 'Technical Issues',
          text: 'We are not liable for any technical issues, including but not limited to: Connection failures, Data loss, Service interruptions, or Compatibility issues with your devices.'
        }
      ]
    },
    'limitation-liability': {
      title: 'Limitation of Liability',
      content: [
        {
          title: 'Limitation of Damages',
          text: 'To the maximum extent permitted by law, Dropsos shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.'
        },
        {
          title: 'Maximum Liability',
          text: 'Our total liability to you for any claims arising out of or relating to these terms or our services shall not exceed the amount you paid us for the services in the 12 months preceding the claim.'
        },
        {
          title: 'Force Majeure',
          text: 'We shall not be liable for any failure or delay in performance under these terms which is due to fire, flood, earthquake, elements of nature, or acts of God, or other causes which are beyond our reasonable control.'
        }
      ]
    },
    termination: {
      title: 'Termination',
      content: [
        {
          title: 'Termination by You',
          text: 'You may terminate your use of our services at any time by discontinuing use of the platform and deleting your account if applicable.'
        },
        {
          title: 'Termination by Us',
          text: 'We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including if you breach these terms or engage in prohibited activities.'
        },
        {
          title: 'Effect of Termination',
          text: 'Upon termination, your right to use our services will cease immediately. We may delete your account and any associated data, subject to our data retention policies.'
        }
      ]
    },
    'governing-law': {
      title: 'Governing Law and Disputes',
      content: [
        {
          title: 'Governing Law',
          text: 'These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Dropsos is incorporated, without regard to conflict of law principles.'
        },
        {
          title: 'Dispute Resolution',
          text: 'Any disputes arising out of or relating to these terms or our services shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration association.'
        },
        {
          title: 'Jurisdiction',
          text: 'You agree that any legal action or proceeding arising out of or relating to these terms shall be brought exclusively in the courts of competent jurisdiction in our jurisdiction.'
        }
      ]
    },
    changes: {
      title: 'Changes to Terms',
      content: [
        {
          title: 'Right to Modify',
          text: 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms on our website and updating the "Last Updated" date.'
        },
        {
          title: 'Notification Methods',
          text: 'We may notify you of changes through: Email notifications, In-app notifications, Website announcements, or Other reasonable means of communication.'
        },
        {
          title: 'Continued Use',
          text: 'Your continued use of our services after the effective date of any changes constitutes acceptance of the modified terms. If you do not agree to the changes, you must discontinue use of our services.'
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
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              The terms and conditions governing your use of Dropsos services
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {content.acceptance.lastUpdated}
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

                {/* Important Notice */}
                {activeSection === 'acceptance' && (
                  <div className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4">Important Notice</h4>
                    <p className="text-gray-300 mb-4">
                      By using Dropsos services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>These terms constitute a legally binding agreement between you and Dropsos.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
            <p className="text-gray-300 mb-6">If you have any questions about these Terms of Service, please contact us</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </a>
              <a href="mailto:legal@dropsos.com" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Email Legal Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
