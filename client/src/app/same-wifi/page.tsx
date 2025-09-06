'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SameWifiPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'text' | 'file' | 'video'>('text');
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');

    const tabs = [
        { id: 'text', label: 'Share Text', icon: '📝' },
        { id: 'file', label: 'Share File', icon: '📁' },
        { id: 'video', label: 'Share Video', icon: '🎥' }
    ] as const;

    const handleTextShare = () => {
        if (textContent.trim()) {
            // TODO: Implement text sharing logic
            console.log('Sharing text:', textContent);
            alert('Text shared successfully!');
        }
    };

    const handleFileShare = () => {
        if (selectedFile) {
            // TODO: Implement file sharing logic
            console.log('Sharing file:', selectedFile.name);
            alert(`File "${selectedFile.name}" shared successfully!`);
        }
    };

    const handleVideoShare = () => {
        if (videoUrl.trim()) {
            // TODO: Implement video sharing logic
            console.log('Sharing video:', videoUrl);
            alert('Video shared successfully!');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="mb-8 group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <div className="flex justify-center w-full">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 backdrop-blur-sm mb-4 lg:mb-6">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-xs text-purple-300 font-semibold tracking-wide">SAME WIFI</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout - Three Column */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">

                        {/* Left Side - SHARE */}
                        <div className="w-full lg:w-1/6 flex-shrink-0">
                            <div className="lg:sticky lg:top-24">


                                {/* Mobile: Horizontal Title */}
                                <h1 className="lg:hidden text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 text-center">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                                        Share Anything
                                    </span>
                                </h1>

                                {/* Desktop: SHARE - Left Side */}
                                <h1 className="hidden lg:block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
                                    <div className="flex flex-col items-center space-y-1">
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.1s' }}>
                                            S
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.2s' }}>
                                            H
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>
                                            A
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>
                                            R
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                                            E
                                        </span>
                                    </div>
                                </h1>
                            </div>
                        </div>

                        {/* Center - Input Forms */}
                        <div className="w-full lg:w-2/3 flex-1">
                            {/* Tab Navigation */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group relative px-6 py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25 transform scale-105'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-purple-400/30'
                                            }`}
                                    >
                                        <span className="flex items-center justify-center">
                                            <span className="text-xl mr-2">{tab.icon}</span>
                                            {tab.label}
                                        </span>
                                        {activeTab === tab.id && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8">
                                {/* Text Sharing Tab */}
                                {activeTab === 'text' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                                <span className="text-2xl">📝</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Share Text Content</h3>
                                            <p className="text-gray-400">Type or paste your text content to share instantly</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Text Content
                                            </label>
                                            <textarea
                                                value={textContent}
                                                onChange={(e) => setTextContent(e.target.value)}
                                                placeholder="Enter your text content here..."
                                                className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                            />
                                            <div className="flex justify-between items-center text-sm text-gray-400">
                                                <span>{textContent.length} characters</span>
                                                <span>Max 10,000 characters</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleTextShare}
                                            disabled={!textContent.trim()}
                                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                            Share Text Content
                                        </button>
                                    </div>
                                )}

                                {/* File Sharing Tab */}
                                {activeTab === 'file' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                                                <span className="text-2xl">📁</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Share Files</h3>
                                            <p className="text-gray-400">Upload and share files with devices on the same network</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Select File
                                            </label>
                                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-400/50 transition-colors duration-300">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="file-upload"
                                                    accept="*/*"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer flex flex-col items-center space-y-4"
                                                >
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">Click to upload or drag and drop</p>
                                                        <p className="text-gray-400 text-sm">Any file type supported</p>
                                                    </div>
                                                </label>
                                            </div>

                                            {selectedFile && (
                                                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">
                                                                {selectedFile.name.split('.').pop()?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white font-medium truncate">{selectedFile.name}</p>
                                                            <p className="text-gray-400 text-sm">
                                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedFile(null)}
                                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleFileShare}
                                            disabled={!selectedFile}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                            Share File
                                        </button>
                                    </div>
                                )}

                                {/* Video Sharing Tab */}
                                {activeTab === 'video' && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                                <span className="text-2xl">🎥</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Share Video</h3>
                                            <p className="text-gray-400">Share video content or video files with other devices</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Video URL or File
                                            </label>
                                            <div className="space-y-4">
                                                <input
                                                    type="url"
                                                    value={videoUrl}
                                                    onChange={(e) => setVideoUrl(e.target.value)}
                                                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                                <div className="text-center text-gray-400 text-sm">or</div>
                                                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-red-400/50 transition-colors duration-300">
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        className="hidden"
                                                        id="video-upload"
                                                    />
                                                    <label
                                                        htmlFor="video-upload"
                                                        className="cursor-pointer flex flex-col items-center space-y-4"
                                                    >
                                                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">Upload video file</p>
                                                            <p className="text-gray-400 text-sm">MP4, AVI, MOV, etc.</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleVideoShare}
                                            disabled={!videoUrl.trim()}
                                            className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                                        >
                                            Share Video
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ANY - Horizontal at bottom of input section */}
                            <div className="mt-6 text-center">
                                <h1 className="hidden lg:block text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse inline-block" style={{ animationDelay: '0.6s' }}>
                                        A
                                    </span>
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse inline-block ml-2" style={{ animationDelay: '0.7s' }}>
                                        N
                                    </span>
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse inline-block ml-2" style={{ animationDelay: '0.8s' }}>
                                        Y
                                    </span>
                                </h1>
                            </div>
                        </div>

                        {/* Right Side - THING */}
                        <div className="w-full lg:w-1/6 flex-shrink-0">
                            <div className="lg:sticky lg:top-24">
                                {/* Desktop: THING - Right Side */}
                                <h1 className="hidden lg:block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
                                    <div className="flex flex-col items-center space-y-1">
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '1.0s' }}>
                                            T
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '1.1s' }}>
                                            H
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '1.2s' }}>
                                            I
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '1.3s' }}>
                                            N
                                        </span>
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse" style={{ animationDelay: '1.4s' }}>
                                            G
                                        </span>
                                    </div>
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        <div className="text-center">
                            <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                                Share text, files, and videos instantly with devices on the same WiFi network
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
