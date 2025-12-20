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
    default: "Dropsos - Secure Peer-to-Peer File Sharing Platform | Share Files Instantly",
    template: "%s | Dropsos"
  },
  description: "Dropsos is a secure, fast, and reliable peer-to-peer file sharing platform with military-grade encryption. Share files instantly with zero-configuration setup. Perfect for teams, creators, and professionals who need secure file transfers without servers. Free, encrypted, and privacy-focused.",
  keywords: [
    "peer to peer file sharing",
    "P2P file sharing",
    "secure file transfer",
    "encrypted file sharing",
    "file sharing platform",
    "secure data transfer",
    "end-to-end encryption",
    "peer-to-peer technology",
    "secure collaboration",
    "file sharing app",
    "secure file sharing",
    "instant file transfer",
    "team file sharing",
    "encrypted file transfer",
    "zero-config file sharing",
    "airforshare",
    "airdrop alternative",
    "apple share alternative",
    "shareit alternative",
    "wifi file sharing",
    "same wifi file transfer",
    "local file sharing",
    "private file sharing",
    "secure file sync",
    "direct file transfer",
    "no server file sharing",
    "browser file sharing",
    "web file transfer",
    "encrypted P2P",
    "secure messaging",
    "file sharing service",
    "free file sharing",
    "privacy focused file sharing",
    "dropsos",
    "share files",
    "transfer files",
    "send files",
    "receive files"
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
    alternateLocale: ["en_US"],
    url: "https://dropsos.com",
    siteName: "Dropsos",
    title: "Dropsos - Secure Peer-to-Peer File Sharing Platform",
    description: "Share files instantly with military-grade encryption. Zero-configuration, privacy-focused, and completely free. Perfect for teams, creators, and professionals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dropsos - Secure Peer-to-Peer File Sharing Platform",
        type: "image/png",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Dropsos Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dropsos - Secure Peer-to-Peer File Sharing Platform",
    description: "Share files instantly with military-grade encryption. Zero-configuration, privacy-focused, and completely free.",
    images: ["/og-image.png"],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#ff6b35",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dropsos",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://dropsos.com",
    types: {
      "application/rss+xml": "https://dropsos.com/blog/rss.xml",
    },
  },
  category: "technology",
  classification: "File Sharing, Security, Productivity",
  other: {
    "msapplication-TileColor": "#ff6b35",
    "theme-color": "#ff6b35",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Dropsos",
    applicationCategory: "FileSharingApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
    },
    description: "Secure peer-to-peer file sharing platform with military-grade encryption. Share files instantly with zero-configuration setup.",
    url: "https://dropsos.com",
    logo: "https://dropsos.com/logo.png",
    image: "https://dropsos.com/og-image.png",
    sameAs: [
      // Add your social media links here
    ],
    author: {
      "@type": "Organization",
      name: "Dropsos Team",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dropsos",
    url: "https://dropsos.com",
    logo: "https://dropsos.com/logo.png",
    description: "Secure peer-to-peer file sharing platform",
    sameAs: [],
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
