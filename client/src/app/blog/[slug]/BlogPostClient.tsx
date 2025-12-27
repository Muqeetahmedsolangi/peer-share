'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, getAllBlogPosts } from '../blogData';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setIsVisible(true);
    // Get related posts (excluding current post)
    const allPosts = getAllBlogPosts();
    const related = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);
    setRelatedPosts(related);
  }, [post.slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),rgba(15,23,42,0.1))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),rgba(15,23,42,0.1))]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Bar Spacer */}
      <div className="h-20"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Back Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => router.back()}
              className="group flex items-center px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </button>
          </div>

          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Enhanced Article Header */}
            <article className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/30 overflow-hidden">
              {/* Category and Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-semibold rounded-full border border-blue-400/30 backdrop-blur-sm">
                  {post.category}
                </span>
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
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
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {post.title}
                </span>
              </h1>

              {/* Excerpt */}
              <p className="text-2xl text-gray-300 mb-10 leading-relaxed font-light">
                {post.excerpt}
              </p>

              {/* Enhanced Author Info */}
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/muqeetahmed.jpeg" 
                      alt={post.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{post.author}</h3>
                    <p className="text-blue-400 font-semibold">{post.authorRole}</p>
                    <p className="text-gray-400 text-sm">Full Stack Developer & DevOps Engineer</p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-3">
                  <a href="https://github.com/Muqeetahmedsolangi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/muqeetahmed" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/muqeetahmed" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-8 rounded-2xl overflow-hidden">
                <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-4xl">📄</span>
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  color: '#e2e8f0',
                  lineHeight: '1.7'
                }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded-full hover:bg-slate-600/50 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                      className="group cursor-pointer bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
                          {relatedPost.category}
                        </span>
                        <span className="text-gray-400 text-xs">{relatedPost.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Secure File Sharing?</h3>
              <p className="text-gray-300 mb-6">Try Dropsos today and see why thousands of users trust us with their files.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/create-room')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

