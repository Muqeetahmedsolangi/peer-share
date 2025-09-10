'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Blog data - In a real app, this would come from a CMS or API
const blogPosts = [
  {
    id: 1,
    slug: 'secure-file-sharing-best-practices',
    title: 'Secure File Sharing: Best Practices for 2024',
    excerpt: 'Learn the essential security practices for file sharing in today\'s digital landscape. Protect your data with these proven strategies.',
    content: `
      <p>In today's interconnected world, secure file sharing has become a critical component of business operations. Whether you're collaborating with team members, sharing sensitive documents, or transferring large files, implementing proper security measures is essential to protect your data and maintain compliance.</p>

      <h2>Why Secure File Sharing Matters</h2>
      <p>Data breaches and cyber attacks are on the rise, with file sharing often being a vulnerable point of entry. A single compromised file can lead to significant financial losses, reputational damage, and legal consequences. By implementing robust security measures, you can significantly reduce these risks.</p>

      <h2>Essential Security Practices</h2>
      
      <h3>1. End-to-End Encryption</h3>
      <p>Always use end-to-end encryption for file transfers. This ensures that files are encrypted from the moment they leave your device until they reach the intended recipient. Even if intercepted during transmission, the data remains unreadable.</p>

      <h3>2. Strong Authentication</h3>
      <p>Implement multi-factor authentication (MFA) for all file sharing accounts. This adds an extra layer of security by requiring users to provide multiple forms of verification before accessing shared files.</p>

      <h3>3. Access Controls</h3>
      <p>Use role-based access controls to ensure that only authorized individuals can access specific files. Regularly review and update permissions to maintain security.</p>

      <h3>4. Regular Security Audits</h3>
      <p>Conduct regular security audits to identify potential vulnerabilities and ensure compliance with security policies. This includes reviewing access logs, checking for unauthorized access, and updating security measures.</p>

      <h2>Choosing the Right File Sharing Solution</h2>
      <p>When selecting a file sharing platform, consider the following factors:</p>
      <ul>
        <li><strong>Encryption Standards:</strong> Look for platforms that use industry-standard encryption (AES-256)</li>
        <li><strong>Compliance:</strong> Ensure the platform meets relevant compliance requirements (GDPR, HIPAA, etc.)</li>
        <li><strong>User Management:</strong> Choose solutions with robust user management and access control features</li>
        <li><strong>Audit Trails:</strong> Select platforms that provide detailed audit logs for security monitoring</li>
      </ul>

      <h2>Best Practices for Users</h2>
      <p>Individual users also play a crucial role in maintaining security:</p>
      <ul>
        <li>Never share files via unsecured channels (email, public cloud storage)</li>
        <li>Use strong, unique passwords for all accounts</li>
        <li>Be cautious of phishing attempts and suspicious links</li>
        <li>Regularly update software and security patches</li>
        <li>Report any suspicious activity immediately</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Secure file sharing is not just a technical requirement—it's a business imperative. By implementing these best practices and choosing the right tools, you can protect your organization's data while enabling efficient collaboration. Remember, security is an ongoing process that requires regular attention and updates.</p>
    `,
    author: 'Muqeet Ahmed',
    authorRole: 'Security Expert',
    authorAvatar: 'MA',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'Security',
    tags: ['Security', 'File Sharing', 'Best Practices', 'Encryption'],
    featuredImage: '/api/placeholder/800/400',
    seoTitle: 'Secure File Sharing Best Practices 2024 | Dropsos',
    seoDescription: 'Learn essential security practices for file sharing in 2024. Protect your data with proven strategies for encryption, authentication, and access control.',
    seoKeywords: 'secure file sharing, file security, encryption, data protection, cybersecurity'
  },
  {
    id: 2,
    slug: 'peer-to-peer-technology-explained',
    title: 'Peer-to-Peer Technology: The Future of File Sharing',
    excerpt: 'Discover how peer-to-peer technology is revolutionizing file sharing and why it\'s becoming the preferred method for secure data transfer.',
    content: `
      <p>Peer-to-peer (P2P) technology has emerged as one of the most innovative approaches to file sharing, offering significant advantages over traditional client-server models. This decentralized approach is transforming how we think about data transfer and collaboration.</p>

      <h2>What is Peer-to-Peer Technology?</h2>
      <p>Peer-to-peer technology allows devices to communicate directly with each other without relying on a central server. In a P2P network, each device (or "peer") can act as both a client and a server, sharing resources and data directly with other peers in the network.</p>

      <h2>Advantages of P2P File Sharing</h2>
      
      <h3>1. Enhanced Security</h3>
      <p>P2P technology eliminates the need for a central server, reducing the risk of data breaches and unauthorized access. Files are transferred directly between devices, minimizing exposure to potential security threats.</p>

      <h3>2. Improved Performance</h3>
      <p>By distributing the load across multiple peers, P2P networks can achieve faster transfer speeds and better reliability. This is especially beneficial for large file transfers and high-traffic scenarios.</p>

      <h3>3. Cost Efficiency</h3>
      <p>P2P networks don't require expensive server infrastructure, making them more cost-effective for both providers and users. This cost savings can be passed on to customers in the form of lower fees or free services.</p>

      <h3>4. Scalability</h3>
      <p>P2P networks can easily scale to accommodate more users without significant infrastructure investments. As more peers join the network, the overall capacity and performance improve.</p>

      <h2>How P2P File Sharing Works</h2>
      <p>The P2P file sharing process typically involves several key steps:</p>
      <ol>
        <li><strong>Discovery:</strong> Peers discover each other through various methods, such as DHT (Distributed Hash Table) or centralized trackers</li>
        <li><strong>Connection:</strong> Once peers are discovered, they establish direct connections</li>
        <li><strong>File Request:</strong> A peer requests a specific file from another peer</li>
        <li><strong>Transfer:</strong> The file is transferred directly between the two peers</li>
        <li><strong>Verification:</strong> The receiving peer verifies the integrity of the transferred file</li>
      </ol>

      <h2>Security Considerations</h2>
      <p>While P2P technology offers many advantages, it's important to consider security implications:</p>
      <ul>
        <li>Implement end-to-end encryption for all file transfers</li>
        <li>Use secure authentication methods</li>
        <li>Regularly update software and security patches</li>
        <li>Monitor network activity for suspicious behavior</li>
        <li>Implement access controls and user management</li>
      </ul>

      <h2>The Future of P2P Technology</h2>
      <p>P2P technology is continuously evolving, with new innovations emerging regularly. Some exciting developments include:</p>
      <ul>
        <li><strong>Blockchain Integration:</strong> Using blockchain technology to enhance security and transparency</li>
        <li><strong>AI-Powered Optimization:</strong> Machine learning algorithms to optimize network performance</li>
        <li><strong>Edge Computing:</strong> Bringing P2P capabilities to edge devices and IoT networks</li>
        <li><strong>Quantum-Safe Encryption:</strong> Preparing for the future of quantum computing</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Peer-to-peer technology represents the future of file sharing, offering enhanced security, performance, and cost efficiency. As this technology continues to evolve, we can expect to see even more innovative applications and improvements in the years to come.</p>
    `,
    author: 'Muqeet Ahmed',
    authorRole: 'Technology Expert',
    authorAvatar: 'MA',
    publishDate: '2024-01-10',
    readTime: '6 min read',
    category: 'Technology',
    tags: ['P2P', 'Technology', 'File Sharing', 'Decentralized'],
    featuredImage: '/api/placeholder/800/400',
    seoTitle: 'Peer-to-Peer Technology: Future of File Sharing | Dropsos',
    seoDescription: 'Discover how peer-to-peer technology is revolutionizing file sharing with enhanced security, performance, and cost efficiency.',
    seoKeywords: 'peer to peer, P2P technology, file sharing, decentralized, blockchain'
  },
  {
    id: 3,
    slug: 'enterprise-file-sharing-solutions',
    title: 'Enterprise File Sharing Solutions: A Complete Guide',
    excerpt: 'Everything you need to know about enterprise file sharing solutions, from security requirements to implementation best practices.',
    content: `
      <p>Enterprise file sharing has evolved significantly in recent years, with organizations requiring robust, secure, and scalable solutions to meet their growing collaboration needs. This comprehensive guide explores the key considerations and best practices for implementing enterprise file sharing solutions.</p>

      <h2>Understanding Enterprise Requirements</h2>
      <p>Enterprise file sharing solutions must meet specific requirements that differ from consumer-grade alternatives:</p>
      
      <h3>Security and Compliance</h3>
      <p>Enterprises need solutions that comply with various regulations such as GDPR, HIPAA, SOX, and industry-specific standards. This includes:</p>
      <ul>
        <li>End-to-end encryption for data in transit and at rest</li>
        <li>Advanced access controls and user management</li>
        <li>Comprehensive audit trails and logging</li>
        <li>Data loss prevention (DLP) capabilities</li>
        <li>Integration with existing security infrastructure</li>
      </ul>

      <h3>Scalability and Performance</h3>
      <p>Enterprise solutions must handle large volumes of data and users while maintaining performance:</p>
      <ul>
        <li>Support for thousands of concurrent users</li>
        <li>High-speed file transfers for large files</li>
        <li>Global content delivery networks (CDN)</li>
        <li>Load balancing and redundancy</li>
        <li>99.9% uptime guarantees</li>
      </ul>

      <h2>Key Features to Look For</h2>
      
      <h3>1. Advanced Security Features</h3>
      <p>Look for solutions that offer:</p>
      <ul>
        <li>Multi-factor authentication (MFA)</li>
        <li>Single sign-on (SSO) integration</li>
        <li>Role-based access controls (RBAC)</li>
        <li>Data encryption at rest and in transit</li>
        <li>Secure file sharing with password protection</li>
        <li>Automatic file expiration and access revocation</li>
      </ul>

      <h3>2. Collaboration Tools</h3>
      <p>Modern enterprise solutions should include:</p>
      <ul>
        <li>Real-time collaboration features</li>
        <li>Version control and file history</li>
        <li>Comment and annotation capabilities</li>
        <li>Workflow automation</li>
        <li>Integration with productivity tools</li>
      </ul>

      <h3>3. Administrative Controls</h3>
      <p>Enterprise administrators need:</p>
      <ul>
        <li>Centralized user management</li>
        <li>Policy enforcement and compliance monitoring</li>
        <li>Detailed reporting and analytics</li>
        <li>Custom branding and white-labeling</li>
        <li>API access for custom integrations</li>
      </ul>

      <h2>Implementation Best Practices</h2>
      
      <h3>1. Planning and Assessment</h3>
      <p>Before implementing any solution:</p>
      <ul>
        <li>Conduct a thorough needs assessment</li>
        <li>Identify security and compliance requirements</li>
        <li>Evaluate existing infrastructure and integrations</li>
        <li>Define success metrics and KPIs</li>
        <li>Create a detailed implementation timeline</li>
      </ul>

      <h3>2. Security Implementation</h3>
      <p>Security should be a top priority:</p>
      <ul>
        <li>Implement zero-trust security principles</li>
        <li>Use strong encryption standards (AES-256)</li>
        <li>Regular security audits and penetration testing</li>
        <li>Employee training and awareness programs</li>
        <li>Incident response planning</li>
      </ul>

      <h3>3. User Adoption</h3>
      <p>Ensure successful adoption:</p>
      <ul>
        <li>Provide comprehensive training</li>
        <li>Create user-friendly interfaces</li>
        <li>Offer ongoing support and documentation</li>
        <li>Gather feedback and iterate</li>
        <li>Measure adoption metrics</li>
      </ul>

      <h2>Choosing the Right Solution</h2>
      <p>When evaluating enterprise file sharing solutions, consider:</p>
      <ul>
        <li><strong>Security:</strong> Does it meet your security and compliance requirements?</li>
        <li><strong>Scalability:</strong> Can it grow with your organization?</li>
        <li><strong>Integration:</strong> Does it integrate with your existing tools?</li>
        <li><strong>Support:</strong> What level of support is available?</li>
        <li><strong>Cost:</strong> What is the total cost of ownership?</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Enterprise file sharing solutions are critical for modern organizations. By carefully evaluating your needs and implementing best practices, you can choose and deploy a solution that enhances collaboration while maintaining security and compliance.</p>
    `,
    author: 'Muqeet Ahmed',
    authorRole: 'Enterprise Solutions Expert',
    authorAvatar: 'MA',
    publishDate: '2024-01-05',
    readTime: '10 min read',
    category: 'Enterprise',
    tags: ['Enterprise', 'File Sharing', 'Security', 'Compliance'],
    featuredImage: '/api/placeholder/800/400',
    seoTitle: 'Enterprise File Sharing Solutions: Complete Guide | Dropsos',
    seoDescription: 'Complete guide to enterprise file sharing solutions including security requirements, implementation best practices, and solution evaluation.',
    seoKeywords: 'enterprise file sharing, business file sharing, enterprise security, compliance, file sharing solutions'
  }
];

