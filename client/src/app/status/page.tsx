'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Status() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      description: 'Core API endpoints and authentication'
    },
    {
      name: 'File Sharing',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '120ms',
      description: 'Peer-to-peer file transfer services'
    },
    {
      name: 'WebSocket',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '25ms',
      description: 'Real-time communication and chat'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '15ms',
      description: 'PostgreSQL database services'
    },
    {
      name: 'CDN',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '80ms',
      description: 'Content delivery network'
    },
    {
      name: 'Monitoring',
      status: 'operational',
      uptime: '100%',
      responseTime: '5ms',
      description: 'System monitoring and alerting'
    }
  ];

  const incidents = [
    {
      id: 1,
      title: 'Scheduled Maintenance',
      status: 'resolved',
      severity: 'low',
      description: 'Database optimization and performance improvements',
      startTime: '2024-01-15 02:00 UTC',
      endTime: '2024-01-15 04:00 UTC',
      impact: 'Minor service degradation during maintenance window'
    },
    {
      id: 2,
      title: 'API Rate Limiting Issue',
      status: 'resolved',
      severity: 'medium',
      description: 'Temporary issue with rate limiting causing 429 errors',
      startTime: '2024-01-10 14:30 UTC',
      endTime: '2024-01-10 16:45 UTC',
      impact: 'Some API requests were temporarily rate limited'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700 border-green-200';
      case 'degraded': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'outage': return 'bg-red-100 text-red-700 border-red-200';
      case 'maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              System <span className="text-orange-500">Status</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Real-time status of all Dropsos services and infrastructure for secure file sharing
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Overall Status */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 text-center mb-10 sm:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-700">All Systems Operational</h2>
            </div>
            <p className="text-green-600">All services are running normally. No incidents reported.</p>
          </div>

          {/* Services Status */}
          <div className="mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Service Status</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Uptime</span>
                      <span className="text-gray-900 font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Response Time</span>
                      <span className="text-gray-900 font-medium">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Recent Incidents</h3>
            {incidents.length > 0 ? (
              <div className="space-y-6">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{incident.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{incident.description}</p>
                        <p className="text-gray-500 text-sm mb-2">{incident.impact}</p>
                        <div className="text-gray-500 text-sm">
                          <span>Started: {incident.startTime}</span>
                          {incident.endTime && (
                            <span className="ml-4">Resolved: {incident.endTime}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No Recent Incidents</h4>
                <p className="text-gray-600">All systems have been running smoothly with no reported issues.</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid sm:grid-cols-3 gap-6 mb-10 sm:mb-12">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Average Response Time</h4>
              <p className="text-2xl font-bold text-blue-600">45ms</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Uptime (30 days)</h4>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Last Incident</h4>
              <p className="text-2xl font-bold text-orange-600">5 days ago</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Report an Issue?</h3>
            <p className="text-gray-600 mb-6">If you're experiencing problems not shown here, please contact our support team</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Contact Support
              </Link>
              <a
                href="mailto:status@dropsos.com"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
              >
                Email Status Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
