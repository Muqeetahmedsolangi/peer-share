'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for personal use and small teams',
      price: { monthly: 0, annual: 0 },
      features: [
        'Up to 5 rooms',
        '1GB file size limit',
        'Basic encryption',
        'Community support',
        'Same WiFi sharing',
        'Basic analytics'
      ],
      limitations: [
        'Limited to 5 users per room',
        'No priority support',
        'Basic file types only'
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing teams and businesses',
      price: { monthly: 29, annual: 290 },
      features: [
        'Unlimited rooms',
        '10GB file size limit',
        'Advanced encryption',
        'Priority support',
        'All sharing methods',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Team management',
        'Advanced security'
      ],
      limitations: [],
      popular: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: { monthly: 99, annual: 990 },
      features: [
        'Everything in Pro',
        'Unlimited file size',
        'Military-grade encryption',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced compliance',
        'SSO integration',
        'Custom deployment',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is safe. You can export all your files and data before canceling your subscription.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes, we offer special pricing for qualified non-profit organizations. Contact us for details.'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleGetStarted = (planId: string) => {
    if (planId === 'free') {
      router.push('/create-room');
    } else {
      // In a real app, this would redirect to payment
      alert(`Redirecting to payment for ${plans.find(p => p.id === planId)?.name} plan...`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="text-center mb-16">
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300 mb-8 mx-auto"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Simple Pricing
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your file sharing needs. All plans include our core security features.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-12">
                <span className={`text-lg font-semibold transition-colors ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative w-16 h-8 bg-slate-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isAnnual ? 'translate-x-8' : 'translate-x-0'
                  }`}></div>
                </button>
                <span className={`text-lg font-semibold transition-colors ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Annual
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Save 20%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    plan.popular ? 'scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border rounded-3xl p-8 h-full transition-all duration-500 ${
                    selectedPlan === plan.id
                      ? 'border-blue-400/50 shadow-2xl shadow-blue-500/25'
                      : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white">
                          {plan.name === 'Free' ? '🆓' : plan.name === 'Pro' ? '⭐' : '🏢'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-4">{plan.description}</p>
                      
                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-5xl font-black text-white">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-gray-400 ml-2">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                        {isAnnual && plan.price.monthly > 0 && (
                          <div className="text-sm text-green-400 mt-1">
                            Save ${(plan.price.monthly * 12) - plan.price.annual}/year
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 mb-8">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25'
                          : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 border border-white/10'
                      }`}
                    >
                      {plan.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-lg">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className={`max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Plan?</h3>
              <p className="text-gray-300 mb-6">Contact us for enterprise solutions and custom pricing</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                  Contact Sales
                </a>
                <a href="mailto:sales@dropsos.com" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                  Email Sales Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
