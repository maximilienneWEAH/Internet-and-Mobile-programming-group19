/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Gauge, 
  Tv, 
  History, 
  Wifi, 
  Server, 
  Play, 
  RotateCw, 
  CheckCircle2, 
  Video, 
  Globe, 
  Trash2, 
  Sliders, 
  ArrowDown, 
  ArrowUp, 
  Zap, 
  TrendingUp, 
  Clock, 
  Smartphone,
  ShieldCheck,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { OperatorName, NetworkType, LocationData } from '../types';

interface SpeedtestServer {
  id: string;
  name: string;
  provider: string;
  city: string;
  latitude: number;
  longitude: number;
}

const SPEEDTEST_SERVERS: SpeedtestServer[] = [
  { id: 'srv-1', name: 'Yaoundé Central Node', provider: 'MTN Cameroon', city: 'Yaoundé', latitude: 3.8767, longitude: 11.5116 },
  { id: 'srv-2', name: 'Douala Fiber Core', provider: 'Orange Cameroon', city: 'Douala', latitude: 4.0482, longitude: 9.7043 },
  { id: 'srv-3', name: 'Garoua Microwave Link', provider: 'Camtel', city: 'Garoua', latitude: 9.3031, longitude: 13.3976 },
  { id: 'srv-4', name: 'Bamenda Regional Server', provider: 'Nexttel', city: 'Bamenda', latitude: 5.9631, longitude: 10.1591 },
  { id: 'srv-5', name: 'West Africa Gate Link', provider: 'Equatorial Guinea Telecom', city: 'Bata', latitude: 1.8531, longitude: 9.7712 },
  { id: 'srv-6', name: 'Transatlantic Server', provider: 'Paris Core Global Connect', city: 'Paris', latitude: 48.8566, longitude: 2.3522 }
];

interface OoklaSpeedtestProps {
  operator: OperatorName;
  networkType: NetworkType;
  gpsLocation: LocationData;
  onTestCompleted: (result: {
    download: number;
    upload: number;
    latency: number;
    jitter: number;
    packetLoss: number;
  }) => void;
  themeMode: 'light' | 'dark';
}

interface SpeedtestResult {
  id: string;
  timestamp: string;
  operator: OperatorName;
  networkType: NetworkType;
  serverName: string;
  download: number;
  upload: number;
  pingIdle: number;
  pingDownload: number;
  pingUpload: number;
  jitter: number;
  packetLoss: number;
  connectionMode: 'Multi' | 'Single';
}

