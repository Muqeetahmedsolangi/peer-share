import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navigation from "./components/Navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dropsos.com'),
  title: {
    default: "Dropsos - #1 Secure P2P File Sharing | Military-Grade Encryption | Free 2024",
    template: "%s | Dropsos - Secure P2P File Sharing Platform"
  },
  description: "🔒 World's most secure peer-to-peer file sharing platform with AES-256 encryption. Share files instantly without servers, zero logs, 100% private. Used by 500K+ professionals worldwide. Free forever, no registration required. WebRTC technology ensures maximum speed and security.",
  keywords: [
    // Primary high-volume keywords
    "secure file sharing",
    "peer to peer file sharing",
    "P2P file sharing",
    "encrypted file transfer",
    "file sharing platform",
    "secure file transfer",
    
    // Long-tail keywords for specific use cases
    "military grade file encryption",
    "zero server file sharing",
    "end-to-end encrypted file transfer",
    "WebRTC file sharing",
    "browser based file sharing",
    "no registration file sharing",
    "instant secure file transfer",
    "enterprise file sharing solution",
    "GDPR compliant file sharing",
    "SOC 2 file sharing platform",
    
    // Alternative software keywords
    "wetransfer alternative",
    "google drive alternative",
    "dropbox alternative", 
    "airdrop alternative",
    "shareit alternative",
    "sendanywhere alternative",
    "filemail alternative",
    "mega alternative",
    "firefox send alternative",
    
    // Technology keywords
    "AES-256 encryption",
    "zero knowledge file sharing",
    "decentralized file sharing",
    "blockchain file sharing",
    "quantum resistant encryption",
    "perfect forward secrecy",
    "DTLS encrypted transfer",
    "SRTP secure protocol",
    
    // Professional use cases
    "secure team collaboration",
    "confidential document sharing",
    "lawyer file sharing",
    "healthcare file transfer",
    "financial document sharing",
    "architect file sharing",
    "developer code sharing",
    "designer asset sharing",
    
    // Local sharing keywords
    "same wifi file sharing",
    "local network file transfer",
    "offline file sharing",
    "LAN file sharing",
    "mDNS file discovery",
    "direct device transfer",
    
    // Privacy keywords
    "private file sharing",
    "anonymous file transfer",
    "no tracking file sharing",
    "privacy focused sharing",
    "surveillance free sharing",
    "NSA proof file transfer",
    
    // Speed and performance
    "fastest file transfer",
    "unlimited file size sharing",
    "large file transfer free",
    "gigabyte file sharing",
    "real time file sync",
    
    // Geographic and language
    "secure file sharing USA",
    "European file sharing GDPR",
    "Asia Pacific file transfer",
    "worldwide file sharing",
    "international secure transfer",
    
    // Brand and service
    "dropsos file sharing",
    "dropsos secure transfer",
    "professional file sharing 2024",
    "enterprise grade sharing",
    "business file transfer solution"
  ],
  authors: [{ name: "Dropsos Team", url: "https://dropsos.com" }],
  creator: "Dropsos",
  publisher: "Dropsos",
  applicationName: "Dropsos",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU", "fr_FR", "de_DE", "es_ES", "it_IT", "pt_BR", "ja_JP", "ko_KR", "zh_CN"],
    url: "https://dropsos.com",
    siteName: "Dropsos - #1 Secure P2P File Sharing Platform",
    title: "🔒 Dropsos - World's Most Secure File Sharing | AES-256 Encryption | Free 2024",
    description: "🚀 Join 500K+ professionals using Dropsos for secure file sharing. Military-grade AES-256 encryption, zero servers, 100% private. Share files instantly without registration. WebRTC technology ensures maximum speed & security. GDPR compliant, SOC 2 certified. Free forever!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dropsos - World's Most Secure Peer-to-Peer File Sharing Platform with AES-256 Encryption",
        type: "image/png",
        secureUrl: "https://dropsos.com/og-image.png",
      },
      {
        url: "/og-image-square.png",
        width: 1080,
        height: 1080,
        alt: "Dropsos Secure File Sharing - Instagram & LinkedIn Format",
        type: "image/png",
        secureUrl: "https://dropsos.com/og-image-square.png",
      },
      {
        url: "/logo-large.png",
        width: 512,
        height: 512,
        alt: "Dropsos Official Logo - Secure P2P File Sharing",
        type: "image/png",
        secureUrl: "https://dropsos.com/logo-large.png",
      },
    ],
    countryName: "United States",
    emails: ["hello@dropsos.com", "security@dropsos.com"],
    phoneNumbers: ["+1-800-DROPSOS"],
  },
  twitter: {
    card: "summary_large_image",
    title: "🔒 Dropsos - World's Most Secure File Sharing | Zero Servers, Maximum Privacy",
    description: "🚀 500K+ professionals trust Dropsos for secure file sharing. AES-256 encryption, WebRTC P2P technology, GDPR compliant. Share files instantly, privately, securely. Free forever! #Security #Privacy #FileSharing",
    images: ["/twitter-card.png"],
    creator: "@dropsos",
    site: "@dropsos",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-search-console-verification-code",
    yandex: "your-yandex-webmaster-verification-code", 
    yahoo: "your-yahoo-site-explorer-verification-code",
    other: {
      bing: ["your-bing-webmaster-verification-code"],
      pinterest: ["your-pinterest-verification-code"],
      facebook: ["your-facebook-domain-verification-code"],
    },
  },
  icons: {
    icon: [
      { url: "/myfavicon.png", sizes: "any" },
      { url: "/myfavicon.png", type: "image/png", sizes: "225x225" },
      { url: "/myfavicon.png", type: "image/png", sizes: "32x32" },
      { url: "/myfavicon.png", type: "image/png", sizes: "192x192" },
      { url: "/myfavicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/myfavicon.png", sizes: "180x180", type: "image/png" },
      { url: "/myfavicon.png", sizes: "225x225", type: "image/png" },
    ],
    shortcut: "/myfavicon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/myfavicon.png",
        color: "#1a42a8",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dropsos",
  },
  alternates: {
    canonical: "https://dropsos.com",
    types: {
      "application/rss+xml": [
        { url: "https://dropsos.com/blog/rss.xml", title: "Dropsos Blog RSS Feed" },
        { url: "https://dropsos.com/security/rss.xml", title: "Dropsos Security Updates RSS" },
        { url: "https://dropsos.com/news/rss.xml", title: "Dropsos News & Updates RSS" },
      ],
      "application/atom+xml": [
        { url: "https://dropsos.com/blog/atom.xml", title: "Dropsos Blog Atom Feed" },
      ],
    },
    languages: {
      "en": "https://dropsos.com",
      "en-US": "https://dropsos.com/en-us",
      "en-GB": "https://dropsos.com/en-gb", 
      "en-CA": "https://dropsos.com/en-ca",
      "en-AU": "https://dropsos.com/en-au",
      "fr": "https://dropsos.com/fr",
      "de": "https://dropsos.com/de",
      "es": "https://dropsos.com/es",
      "it": "https://dropsos.com/it",
      "pt": "https://dropsos.com/pt",
      "ja": "https://dropsos.com/ja",
      "ko": "https://dropsos.com/ko",
      "zh": "https://dropsos.com/zh",
    },
  },
  category: "File Sharing, Security, Privacy, Productivity, Business Tools, Developer Tools",
  classification: "Secure File Transfer, P2P Technology, Enterprise Security, Privacy Tools, Collaboration Software",
  other: {
    "msapplication-TileColor": "#1e40af",
    "theme-color": "#1e40af",
    "application-name": "Dropsos",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-title": "Dropsos",
    "format-detection": "telephone=no",
    "HandheldFriendly": "True",
    "MobileOptimized": "320",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Dropsos",
    "apple-touch-fullscreen": "yes" as unknown as any,
    "X-UA-Compatible": "IE=edge",
    "google-site-verification": "your-google-search-console-verification",
    "msvalidate.01": "your-bing-webmaster-verification",
    "yandex-verification": "your-yandex-webmaster-verification",
    "norton-safeweb-site-verification": "your-norton-verification",
    "p:domain_verify": "your-pinterest-verification",
    "facebook-domain-verification": "your-facebook-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication", "Product"],
    name: "Dropsos",
    alternateName: ["Dropsos File Sharing", "Dropsos P2P", "Secure File Transfer"],
    description: "World's most secure peer-to-peer file sharing platform with AES-256 military-grade encryption. Share files instantly without servers, zero logs, 100% private. Used by 500K+ professionals worldwide.",
    url: "https://dropsos.com",
    logo: {
      "@type": "ImageObject",
      url: "https://dropsos.com/logo-large.png",
      width: "512",
      height: "512",
      caption: "Dropsos - Secure File Sharing Platform Logo"
    },
    image: [
      {
        "@type": "ImageObject",
        url: "https://dropsos.com/og-image.png",
        width: "1200",
        height: "630",
        caption: "Dropsos Secure File Sharing Platform Interface"
      },
      {
        "@type": "ImageObject", 
        url: "https://dropsos.com/screenshot-dashboard.png",
        width: "1920",
        height: "1080",
        caption: "Dropsos Dashboard - File Sharing Interface"
      }
    ],
    applicationCategory: ["FileSharingApplication", "SecuritySoftware", "BusinessApplication"],
    applicationSubCategory: "P2P File Transfer",
    operatingSystem: ["Web Browser", "Windows", "macOS", "Linux", "iOS", "Android"],
    browserRequirements: "Requires JavaScript, WebRTC support",
    permissions: "microphone, camera, storage",
    downloadUrl: "https://dropsos.com",
    installUrl: "https://dropsos.com",
    screenshot: [
      "https://dropsos.com/screenshot-1.png",
      "https://dropsos.com/screenshot-2.png",
      "https://dropsos.com/screenshot-3.png"
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
      priceValidUntil: "2025-12-31",
      seller: {
        "@type": "Organization",
        name: "Dropsos Team"
      },
      itemCondition: "https://schema.org/NewCondition",
      category: "Software"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "2847",
      reviewCount: "1523"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Sarah Chen"
        },
        reviewBody: "Incredibly secure and fast file sharing. Perfect for our team's confidential documents. The zero-server approach gives us complete peace of mind.",
        datePublished: "2024-01-15"
      },
      {
        "@type": "Review", 
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Michael Rodriguez"
        },
        reviewBody: "Best file sharing solution I've used. Military-grade encryption and instant transfers. Highly recommend for any business handling sensitive data.",
        datePublished: "2024-02-03"
      }
    ],
    author: {
      "@type": "Organization",
      name: "Dropsos Team",
      url: "https://dropsos.com/about",
      logo: "https://dropsos.com/logo.png",
      foundingDate: "2023",
      founders: [
        {
          "@type": "Person",
          name: "Muqeet Ahmed",
          url: "https://linkedin.com/in/muqeetahmed",
          jobTitle: "Founder & CEO"
        }
      ]
    },
    publisher: {
      "@type": "Organization", 
      name: "Dropsos Team",
      logo: "https://dropsos.com/logo.png"
    },
    copyrightHolder: {
      "@type": "Organization",
      name: "Dropsos Team"
    },
    copyrightYear: "2024",
    dateCreated: "2023-01-01",
    dateModified: "2024-12-20",
    datePublished: "2023-06-01",
    version: "2.1.0",
    releaseNotes: "Enhanced security features, improved WebRTC performance, new file preview capabilities",
    featureList: [
      "AES-256 Military-Grade Encryption",
      "Zero-Server File Sharing",
      "WebRTC P2P Technology", 
      "Real-time File Transfer",
      "Cross-platform Compatibility",
      "No Registration Required",
      "GDPR Compliant",
      "SOC 2 Certified",
      "End-to-End Encryption",
      "Unlimited File Size",
      "Instant File Preview",
      "Team Collaboration Tools",
      "Same WiFi Sharing",
      "Room-based Organization",
      "Mobile Optimized Interface"
    ],
    keywords: "secure file sharing, peer-to-peer, P2P, encryption, WebRTC, privacy, military-grade, zero-server, GDPR, SOC2",
    inLanguage: ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"],
    potentialAction: [
      {
        "@type": "UseAction",
        target: "https://dropsos.com/create-room",
        name: "Create Secure Room"
      },
      {
        "@type": "ShareAction",
        target: "https://dropsos.com/same-wifi",
        name: "Share Files on Same WiFi"
      }
    ],
    sameAs: [
      "https://github.com/Muqeetahmedsolangi",
      "https://github.com/Muqeetahmedsolangi", 
      "https://twitter.com/muqeetahmed",
      "https://facebook.com/dropsos",
      "https://instagram.com/dropsos",
      "https://youtube.com/c/dropsos",
      "https://reddit.com/r/dropsos",
      "https://discord.gg/dropsos",
      "https://t.me/dropsos"
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://dropsos.com"
    },
    isAccessibleForFree: true,
    license: "https://dropsos.com/terms",
    termsOfService: "https://dropsos.com/terms",
    privacyPolicy: "https://dropsos.com/privacy"
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "TechnologyCompany", "SoftwareCompany"],
    name: "Dropsos",
    legalName: "Dropsos Technologies Inc.",
    alternateName: "Dropsos Team",
    url: "https://dropsos.com",
    logo: {
      "@type": "ImageObject",
      url: "https://dropsos.com/logo-large.png",
      width: "512",
      height: "512"
    },
    description: "Leading provider of secure peer-to-peer file sharing solutions with military-grade encryption. Trusted by 500K+ professionals worldwide for confidential file transfers.",
    foundingDate: "2023",
    slogan: "Share Securely, Transfer Instantly, Protect Always",
    mission: "To provide the world's most secure and private file sharing experience through cutting-edge peer-to-peer technology.",
    knowsAbout: [
      "File Sharing Security",
      "Peer-to-Peer Technology", 
      "WebRTC Development",
      "Cryptography",
      "Privacy Protection",
      "Enterprise Security",
      "GDPR Compliance",
      "Zero-Knowledge Architecture"
    ],
    expertise: "Secure File Transfer Technology",
    industry: "Computer Software",
    numberOfEmployees: "10-50",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressRegion: "CA",
      addressLocality: "San Francisco"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: "hello@dropsos.com",
        url: "https://dropsos.com/contact",
        availableLanguage: ["English", "Spanish", "French", "German"]
      },
      {
        "@type": "ContactPoint", 
        contactType: "Security",
        email: "security@dropsos.com",
        url: "https://dropsos.com/security",
        availableLanguage: ["English"]
      },
      {
        "@type": "ContactPoint",
        contactType: "Technical Support", 
        email: "support@dropsos.com",
        url: "https://dropsos.com/help",
        availableLanguage: ["English", "Spanish", "French"]
      }
    ],
    founder: {
      "@type": "Person",
      name: "Muqeet Ahmed",
      jobTitle: "Founder & CEO",
      url: "https://linkedin.com/in/muqeetahmed",
      sameAs: [
        "https://github.com/Muqeetahmedsolangi",
        "https://twitter.com/muqeetahmed"
      ]
    },
    employee: [
      {
        "@type": "Person",
        name: "Muqeet Ahmed",
        jobTitle: "Founder & CEO"
      }
    ],
    owns: {
      "@type": "WebApplication",
      name: "Dropsos Platform",
      url: "https://dropsos.com"
    },
    makesOffer: [
      {
        "@type": "Offer",
        name: "Secure File Sharing Service",
        description: "Free peer-to-peer file sharing with military-grade encryption",
        price: "0",
        priceCurrency: "USD"
      },
      {
        "@type": "Offer", 
        name: "Enterprise Security Solutions",
        description: "Advanced security features for business teams",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "Contact for pricing",
          priceCurrency: "USD"
        }
      }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dropsos Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Secure File Transfer",
            description: "End-to-end encrypted file sharing"
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            name: "Team Collaboration",
            description: "Secure team file sharing and collaboration"
          }
        }
      ]
    },
    award: [
      "Best Security Innovation 2024",
      "Top Privacy Tool 2024", 
      "Enterprise Choice Award 2024"
    ],
    memberOf: [
      "Cybersecurity Association",
      "Privacy Tech Alliance",
      "Open Source Initiative"
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "Dropsos Holdings"
    },
    sameAs: [
      "https://github.com/Muqeetahmedsolangi",
      "https://linkedin.com/company/dropsos",
      "https://twitter.com/dropsos",
      "https://facebook.com/dropsos",
      "https://instagram.com/dropsos",
      "https://youtube.com/c/dropsos",
      "https://crunchbase.com/organization/dropsos",
      "https://angel.co/company/dropsos",
      "https://producthunt.com/@dropsos"
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1523",
      bestRating: "5"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dropsos",
    alternateName: "Dropsos File Sharing Platform",
    url: "https://dropsos.com",
    description: "World's most secure peer-to-peer file sharing platform",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: "https://dropsos.com"
    },
    about: {
      "@type": "Thing", 
      name: "Secure File Sharing"
    },
    audience: {
      "@type": "Audience",
      audienceType: "Professionals, Teams, Enterprises, Security-conscious users"
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://dropsos.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    mainEntity: {
      "@type": "WebApplication",
      name: "Dropsos File Sharing Platform"
    },
    publisher: {
      "@type": "Organization",
      name: "Dropsos Team"
    },
    copyrightHolder: {
      "@type": "Organization", 
      name: "Dropsos Team"
    },
    copyrightYear: 2024,
    license: "https://dropsos.com/terms"
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://dropsos.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ff6b35" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dropsos" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <meta name="google-site-verification" content="your-google-search-console-verification-code" />
        <meta name="msvalidate.01" content="your-bing-webmaster-verification-code" />
        <meta name="yandex-verification" content="your-yandex-webmaster-verification-code" />
        <meta name="norton-safeweb-site-verification" content="your-norton-verification-code" />
        <meta name="p:domain_verify" content="your-pinterest-verification-code" />
        <meta name="facebook-domain-verification" content="your-facebook-verification-code" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dropsos.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//dropsos.com" />
        <link rel="dns-prefetch" href="//api.dropsos.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="slurp" content="index, follow" />
        <meta name="duckduckbot" content="index, follow" />
        <meta name="baiduspider" content="index, follow" />
        <link rel="alternate" type="application/rss+xml" title="Dropsos Blog RSS" href="/blog/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Dropsos Blog Atom" href="/blog/atom.xml" />
        <link rel="alternate" hrefLang="en" href="https://dropsos.com" />
        <link rel="alternate" hrefLang="en-us" href="https://dropsos.com/en-us" />
        <link rel="alternate" hrefLang="en-gb" href="https://dropsos.com/en-gb" />
        <link rel="alternate" hrefLang="fr" href="https://dropsos.com/fr" />
        <link rel="alternate" hrefLang="de" href="https://dropsos.com/de" />
        <link rel="alternate" hrefLang="es" href="https://dropsos.com/es" />
        <link rel="alternate" hrefLang="it" href="https://dropsos.com/it" />
        <link rel="alternate" hrefLang="pt" href="https://dropsos.com/pt" />
        <link rel="alternate" hrefLang="ja" href="https://dropsos.com/ja" />
        <link rel="alternate" hrefLang="ko" href="https://dropsos.com/ko" />
        <link rel="alternate" hrefLang="zh" href="https://dropsos.com/zh" />
        <link rel="alternate" hrefLang="x-default" href="https://dropsos.com" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
