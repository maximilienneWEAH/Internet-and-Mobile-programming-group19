/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart3, Smartphone, Globe, LogOut } from 'lucide-react';
import { SubscriberUser } from '../types';

interface HeaderProps {
  activeTab: 'simulator' | 'dashboard';
  setActiveTab: (tab: 'simulator' | 'dashboard') => void;
  reportsCount: number;
  currentUser?: SubscriberUser;
  onLogout?: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  reportsCount,
  currentUser,
  onLogout
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* SVG Render of NetPulse Logo */}
          <div className="flex items-center space-x-3 select-none">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Sphere/Circle with subtle radial blue-green gradient */}
                <defs>
                  <linearGradient id="logoGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0066FF" />
                    <stop offset="40%" stopColor="#00CC99" />
                    <stop offset="100%" stopColor="#80E060" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" />
                
                {/* WiFi / Radio Wave Bars on Left (White) */}
                <path 
                  d="M48 35C41.5 35 36.5 39.5 35.5 40.5M48 26C37.5 26.5 29.5 34.5 27.5 36.5M48 17C33.5 17.5 22.5 29.5 19.5 32.5" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                />
                
                {/* Heartbeat / Pulse Wave on Right (White) */}
                <path 
                  d="M43 55H49.5L53.5 32L59.5 68L64.5 45L68.5 55H80" 
                  stroke="white" 
                  strokeWidth="4.5" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <div id="logo-text" className="flex items-baseline leading-none">
                <span className="text-2xl font-black tracking-tight text-blue-600 font-sans">Net</span>
                <span className="text-2xl font-black tracking-tight text-emerald-500 font-sans">Pulse</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono mt-0.5">
                Cameroon QoS Audit Hub
              </span>
            </div>
          </div>

          {/* Tab Navigation (Only visible for Super Admin to supervise both layouts) */}
          {currentUser?.role === 'admin' ? (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                id="nav-btn-simulator"
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'simulator'
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Subscriber Simulator</span>
                <span className="sm:hidden">Simulator</span>
              </button>
              <button
                id="nav-btn-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-emerald-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Regulator Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
                {reportsCount > 0 && (
                  <span className="ml-1 bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-mono">
                    {reportsCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            /* Simple text title when logged in as Subscriber or Operator, denoting active workspace layout */
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 font-mono uppercase bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span>
                {currentUser?.role === 'operator' 
                  ? `AUDITING INTEGRITY CARRIER DATA` 
                  : `CONNECTED SUBSCRIBER TELEMETRY FEED`}
              </span>
            </div>
          )}

          {/* User Session Widget & Quick Logout */}
          {currentUser && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-black text-slate-800 leading-none">{currentUser.name}</span>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {currentUser.role === 'admin' 
                    ? 'Super Admin' 
                    : currentUser.role === 'operator' 
                      ? `${currentUser.operatorName} Auditor` 
                      : 'Subscriber'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Disconnect your current session"
                className="flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-extrabold text-xs px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
