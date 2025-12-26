import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | Dropsos - Secure Peer-to-Peer File Sharing',
  description: 'Learn about Dropsos, the enterprise-grade peer-to-peer file sharing platform with military-level encryption. Discover our mission, vision, and commitment to secure file sharing.',
  keywords: 'about dropsos, secure file sharing, P2P file sharing, enterprise file sharing, file sharing platform, secure file transfer',
  openGraph: {
    title: 'About Us | Dropsos - Secure Peer-to-Peer File Sharing',
    description: 'Learn about Dropsos, the enterprise-grade peer-to-peer file sharing platform with military-level encryption.',
    url: 'https://dropsos.com/about',
    siteName: 'Dropsos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Dropsos',
    description: 'Learn about Dropsos, the enterprise-grade peer-to-peer file sharing platform.',
    creator: '@dropsos',
  },
  alternates: {
    canonical: 'https://dropsos.com/about',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Dropsos',
    description: 'About Dropsos - Enterprise-grade peer-to-peer file sharing platform',
    url: 'https://dropsos.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Dropsos',
      description: 'Enterprise-grade peer-to-peer file sharing platform with military-level encryption',
      url: 'https://dropsos.com',
      logo: 'https://dropsos.com/myfavicon.png',
      foundingDate: '2024',
      founder: {
        '@type': 'Person',
        name: 'Muqeet Ahmed',
        jobTitle: 'Full Stack Developer & DevOps Engineer',
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
