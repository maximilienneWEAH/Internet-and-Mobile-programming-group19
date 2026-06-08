/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  Activity, 
  Wifi, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Building, 
  Phone 
} from 'lucide-react';
import { SubscriberUser } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: SubscriberUser) => void;
}

const CAMEROON_REGIONS = [
  'Center',
  'Littoral',
  'West',
  'Southwest',
  'Northwest',
  'North',
  'Far North',
  'Adamawa',
  'East',
  'South'
];

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup States
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Center');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin 
      ? { email, password }
      : { name, email, password, phoneNumber, city, region };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(isLogin ? 'Authentication successful! Redirecting...' : 'Account created successfully! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1200);
      } else {
        setError(data.error || 'Authentication failed. Please verify your entries.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Connection to NetPulse server failed. Check network availability.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* LEFT SIDE: Visual App Description and Feature Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        
        {/* Abstract Background Accents */}
        <div className="absolute top-[-20%] left-[-20%] w-[85%] h-[85%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[75%] h-[75%] bg-emerald-500/10 rounded-full blur-[100px]" />
        
        {/* Header Branding */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradLogin" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="40%" stopColor="#00CC99" />
                  <stop offset="100%" stopColor="#80E060" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGradLogin)" />
              <path d="M48 35C41.5 35 36.5 39.5 35.5 40.5M48 26C37.5 26.5 29.5 34.5 27.5 36.5M48 17C33.5 17.5 22.5 29.5 19.5 32.5" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <path d="M43 55H49.5L53.5 32L59.5 68L64.5 45L68.5 55H80" stroke="white" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline leading-none">
              <span className="text-2xl font-black tracking-tight text-white font-sans">Net</span>
              <span className="text-2xl font-black tracking-tight text-emerald-400 font-sans">Pulse</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
              Cameroon QoS Audit Hub
            </span>
          </div>
        </div>

        {/* Centerpiece Image Showcase related to Network Monitoring */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="space-y-3">
            <span className="bg-slate-900 border border-slate-800 text-blue-400 text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-widest inline-block">
              REAL-TIME OPERATOR AUDITING
            </span>
            <h1 className="text-3.5xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Bi-Directional Telemetric Signaling Dashboard
            </h1>
            <p className="text-slate-400 text-xs xl:text-sm leading-relaxed max-w-lg">
              Empowering Cameroonian subscribers to track network performance indicators, log localized signal drops, and analyze real-time operator QoE profiles.
            </p>
          </div>

          {/* Premium Framed Image Component */}
          <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-2.5 shadow-2xl transition-all duration-300 hover:border-slate-700/80">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 rounded-2xl opacity-60" />
            <img 
              src="/src/assets/images/netpulse_monitoring_monitor_1780940860579.png" 
              alt="Real-Time Network Telemetries & QoS Monitor Illustration" 
              className="w-full h-auto aspect-[16/10] object-cover rounded-xl shadow-inner border border-slate-805"
              referrerPolicy="no-referrer"
            />
            
            {/* Visual floating badge */}
            <div className="absolute bottom-5 right-5 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] font-mono font-bold tracking-wider text-slate-300 uppercase">Interactive Node Monitor Live</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 font-mono relative z-10 flex justify-between border-t border-slate-900/60 pt-4">
          <span>ART REGULATOR NETWORK ACT COMPLIANT</span>
          <span>© 2026 NETPULSE</span>
        </div>

      </div>

      {/* RIGHT SIDE: Interactive Login/Signup Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-gradient-to-b from-slate-900 to-slate-950">
        
        {/* Ambient mobile decoration backgrounds */}
        <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[90px] lg:hidden" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Logo on top for small viewport screens only */}
          <div className="flex items-center space-x-2.5 lg:hidden justify-center pb-4">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="url(#logoGradLogin)" />
              <path d="M48 35C41.5 35 36.5 39.5 35.5 40.5M48 26C37.5 26.5 29.5 34.5 27.5 36.5M48 17C33.5 17.5 22.5 29.5 19.5 32.5" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <path d="M43 55H49.5L53.5 32L59.5 68L64.5 45L68.5 55H80" stroke="white" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-extrabold text-white">NetPulse Cameroon</span>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? 'Sign Into NetPulse' : 'Create Subscriber Profile'}
            </h2>
            <p className="text-slate-400 text-xs">
              {isLogin 
                ? 'Access your operator, regulatory database or subscriber simulator.' 
                : 'Sign up to audit signal strengths, write QoE comments and synchronize speedtest metrics.'}
            </p>
          </div>

          {/* Quick seeded login hints to aid the tester */}
          {isLogin && (
            <div className="p-3.5 bg-slate-850 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">DEMO PROFILE CREDENTIALS:</span>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-350">
                <div className="bg-slate-900/60 p-2 rounded-xl text-center">
                  <span className="font-bold text-white block">Subscriber</span>
                  <span className="text-[10px] block text-slate-400 select-all">m.ngo@gmail.com</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">password</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl text-center">
                  <span className="font-bold text-white block">Operator</span>
                  <span className="text-[10px] block text-slate-400 select-all">mtn@operator.cm</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">mtn</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl text-center">
                  <span className="font-bold text-white block">Super Admin</span>
                  <span className="text-[10px] block text-slate-400 select-all">admin@netpulse.cm</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">admin</span>
                </div>
              </div>
            </div>
          )}

          {/* Error and Success Indicators */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-550 text-rose-250 text-xs px-4 py-3.5 rounded-2xl flex items-start space-x-2.5 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-555 text-emerald-250 text-xs px-4 py-3.5 rounded-2xl flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Conditional Fields ONLY for register */}
            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="Enter your first and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-slate-850 hover:bg-slate-800 focus:bg-slate-800 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                </div>

                {/* Grid for parameters */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. +237 671..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs bg-slate-850 border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-9 pr-3 py-3 outline-none"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">City / District</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Douala"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs bg-slate-850 border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-9 pr-3 py-3 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Region Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Cameroon Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs bg-slate-850 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-3 outline-none"
                  >
                    {CAMEROON_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg} Region</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. user@netpulse.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-850 hover:bg-slate-800 focus:bg-slate-800 border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Password</label>
                {isLogin && (
                  <span className="text-[10px] text-blue-400 font-mono hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-850 hover:bg-slate-800 focus:bg-slate-800 border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-10 pr-10 py-3 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-355 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-705 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <circle className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span>{isLogin ? 'Log In to Dashboard' : 'Complete Registration'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login State */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <span>Do not have an account? <strong className="text-blue-400 hover:underline">Sign up as subscriber</strong></span>
              ) : (
                <span>Already have an account? <strong className="text-blue-400 hover:underline">Log in here</strong></span>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
