import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dropsos - How We Protect Your Data',
  description: 'Learn how Dropsos collects, uses, and protects your personal information. We never store your files, use zero-knowledge architecture, and comply with GDPR and CCPA privacy regulations.',
  keywords: 'privacy policy, data protection, GDPR compliance, CCPA compliance, zero-knowledge file sharing, data privacy, file sharing privacy',
  openGraph: {
    title: 'Privacy Policy | Dropsos - How We Protect Your Data',
    description: 'Learn how Dropsos collects, uses, and protects your personal information with zero-knowledge architecture.',
    url: 'https://dropsos.com/privacy',
    siteName: 'Dropsos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Dropsos',
    description: 'Learn how Dropsos protects your data with zero-knowledge architecture.',
    creator: '@dropsos',
  },
  alternates: {
    canonical: 'https://dropsos.com/privacy',
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - Dropsos',
    description: 'Privacy policy explaining how Dropsos collects, uses, and protects your data',
    url: 'https://dropsos.com/privacy',
    dateModified: '2024-01-01',
    publisher: {
      '@type': 'Organization',
      name: 'Dropsos',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyClient />
    </>
  );
}
