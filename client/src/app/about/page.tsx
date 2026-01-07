import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Dropsos | #1 Secure P2P File Sharing Platform | Enterprise-Grade Encryption 2024',
  description: 'Learn about Dropsos - the world\'s most secure peer-to-peer file sharing platform with AES-256 military-grade encryption. Zero server storage, end-to-end encryption, WebRTC technology. Trusted by 500K+ professionals worldwide. Free forever, GDPR compliant, SOC 2 certified secure file transfer solution.',
  keywords: [
    'about dropsos',
    'secure file sharing platform',
    'peer to peer file sharing',
    'P2P file sharing company',
    'enterprise file sharing solution',
    'secure file transfer platform',
    'military grade encryption file sharing',
    'zero server file sharing',
    'end-to-end encrypted file transfer',
    'WebRTC file sharing technology',
    'GDPR compliant file sharing',
    'SOC 2 file sharing platform',
    'secure file sharing mission',
    'file sharing platform vision',
    'secure file sharing features',
    'encrypted file transfer company',
    'privacy focused file sharing',
    'no data saved file sharing',
    'direct file transfer technology',
    'secure collaboration platform',
    'file sharing security',
    'enterprise secure file sharing',
    'business file transfer solution',
    'professional file sharing platform',
    'secure file sharing 2024',
    'best secure file sharing',
    'top P2P file sharing platform',
    'secure file sharing reviews',
    'file sharing platform comparison',
    'secure file sharing alternatives'
  ],
  openGraph: {
    title: 'About Dropsos | #1 Secure P2P File Sharing Platform | Enterprise-Grade Encryption',
    description: 'Learn about Dropsos - the world\'s most secure peer-to-peer file sharing platform with AES-256 military-grade encryption. Zero server storage, end-to-end encryption, WebRTC technology.',
    url: 'https://dropsos.com/about',
    siteName: 'Dropsos - Secure File Sharing Platform',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Dropsos - Secure P2P File Sharing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dropsos | #1 Secure P2P File Sharing Platform',
    description: 'Learn about the world\'s most secure peer-to-peer file sharing platform with AES-256 encryption.',
    creator: '@dropsos',
  },
  alternates: {
    canonical: 'https://dropsos.com/about',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Dropsos - Secure Peer-to-Peer File Sharing Platform',
    description: 'About Dropsos - Enterprise-grade peer-to-peer file sharing platform with military-level AES-256 encryption, zero server storage, and WebRTC technology',
    url: 'https://dropsos.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Dropsos',
      legalName: 'Dropsos Technologies Inc.',
      description: 'World\'s most secure peer-to-peer file sharing platform with AES-256 military-grade encryption. Zero server storage, end-to-end encryption, WebRTC technology. Trusted by 500K+ professionals worldwide.',
      url: 'https://dropsos.com',
      logo: 'https://dropsos.com/myfavicon.png',
      foundingDate: '2023',
      founder: {
        '@type': 'Person',
        name: 'Muqeet Ahmed',
        jobTitle: 'Full Stack Developer & DevOps Engineer',
        url: 'https://linkedin.com/in/muqeetahmed',
      },
      knowsAbout: [
        'Secure File Sharing',
        'Peer-to-Peer Technology',
        'WebRTC Development',
        'AES-256 Encryption',
        'Zero-Knowledge Architecture',
        'Enterprise Security',
        'GDPR Compliance',
        'SOC 2 Compliance'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1523',
        bestRating: '5',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
