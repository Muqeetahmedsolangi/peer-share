'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, getAllBlogPosts } from '../blogData';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter();
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const allPosts = getAllBlogPosts();
    const related = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
    setRelatedPosts(related);
  }, [post.slug]);

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 sm:mb-8"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          {/* Category and Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
              {post.category}
            </span>
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-1 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src="/muqeetahmed.jpeg" 
                  alt={post.author} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">{post.author}</h3>
              <p className="text-gray-600 text-sm">{post.authorRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                  className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-orange-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-full h-40 overflow-hidden bg-gray-100">
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        {relatedPost.category}
                      </span>
                      <span className="text-gray-500 text-xs">{relatedPost.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-orange-100 rounded-2xl p-8 text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to Experience Secure File Sharing?</h3>
            <p className="text-gray-600 mb-6">Try Dropsos today and see why thousands of users trust us with their files.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create-room"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
