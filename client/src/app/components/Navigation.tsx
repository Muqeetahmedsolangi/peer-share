'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Menu items with proper routing
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠', href: '/' },
    { id: 'about', label: 'About', icon: 'ℹ️', href: '/about' },
    { id: 'blog', label: 'Blog', icon: '📝', href: '/blog' },
    { id: 'create-room', label: 'Create Room', icon: '➕', href: '/create-room' },
    { id: 'same-wifi', label: 'Same WiFi', icon: '📶', href: '/same-wifi' },
  ];

  // User menu items
  const userMenuItems = [
    { label: 'Profile', icon: '👤', action: () => console.log('Profile clicked') },
    { label: 'Settings', icon: '⚙️', action: () => console.log('Settings clicked') },
    { label: 'Help', icon: '❓', action: () => console.log('Help clicked') },
    { label: 'Sign Out', icon: '🚪', action: () => console.log('Sign out clicked') },
  ];

  // Get current active section based on pathname
  const getActiveSection = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'about';
    if (pathname === '/blog') return 'blog';
    if (pathname === '/create-room') return 'create-room';
    if (pathname === '/same-wifi') return 'same-wifi';
    return 'home';
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search focus management
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ease-out ${
          isScrolled 
            ? 'bg-slate-900/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/30' 
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Main Navigation Container - Fixed Width */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center w-full transition-all duration-500 ${
            isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'
          }`}>
            
            {/* Logo Section - Fixed Width */}
            <Link 
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group touch-manipulation flex-shrink-0 min-w-0"
              aria-label="Go to home page"
            >
              {/* Logo Icon */}
              <div className={`relative transition-all duration-700 rounded-xl group-hover:scale-105 flex-shrink-0 ${
                isScrolled 
                  ? 'w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 shadow-lg shadow-blue-500/25' 
                  : 'w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 shadow-xl shadow-blue-500/30'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className={`text-white transition-all duration-700 ${
                    isScrolled 
                      ? 'w-4 sm:w-5 h-4 sm:h-5' 
                      : 'w-5 sm:w-6 h-5 sm:h-6'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3-3 3m3 0v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                  </svg>
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-xl border-2 border-blue-400/30 animate-pulse group-hover:border-blue-300/50 transition-colors duration-500"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col min-w-0">
                <h1 className={`font-black tracking-tight transition-all duration-700 whitespace-nowrap ${
                  isScrolled 
                    ? 'text-lg sm:text-xl md:text-2xl' 
                    : 'text-xl sm:text-2xl md:text-3xl'
                }`}>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-cyan-300 transition-all duration-500">
                    Dropsos
                  </span>
                </h1>
                {!isScrolled && (
                  <p className="text-xs sm:text-sm text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity duration-500 -mt-1 hidden sm:block">
                    Enterprise File Sharing
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
              {menuItems.map((item, index) => {
                const isActive = getActiveSection() === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-500 touch-manipulation group overflow-hidden ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span className="text-sm group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Buttons - Hidden on Mobile */}
            <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all duration-300"
                aria-label="Search"
              >
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
                  aria-label="User menu"
                >
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-11 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/30 py-2 z-50">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button - Properly Contained */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all duration-300 flex-shrink-0"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-2xl border-t border-white/10 shadow-2xl shadow-black/30">
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item, index) => {
                const isActive = getActiveSection() === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500/20 text-white border border-blue-400/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">🔍</span>
                  <span>Search</span>
                </button>
                
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-2xl border-t border-white/10 shadow-2xl shadow-black/30 p-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        )}
      </nav>
    </>
  );
}