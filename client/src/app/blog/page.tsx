import { Metadata } from 'next';
import { getAllBlogPosts } from './blogData';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog | Dropsos - Expert Insights on Secure File Sharing',
  description: 'Latest insights on peer-to-peer technology, security, and file sharing innovations by Muqeet Ahmed. Expert guides on secure file sharing, P2P technology, and enterprise solutions.',
  keywords: 'file sharing blog, secure file sharing, P2P technology, enterprise file sharing, cybersecurity blog, file sharing best practices',
  openGraph: {
    title: 'Dropsos Blog - Expert Insights on Secure File Sharing',
    description: 'Latest insights on peer-to-peer technology, security, and file sharing innovations.',
    url: 'https://dropsos.com/blog',
    siteName: 'Dropsos Blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dropsos Blog - Expert Insights on Secure File Sharing',
    description: 'Latest insights on peer-to-peer technology, security, and file sharing innovations.',
    creator: '@dropsos',
  },
  alternates: {
    canonical: 'https://dropsos.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  // Structured data (JSON-LD) for blog listing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Dropsos Blog',
    description: 'Latest insights on peer-to-peer technology, security, and file sharing innovations',
    url: 'https://dropsos.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Dropsos',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dropsos.com/myfavicon.png',
      },
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://dropsos.com/blog/${post.slug}`,
      datePublished: post.publishDate,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListClient posts={posts} />
    </>
  );
}
