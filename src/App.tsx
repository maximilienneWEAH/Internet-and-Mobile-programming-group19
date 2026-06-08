/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import MobileSimulator from './components/MobileSimulator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { QoEReport, OperatorComparisonStats, RegionSummary, SubscriberUser } from './types';
import { RefreshCw, Signal, Sparkles, Smartphone, BarChart3, AlertCircle } from 'lucide-react';

export default function App() {
  // Mount persistent session state from localStorage
  const [currentUser, setCurrentUser] = useState<SubscriberUser | null>(() => {
    const saved = localStorage.getItem('netpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'simulator' | 'dashboard'>('simulator');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [reports, setReports] = useState<QoEReport[]>([]);
  const [stats, setStats] = useState<OperatorComparisonStats[]>([]);
  const [regionStats, setRegionStats] = useState<RegionSummary[]>([]);
  const [users, setUsers] = useState<SubscriberUser[]>([]);
  const [totals, setTotals] = useState({
    totalSubmissions: 0,
    avgOverallQoE: 0,
    avgSpeed: 0,
    latency: 0
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Redirect users to their specific dashboard based on their role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'operator') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('simulator');
      }
    }
  }, [currentUser]);

  // Fetch the data from the Express backend API
  const fetchTelemetryData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/reports');
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
        setStats(data.stats);
        setRegionStats(data.regionStats);
        setTotals(data.totals);
        if (data.users) {
          setUsers(data.users);
        }
      } else {
        setError(data.error || 'Failed to retrieve database contents.');
      }
    } catch (err: any) {
      setError('Could not connect to full-stack server state. Please ensure server.ts is booting.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryData();
  }, []);

  if (!currentUser) {
    return (
      <div id="netpulse-auth-root" className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 selection:bg-blue-150 selection:text-blue-900">
        <LoginPage 
          onLoginSuccess={(usr) => {
            setCurrentUser(usr);
            localStorage.setItem('netpulse_user', JSON.stringify(usr));
          }} 
        />
      </div>
    );
  }

  return (
    <div 
      id="netpulse-root" 
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-150 selection:text-blue-900 transition-colors duration-300 ${
        themeMode === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      
      {/* Header with Logo, tab controller, active user info, and Sign Out button - Only on admin/operator regulator dashboard */}
      {activeTab === 'dashboard' && (
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          reportsCount={reports.length}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem('netpulse_user');
            setActiveTab('simulator');
          }}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-widest block font-mono">
                Booting NetPulse
              </span>
              <p className="text-xs text-slate-400">Loading Cameroon national Quality of Experience telemetries...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-lg mx-auto text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-red-800">Connection Error</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error}
            </p>
            <button 
              onClick={fetchTelemetryData}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            

            {/* Render view conditionally depending on roles */}
            {activeTab === 'simulator' ? (
              <MobileSimulator 
                onReportSubmitted={fetchTelemetryData} 
                users={users} 
                currentUser={currentUser} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                onLogout={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('netpulse_user');
                  setActiveTab('simulator');
                }}
              />
            ) : (
              <AnalyticsDashboard 
                reports={reports}
                stats={stats}
                regionStats={regionStats}
                totals={totals}
                users={users}
                onRefreshUsers={fetchTelemetryData}
                currentUser={currentUser}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
              />
            )}

          </div>
        )}

      </main>

      {activeTab === 'dashboard' && (
        <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400">
          <div className="max-w-7xl mx-auto px-4 text-xs font-mono space-y-2">
            <p>© 2026 NetPulse Cameroon Platform — All Rights Reserved.</p>
            <p className="text-[10px] text-slate-400/80">
              Compliant with Telecommunications Regulatory Board (ART) QoS reporting schemas under the Cameroon Telecom Act.
            </p>
          </div>
        </footer>
      )}

    </div>
  );
}