export default function BlogPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [isVisible, setIsVisible] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<typeof blogPosts>([]);

  useEffect(() => {
    setIsVisible(true);
    // Get related posts (excluding current post)
    const related = blogPosts.filter(post => post.slug !== slug).slice(0, 3);
    setRelatedPosts(related);
  }, [slug]);

  // Find the current blog post
  const currentPost = blogPosts.find(post => post.slug === slug);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/blog')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

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
                  {currentPost.category}
                </span>
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{currentPost.publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{currentPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentPost.title}
                </span>
              </h1>

              {/* Excerpt */}
              <p className="text-2xl text-gray-300 mb-10 leading-relaxed font-light">
                {currentPost.excerpt}
              </p>

              {/* Enhanced Author Info */}
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{currentPost.authorAvatar}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{currentPost.author}</h3>
                    <p className="text-blue-400 font-semibold">{currentPost.authorRole}</p>
                    <p className="text-gray-400 text-sm">Full Stack Developer & DevOps Engineer</p>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-3">
                  <a href="https://github.com/muqeetahmed" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/muqeetahmed" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/muqeetahmed" className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-600/50 transition-colors">
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
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
                style={{
                  color: '#e2e8f0',
                  lineHeight: '1.7'
                }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags.map((tag, index) => (
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
                  {relatedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => router.push(`/blog/${post.slug}`)}
                      className="group cursor-pointer bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-xs">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {post.excerpt}
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