export default function OoklaSpeedtest({
  operator,
  networkType,
  gpsLocation,
  onTestCompleted,
  themeMode
}: OoklaSpeedtestProps) {
  const [subTab, setSubTab] = useState<'speed' | 'video' | 'history'>('speed');
  const [connectionMode, setConnectionMode] = useState<'Multi' | 'Single'>('Multi');
  const [selectedServerId, setSelectedServerId] = useState<string>('srv-1');
  const [showServerModal, setShowServerModal] = useState<boolean>(false);

  // Core Speedtest Engine States
  const [phase, setPhase] = useState<'idle' | 'pings' | 'download' | 'upload' | 'complete'>('idle');
  const [progress, setProgress] = useState<number>(0); // 0 to 100
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [currentMetricText, setCurrentMetricText] = useState<string>('START');
  
  // Real-time Wave Graph Samples
  const [graphSamples, setGraphSamples] = useState<number[]>([]);

  // Intermediate measurements
  const [pingIdle, setPingIdle] = useState<number>(0);
  const [pingDownload, setPingDownload] = useState<number>(0);
  const [pingUpload, setPingUpload] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);
  const [packetLoss, setPacketLoss] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);

  // Video Test States
  const [videoTestPhase, setVideoTestPhase] = useState<'idle' | 'testing-480p' | 'testing-720p' | 'testing-1080p' | 'testing-4k' | 'complete'>('idle');
  const [videoBufferProgress, setVideoBufferProgress] = useState<number>(0);
  const [videoStatusLog, setVideoStatusLog] = useState<string>('Ready to test streaming capability');
  const [videoResults, setVideoResults] = useState<{
    sdPass: boolean;
    hdPass: boolean;
    fhdPass: boolean;
    uhdPass: boolean;
    loadTime: number;
    bufferingRatio: number;
    maxResolution: string;
  } | null>(null);

  // Local Storage past speedtests history
  const [pastTests, setPastTests] = useState<SpeedtestResult[]>([]);

  // Selected Server object
  const activeServer = SPEEDTEST_SERVERS.find(s => s.id === selectedServerId) || SPEEDTEST_SERVERS[0];

  // Load history on mount
  useEffect(() => {
    const cached = localStorage.getItem('ookla_speedtest_history');
    if (cached) {
      try {
        setPastTests(JSON.parse(cached));
      } catch (e) {
        console.error('Error loading speedtest history', e);
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (newTests: SpeedtestResult[]) => {
    setPastTests(newTests);
    localStorage.setItem('ookla_speedtest_history', JSON.stringify(newTests));
  };

  // Calculate simulated Distance between subscriber and Speedtest server
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Basic Equirectangular distance approximation for performance (suitable for local/regional math)
    const R = 6371; // km
    const x = (lon2 - lon1) * Math.PI / 180 * Math.cos((lat1 + lat2) * Math.PI / 360 * 180);
    const y = (lat2 - lat1) * Math.PI / 180;
    const distanceKm = Math.sqrt(x * x + y * y) * R;
    return Math.round(distanceKm);
  };

  const getSimulatedBasePing = () => {
    const dist = calculateDistance(
      gpsLocation.latitude, 
      gpsLocation.longitude, 
      activeServer.latitude, 
      activeServer.longitude
    );

    // Speed of light in fiber is approx 1ms per 100km, routing overhead adds multiplying factors.
    let base = 10 + (dist / 80);
    
    // operator specific routing cycles
    if (operator === 'MTN Cameroon') base *= 0.95;
    if (operator === 'Orange Cameroon') base *= 1.02;
    if (operator === 'Nexttel') base *= 1.35;
    if (operator === 'Camtel') base *= 1.15;

    // network conditions
    if (networkType === '5G') base = base * 0.4;
    else if (networkType === '4G') base = base * 0.82;
    else if (networkType === '3G') base = base * 1.8 + 45;
    else base = base * 4.5 + 230; // 2G is horrible

    return Math.max(8, Math.round(base));
  };

  // Log helper for base operations
  const log15 = (x: number) => Math.log(x) / Math.log(15);

  // Handle Gauge angle based on current speed
  // 0 Mbps = -120 deg, 100 Mbps = 120 deg
  // Logarithmic scale to let low speeds sweep nicely while retaining 5G high speeds
  const getGaugeRotationAngle = (speed: number) => {
    if (speed <= 0) return -120;
    
    // Logarithmic scale representing up to 500 Mbps nicely
    const maxVal = networkType === '5G' ? 500 : 100;
    const norm = log15(speed + 1) / log15(maxVal + 1);
    const angle = -120 + 240 * Math.min(1.0, norm);
    return angle;
  };

  const startSpeedtest = () => {
    if (phase !== 'idle' && phase !== 'complete') return;

    setPhase('pings');
    setProgress(0);
    setGraphSamples([]);
    setCurrentSpeed(0);

    const basePing = getSimulatedBasePing();
    
    // Step 1: Simulated ping measurements (idle, loaded down, loaded up)
    let percent = 0;
    const pingTimer = setInterval(() => {
      percent += 5;
      setProgress(percent);
      
      // fluctuate numeric ping representation during tick
      const dPing = Math.round(basePing * (0.95 + Math.random() * 0.1));
      setCurrentSpeed(dPing);
      setCurrentMetricText('PINGING');

      if (percent >= 25) {
        clearInterval(pingTimer);
        
        const finalIdle = basePing;
        const finalJitter = Math.max(1, Math.round(basePing * (0.05 + Math.random() * 0.1)));
        const finalLoss = basePing > 150 ? parseFloat((1.2 + Math.random() * 2).toFixed(1)) : parseFloat((Math.random() * 0.2).toFixed(1));

        setPingIdle(finalIdle);
        setJitter(finalJitter);
        setPacketLoss(finalLoss);

        // Transition to Download QoS Stage
        setPhase('download');
        
        let maxDownload = 25; // 4G base standard
        if (networkType === '5G') maxDownload = 220;
        else if (networkType === '4G') maxDownload = 48;
        else if (networkType === '3G') maxDownload = 8.5;
        else maxDownload = 0.25;

        // Operator conditions
        if (operator === 'Orange Cameroon' && gpsLocation.region === 'Littoral') maxDownload *= 1.25;
        if (operator === 'MTN Cameroon' && gpsLocation.region === 'Center') maxDownload *= 1.18;
        if (operator === 'Camtel') maxDownload *= 0.92;
        if (operator === 'Nexttel') maxDownload *= 0.75;

        // Connection mode factor
        if (connectionMode === 'Single') maxDownload *= 0.80; // single thread gets lower throughput

        let dlPercent = 25;
        const dlSamples: number[] = [];

        const dlTimer = setInterval(() => {
          dlPercent += 4;
          setProgress(dlPercent);

          // Simulated speed curve with natural spike and stabilization
          let scaleFactor = 1.0;
          if (dlPercent < 45) {
            // spooling phase
            scaleFactor = (dlPercent - 25) / 20;
          } else {
            // stabilization with continuous ripple noise
            scaleFactor = 0.9 + Math.random() * 0.18;
          }

          const speedSample = parseFloat((maxDownload * scaleFactor).toFixed(1));
          setCurrentSpeed(speedSample);
          setCurrentMetricText('DOWNLOAD');
          dlSamples.push(speedSample);
          setGraphSamples(prev => [...prev, speedSample]);

          // Loaded download ping (typically elevated as downstream saturates)
          setPingDownload(Math.round(basePing * (1.15 + Math.random() * 0.35)));

          if (dlPercent >= 65) {
            clearInterval(dlTimer);
            const avgDl = parseFloat((dlSamples.slice(5).reduce((a, b) => a + b, 0) / (dlSamples.length - 5 || 1)).toFixed(1));
            setDownloadSpeed(avgDl);

            // Transition to Upload QoS Stage
            setPhase('upload');
            
            let maxUpload = 9;
            if (networkType === '5G') maxUpload = 74;
            else if (networkType === '4G') maxUpload = 16;
            else if (networkType === '3G') maxUpload = 2.2;
            else maxUpload = 0.08;

            if (connectionMode === 'Single') maxUpload *= 0.78;

            let ulPercent = 65;
            const ulSamples: number[] = [];

            const ulTimer = setInterval(() => {
              ulPercent += 5;
              setProgress(ulPercent);

              let scaleFactor = 1.0;
              if (ulPercent < 78) {
                scaleFactor = (ulPercent - 65) / 13;
              } else {
                scaleFactor = 0.88 + Math.random() * 0.22;
              }

              const speedSample = parseFloat((maxUpload * scaleFactor).toFixed(1));
              setCurrentSpeed(speedSample);
              setCurrentMetricText('UPLOAD');
              ulSamples.push(speedSample);
              setGraphSamples(prev => [...prev, speedSample]);

              // Loaded upload ping (usually highly elevated due to TCP bufferbloat in uplink)
              setPingUpload(Math.round(basePing * (1.45 + Math.random() * 0.85)));

              if (ulPercent >= 100) {
                clearInterval(ulTimer);
                const avgUl = parseFloat((ulSamples.slice(3).reduce((a, b) => a + b, 0) / (ulSamples.length - 3 || 1)).toFixed(1));
                setUploadSpeed(avgUl);

                // Run final calculations
                setPhase('complete');
                setProgress(100);
                setCurrentSpeed(0);
                setCurrentMetricText('GO');

                // Construct speedtest object
                const speedResult: SpeedtestResult = {
                  id: 'test-' + Math.random().toString(36).substr(2, 9),
                  timestamp: new Date().toISOString(),
                  operator,
                  networkType,
                  serverName: activeServer.name,
                  download: avgDl,
                  upload: avgUl,
                  pingIdle: basePing,
                  pingDownload: Math.round(basePing * 1.3),
                  pingUpload: Math.round(basePing * 1.8),
                  jitter: finalJitter,
                  packetLoss: finalLoss,
                  connectionMode
                };

                // Add to past tests list
                const updatedHistory = [speedResult, ...pastTests].slice(0, 50); // cap to 50
                saveHistory(updatedHistory);

                // Populate QoS form values in parent component
                onTestCompleted({
                  download: avgDl,
                  upload: avgUl,
                  latency: basePing,
                  jitter: finalJitter,
                  packetLoss: finalLoss
                });
              }
            }, 180);
          }
        }, 120);
      }
    }, 150);
  };

  // Run Ookla signature Video Capability test
  const runVideoStreamingTest = () => {
    if (videoTestPhase !== 'idle' && videoTestPhase !== 'complete') return;

    setVideoResults(null);
    setVideoBufferProgress(0);

    // Speed indicator to determine max capacity
    let activeBandwidth = downloadSpeed;
    if (activeBandwidth <= 0) {
      // simulate base bandwidth if they haven't done speedtest
      activeBandwidth = networkType === '5G' ? 85 : networkType === '4G' ? 18 : networkType === '3G' ? 3.5 : 0.15;
    }

    // Step 1: Testing SD 480p resolution (requires ~1.5 Mbps)
    setVideoTestPhase('testing-480p');
    setVideoStatusLog('Connecting to video server... testing SD Video (480p)');
    
    let buffer = 0;
    const timer480 = setInterval(() => {
      buffer += 12;
      setVideoBufferProgress(Math.min(100, buffer));

      if (buffer >= 100) {
        clearInterval(timer480);
        const passSD = activeBandwidth >= 1.2;

        // Step 2: Testing HD 720p resolution (requires ~3.5 Mbps)
        setVideoTestPhase('testing-720p');
        setVideoStatusLog('Buffering check... testing HD Video (720p)');
        
        let buffer2 = 0;
        const timer720 = setInterval(() => {
          buffer2 += 16;
          setVideoBufferProgress(Math.min(100, buffer2));

          if (buffer2 >= 100) {
            clearInterval(timer720);
            const passHD = activeBandwidth >= 3.2;

            // Step 3: Testing Full HD 1080p resolution (requires ~7.5 Mbps)
            setVideoTestPhase('testing-1080p');
            setVideoStatusLog('Simulating player feed... testing Full HD Video (1080p)');
            
            let buffer3 = 0;
            const timer1080 = setInterval(() => {
              buffer3 += 20;
              setVideoBufferProgress(Math.min(100, buffer3));

              if (buffer3 >= 100) {
                clearInterval(timer1080);
                const passFHD = activeBandwidth >= 7.0;

                // Step 4: Testing 4K Ultra HD resolution (requires ~25 Mbps)
                setVideoTestPhase('testing-4k');
                setVideoStatusLog('Heavy frame transmission... testing Ultra HD Video (4K)');
                
                let buffer4 = 0;
                const timer4k = setInterval(() => {
                  buffer4 += activeBandwidth >= 15 ? 15 : 6; // buffer extremely slowly if speed is low
                  setVideoBufferProgress(Math.min(100, buffer4));

                  if (buffer4 >= 100) {
                    clearInterval(timer4k);
                    const pass4K = activeBandwidth >= 22;

                    // Compute final parameters
                    const simulatedLoadTime = parseFloat((0.8 + (30 / activeBandwidth) + Math.random() * 0.4).toFixed(1));
                    const simulatedBufferRatio = activeBandwidth > 25 ? 0 : activeBandwidth > 10 ? 2 : activeBandwidth > 3 ? 12 : 54;
                    
                    let bestRes = '480p SD';
                    if (pass4K) bestRes = '2160p 4K UHD';
                    else if (passFHD) bestRes = '1085p Full HD';
                    else if (passHD) bestRes = '720p HD';
                    else if (!passSD) bestRes = 'Unsuitable for smooth streaming';

                    setVideoResults({
                      sdPass: passSD,
                      hdPass: passHD,
                      fhdPass: passFHD,
                      uhdPass: pass4K,
                      loadTime: simulatedLoadTime,
                      bufferingRatio: simulatedBufferRatio,
                      maxResolution: bestRes
                    });
                    
                    setVideoTestPhase('complete');
                    setVideoStatusLog(`Video test completed! Best streaming: ${bestRes}`);
                  }
                }, 150);
              }
            }, 150);
          }
        }, 150);
      }
    }, 150);
  };

  const clearHistory = () => {
    if (confirm('Verify: Would you like to clear your local speedtest history database?')) {
      saveHistory([]);
    }
  };

  return (
    <div className={`p-1.5 rounded-3xl transition-all duration-300 ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    } shadow-2xl border border-slate-800`}>
      
      {/* Mini Segmented Menu Controller mimicking Ookla style */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900 border border-slate-850 p-1.5 rounded-2xl mb-4">
        <button 
          onClick={() => setSubTab('speed')} 
          className={`py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
            subTab === 'speed' ? 'bg-indigo-650 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Speed</span>
        </button>
        <button 
          onClick={() => setSubTab('video')} 
          className={`py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
            subTab === 'video' ? 'bg-indigo-650 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Video Test</span>
        </button>
        <button 
          onClick={() => setSubTab('history')} 
          className={`py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
            subTab === 'history' ? 'bg-indigo-650 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History ({pastTests.length})</span>
        </button>
      </div>

      {subTab === 'speed' && (
        <div className="space-y-4">
          
          {/* Top Parameters Bar: Connection type, Server selectors */}
          <div className="flex justify-between items-center text-[10.5px] bg-slate-900 border border-slate-850 p-2 rounded-2xl">
            {/* Connection mode button */}
            <div className="flex items-center space-x-1">
              <span className="text-[9px] text-slate-500 font-bold font-mono">CONNECTIONS:</span>
              <button 
                onClick={() => setConnectionMode(connectionMode === 'Multi' ? 'Single' : 'Multi')}
                className="bg-indigo-550/25 hover:bg-indigo-550/40 border border-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded font-mono text-[9px] transition-colors"
              >
                {connectionMode}
              </button>
            </div>

            {/* Chosen Speedtest Server */}
            <button 
              onClick={() => setShowServerModal(true)}
              className="flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-indigo-505" />
              <span className="font-extrabold truncate max-w-[120px] underline decoration-indigo-400/40 decoration-dashed">
                {activeServer.provider} ({activeServer.city})
              </span>
            </button>
          </div>

          {/* ACTIVE OOKLA NEEDLE SPEEDOMETER GAUGE CANVAS */}
          <div className="relative aspect-square max-w-[250px] mx-auto flex flex-col justify-center items-center">
            
            {/* Pulsing Backlight Rings when testing */}
            {phase !== 'idle' && phase !== 'complete' && (
              <div className="absolute inset-4 rounded-full border border-indigo-550/20 animate-ping opacity-60"></div>
            )}
            
            {/* Circular Gauge Border Line */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-210" viewBox="0 0 100 100">
              {/* background tracking circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="41" 
                stroke="#111827" 
                strokeWidth="5" 
                strokeDasharray="180 300" 
                fill="transparent" 
              />
              {/* foreground speed level mapping slider */}
              <circle 
                cx="50" 
                cy="50" 
                r="41" 
                stroke="url(#speedomGrad)" 
                strokeWidth="5" 
                strokeDasharray="180 300" 
                strokeDashoffset={180 - (180 * progress) / 100}
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 200ms ease' }}
              />
              
              <defs>
                <linearGradient id="speedomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing inner indicator representing digital numbers */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              
              {/* Display current speed test category */}
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-mono animate-pulse">
                {currentMetricText}
              </span>

              {/* Huge speed reading value */}
              <span className="text-4xl font-extrabold tracking-tighter text-white font-mono leading-none my-1">
                {phase === 'pings' ? currentSpeed : (currentSpeed || downloadSpeed || '0.0')}
              </span>

              {/* Units indicator */}
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                {phase === 'pings' ? 'ms latency' : 'Mbps speed'}
              </span>

              {/* Server indicator */}
              <div className="text-[9px] text-slate-500 font-mono mt-2 uppercase">
                {operator}
              </div>
            </div>

            {/* Mechanical sweeping needle/gauge speed arrow */}
            <div 
              className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-indigo-500 to-rose-500 rounded-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 transition-transform duration-200"
              style={{
                transform: `rotate(${getGaugeRotationAngle(phase === 'pings' ? 0 : currentSpeed)}deg)`
              }}
            >
              <div className="w-3 h-3 bg-rose-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-lg shadow-rose-500/50"></div>
            </div>

            {/* Large START / GO button if idle */}
            {(phase === 'idle' || phase === 'complete') && (
              <button 
                onClick={startSpeedtest}
                className="absolute inset-15 bg-slate-900 border-4 border-indigo-600 rounded-full shadow-2xl hover:border-indigo-500 active:scale-95 transition-all text-white font-black text-2xl uppercase tracking-widest flex items-center justify-center"
              >
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-md">GO</span>
                </div>
              </button>
            )}
          </div>

          {/* Real-time Graph Visualizer (Wave graph) */}
          {phase !== 'idle' && graphSamples.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-2xl">
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">Live Connection Stability Plot:</span>
              <div className="h-10 w-full flex items-end space-x-[2px] pt-2">
                {graphSamples.map((sample, idx) => {
                  const maxSample = Math.max(...graphSamples, 10);
                  const barHeight = (sample / maxSample) * 100;
                  return (
                    <div 
                      key={idx} 
                      className="flex-1 bg-indigo-500 rounded-lg hover:bg-rose-500 transition-colors"
                      style={{ height: `${Math.max(15, barHeight)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* OOKLA QUALITY OF SERVICE DATA READOUT */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Download section */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl flex flex-col">
              <span className="text-[9.5px] text-slate-500 font-bold uppercase block mb-1">
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                Download
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-mono font-black text-white">
                  {downloadSpeed || '—'}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Mbps</span>
              </div>
              <div className="border-t border-slate-850 mt-1.5 pt-1.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span>Loaded Ping:</span>
                <span className="text-emerald-400 font-bold">{pingDownload ? `${pingDownload} ms` : '—'}</span>
              </div>
            </div>

            {/* Upload section */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl flex flex-col">
              <span className="text-[9.5px] text-slate-500 font-bold uppercase block mb-1">
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
                Upload
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-mono font-black text-white">
                  {uploadSpeed || '—'}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Mbps</span>
              </div>
              <div className="border-t border-slate-850 mt-1.5 pt-1.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span>Loaded Ping:</span>
                <span className="text-cyan-400 font-bold">{pingUpload ? `${pingUpload} ms` : '—'}</span>
              </div>
            </div>

          </div>

          {/* Idle Latency, Jitter, Packet Loss Indicators */}
          <div className="grid grid-cols-3 gap-1 px-1 py-1 bg-slate-900/40 rounded-xl border border-slate-850 text-center text-[10px] font-mono text-slate-300">
            <div className="p-1">
              <span className="text-slate-500 block text-[8px] uppercase">Ping Idle</span>
              <span className="font-bold text-amber-500 text-xs">{pingIdle ? `${pingIdle} ms` : '—'}</span>
            </div>
            <div className="p-1 border-x border-slate-850/80">
              <span className="text-slate-500 block text-[8px] uppercase">Jitter</span>
              <span className="font-bold text-teal-400 text-xs">{jitter ? `${jitter} ms` : '—'}</span>
            </div>
            <div className="p-1">
              <span className="text-slate-500 block text-[8px] uppercase">Loss Ratio</span>
              <span className="font-bold text-rose-500 text-xs">{packetLoss !== 0 ? `${packetLoss}%` : '0.0%'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[9.5px] leading-relaxed text-indigo-300/90 flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p>
              Ping measurements are continuously loaded to capture downstream buffers. Running tests will autofill the <strong>QoS Probe Form</strong> for submitting to the national dashboard!
            </p>
          </div>

        </div>
      )}

      {subTab === 'video' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Ookla Video Streaming Test
              </h3>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-relaxed">
              Find out what streaming video resolutions your current internet bandwidth can handle without stuttering or infinite loading cycles.
            </p>

            {videoTestPhase !== 'idle' ? (
              <div className="space-y-4 pt-2">
                
                {/* Simulated TV/Video Player with loading status */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-center items-center">
                  
                  {/* Streaming simulation details layout */}
                  {videoTestPhase !== 'complete' ? (
                    <div className="absolute inset-0 bg-slate-950/40 flex flex-col justify-center items-center">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                      <span className="text-xs font-mono font-bold text-white mt-4 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                        {videoTestPhase.replace('testing-', 'Testing ').toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                        TEST COMPLETED SUCCESSFULLY
                      </span>
                    </div>
                  )}

                  {/* Cute moving horizontal pixels mimicking playing video */}
                  <div className="w-full h-full opacity-20 flex flex-wrap gap-0.5 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="w-[11.5px] h-[11.5px] bg-indigo-500/20 rounded-xs animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                    ))}
                  </div>
                </div>

                {/* Progress loading bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>BUFFER LOAD DEPTH:</span>
                    <span>{videoBufferProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 rounded-full transition-all duration-150" style={{ width: `${videoBufferProgress}%` }}></div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-350 bg-slate-950 border border-slate-850 p-2 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                  <span>{videoStatusLog}</span>
                </div>

              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={runVideoStreamingTest}
                  className="w-full bg-gradient-to-r from-indigo-650 to-blue-650 hover:from-indigo-700 hover:to-blue-700 font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Measure Streaming Quality</span>
                </button>
              </div>
            )}

            {/* VIDEO CAPABILITY TEST RESULTS SCREEN */}
            {videoResults && (
              <div className="border-t border-slate-850 pt-3 space-y-3 mt-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">MAX COMMITTED RESOLUTION:</span>
                  <div className="text-base font-extrabold text-indigo-400 flex items-center space-x-1.5 font-mono">
                    <Tv className="w-4.5 h-4.5 text-indigo-500" />
                    <span>{videoResults.maxResolution}</span>
                  </div>
                </div>

                {/* Grid matrix indicators for pass/fails */}
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                  {[
                    { label: '480p SD', pass: videoResults.sdPass },
                    { label: '720p HD', pass: videoResults.hdPass },
                    { label: '1080p FHD', pass: videoResults.fhdPass },
                    { label: '4K UHD', pass: videoResults.uhdPass }
                  ].map((item) => (
                    <div 
                      key={item.label} 
                      className={`p-1.5 rounded-lg border flex flex-col items-center justify-center space-y-1 ${
                        item.pass
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-slate-950 border-slate-850 text-slate-550'
                      }`}
                    >
                      <span className="text-[8px] uppercase font-mono">{item.label}</span>
                      {item.pass ? <Check className="w-3 h-3" /> : <span className="text-[8px]">×</span>}
                    </div>
                  ))}
                </div>

                {/* Additional streaming metrics */}
                <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-850/80 pt-2.5 font-mono text-slate-405 text-slate-400">
                  <div className="flex justify-between p-1 bg-slate-950 rounded-lg pl-2">
                    <span>Load Time:</span>
                    <strong className="text-white">{videoResults.loadTime}s</strong>
                  </div>
                  <div className="flex justify-between p-1 bg-slate-950 rounded-lg pl-2">
                    <span>Buffer Rate:</span>
                    <strong className="text-white">{videoResults.bufferingRatio}%</strong>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-500 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  According to diagnostic latency, you can watch streaming feeds with <strong>{videoResults.bufferingRatio === 0 ? 'no buffering' : 'rare buffering intervals'}</strong>. Perfect for Netflix and local university e-learning portals.
                </div>

                <button
                  type="button"
                  onClick={runVideoStreamingTest}
                  className="w-full text-blue-500 bg-blue-500/10 font-bold uppercase py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-500/20 transition-all border border-blue-500/20 mt-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rerun Video Capability Test</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-white font-mono flex items-center space-x-1.5">
                <History className="w-4 h-4 text-indigo-400" />
                <span>QoS Speedtest History</span>
              </span>
              {pastTests.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-rose-500 hover:text-rose-450 flex items-center space-x-1 text-[10px] font-bold font-mono transition-colors bg-transparent border-none cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>FLUSH LOGS</span>
                </button>
              )}
            </div>

            {pastTests.length > 0 ? (
              <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">
                {pastTests.map((tInfo) => (
                  <div key={tInfo.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2 transition-all hover:bg-slate-950/80">
                    
                    {/* Top line of metadata */}
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[9px] text-indigo-400 font-bold uppercase font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {tInfo.operator} • {tInfo.networkType}
                      </span>
                      <span className="text-slate-500 font-mono text-[9px]">
                        {new Date(tInfo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Speeds list row */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/40 py-1.5 rounded-lg border border-slate-850/50">
                        <span className="text-[8px] text-slate-500 uppercase block font-mono">DOWNLOAD</span>
                        <span className="text-sm font-black text-emerald-400 font-mono">{tInfo.download}</span>
                        <span className="text-[8px] text-slate-500 block font-bold leading-none">Mbps</span>
                      </div>
                      <div className="bg-slate-900/40 py-1.5 rounded-lg border border-slate-850/50">
                        <span className="text-[8px] text-slate-500 uppercase block font-mono">UPLOAD</span>
                        <span className="text-sm font-black text-cyan-400 font-mono">{tInfo.upload}</span>
                        <span className="text-[8px] text-slate-500 block font-bold leading-none">Mbps</span>
                      </div>
                    </div>

                    {/* Latency indices */}
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[8.5px] text-slate-400 bg-slate-900/10 p-1 rounded-md">
                      <div>
                        <span className="text-[7.5px] block text-slate-600">Idle Ping</span>
                        <span className="font-bold text-amber-500">{tInfo.pingIdle}ms</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block text-slate-600">Jitter</span>
                        <span className="text-teal-400 font-bold">{tInfo.jitter}ms</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] block text-slate-600">Server</span>
                        <span className="truncate block font-bold text-slate-350" title={tInfo.serverName}>{tInfo.serverName.replace(' Server', '')}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-2 text-slate-550">
                <Gauge className="w-10 h-10 text-slate-700 animate-pulse" />
                <span className="text-[10px] font-mono leading-relaxed">
                  No speed tests recorded in database logs. Make your first connection QoS audit inside the "Speed" panel above!
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHOOSE SPEEDTEST REGIONAL SERVER MODAL SCREEN */}
      {showServerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-850 text-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-black uppercase font-mono">Choose Test Server</h4>
              </div>
              <button 
                onClick={() => setShowServerModal(false)}
                className="text-slate-400 hover:text-white font-mono font-bold text-xs bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              We highly recommend select server hosts near your actual location to evaluate ideal network bounds. Selecting transatlantic nodes introduces natural routing propagation latency.
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin">
              {SPEEDTEST_SERVERS.map((srv) => {
                const distKm = calculateDistance(
                  gpsLocation.latitude, 
                  gpsLocation.longitude, 
                  srv.latitude, 
                  srv.longitude
                );
                const isCurrent = srv.id === selectedServerId;

                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setSelectedServerId(srv.id);
                      setShowServerModal(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border flex justify-between items-center transition-all ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-850 text-slate-350 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="text-[10px] font-bold block truncate">{srv.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono italic block">{srv.provider} • {srv.city}</span>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-400 bg-slate-900 border border-slate-850/60 px-2 py-0.5 rounded flex-shrink-0 font-bold">
                      {distKm} km
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[9px] text-slate-550 leading-normal text-center bg-slate-950 p-2 rounded-lg font-mono">
              LATENCY CALCULATED VIS-À-VIS ACTIVE COORDINATES POINT
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
