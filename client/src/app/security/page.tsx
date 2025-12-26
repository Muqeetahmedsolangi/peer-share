import { Metadata } from 'next';
import SecurityClient from './SecurityClient';

export const metadata: Metadata = {
  title: 'Security | Dropsos - Enterprise-Grade Security & Encryption',
  description: 'Comprehensive security measures to protect your data and privacy. Learn about AES-256 encryption, zero-knowledge architecture, SOC 2 compliance, and GDPR compliance. Military-grade file sharing security.',
  keywords: 'file sharing security, AES-256 encryption, zero-knowledge architecture, SOC 2 compliance, GDPR compliance, secure file transfer, enterprise security, data protection, cybersecurity',
  openGraph: {
    title: 'Security | Dropsos - Enterprise-Grade Security & Encryption',
    description: 'Comprehensive security measures to protect your data and privacy with AES-256 encryption and zero-knowledge architecture.',
    url: 'https://dropsos.com/security',
    siteName: 'Dropsos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security | Dropsos - Enterprise-Grade Security',
    description: 'Comprehensive security measures with AES-256 encryption and zero-knowledge architecture.',
    creator: '@dropsos',
  },
  alternates: {
    canonical: 'https://dropsos.com/security',
  },
};

export default function SecurityPage() {
  // Structured data (JSON-LD) for security page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Security - Dropsos',
    description: 'Comprehensive security measures to protect your data and privacy',
    url: 'https://dropsos.com/security',
    about: {
      '@type': 'Thing',
      name: 'File Sharing Security',
      description: 'Enterprise-grade security for file sharing with AES-256 encryption',
    },
    mainEntity: {
      '@type': 'Organization',
      name: 'Dropsos',
      securityLevel: 'Enterprise-Grade',
      encryptionStandard: 'AES-256',
      compliance: ['SOC 2 Type II', 'GDPR', 'CCPA'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SecurityClient />
    </>
  );
}
