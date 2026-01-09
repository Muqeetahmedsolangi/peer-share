'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Pricing() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for personal use and small teams',
      price: { monthly: 0, annual: 0 },
      features: [
        'Unlimited secure rooms',
        'Unlimited file sizes',
        'AES-256 encryption',
        'Same WiFi sharing',
        'End-to-end encryption',
        'No data saved on servers',
        'Community support',
        'Basic analytics'
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing teams and businesses',
      price: { monthly: 9, annual: 100 },
      features: [
        'Everything in Free',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Team management',
        'Advanced security features',
        'SLA guarantee',
        'Dedicated support channel'
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: { monthly: 19, annual: 200 },
      features: [
        'Everything in Pro',
        'Military-grade encryption',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced compliance',
        'SSO integration',
        'Custom deployment',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise options'
      ],
      popular: false,
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required. Try all Pro features risk-free.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is always safe. Since we use zero-server architecture, your files are never stored on our servers. You can export all your data before canceling.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes, we offer special pricing for qualified non-profit organizations and educational institutions. Contact us for details.'
    },
    {
      question: 'Is the Free plan really free forever?',
      answer: 'Yes! Our Free plan is completely free forever with no hidden fees. You get unlimited secure file sharing with all core security features.'
    }
  ];

  const handleGetStarted = (planId: string) => {
    if (planId === 'free') {
      router.push('/create-room');
    } else {
      router.push('/contact');
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Hero Section - Simple */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Simple, <span className="text-orange-500">Transparent</span> Pricing
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your secure file sharing needs. All plans include our core security features with AES-256 encryption.
            </p>

            {/* Billing Toggle - Simple */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-base sm:text-lg font-semibold transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 sm:w-16 sm:h-8 bg-gray-200 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Toggle billing period"
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isAnnual ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
                }`}></div>
              </button>
              <span className={`text-base sm:text-lg font-semibold transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Save 20%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards - Simple */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white border-2 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-orange-500' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-gray-500 ml-2 text-base sm:text-lg">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                    {isAnnual && plan.price.monthly > 0 && (
                      <div className="text-sm text-green-600 font-semibold mt-2">
                        Save ${(plan.price.monthly * 12) - plan.price.annual}/year
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
                      : plan.id === 'free'
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Simple */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{faq.question}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Simple */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Contact us for enterprise solutions, custom pricing, and dedicated support for large organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Contact Sales
              </Link>
              <a
                href="mailto:sales@dropsos.com"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
              >
                Email Sales Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
