/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  RotateCw, 
  CheckCircle2, 
  Smartphone, 
  Signal, 
  Send,
  Star,
  Activity,
  ThumbsDown,
  Navigation,
  Globe,
  Download,
  Search,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Database,
  Printer,
  Gauge,
  LogOut
} from 'lucide-react';
import { OperatorName, NetworkType, LocationData, NetworkMetrics, UserFeedback, SubscriberUser, NetworkPredictionResult } from '../types';
import OoklaSpeedtest from './OoklaSpeedtest';

interface MobileSimulatorProps {
  onReportSubmitted: () => void;
  users?: SubscriberUser[];
  currentUser?: SubscriberUser;
  activeTab?: 'simulator' | 'dashboard';
  setActiveTab?: (tab: 'simulator' | 'dashboard') => void;
  onLogout?: () => void;
  themeMode?: 'light' | 'dark';
  setThemeMode?: (theme: 'light' | 'dark') => void;
}

const REGIONS_CITIES: { [key: string]: { city: string; lat: number; lng: number }[] } = {
  'Center': [
    { city: 'Yaoundé (Bastos)', lat: 3.8767, lng: 11.5116 },
    { city: 'Yaoundé (Mvan)', lat: 3.8290, lng: 11.5181 },
    { city: 'Yaoundé (Melen)', lat: 3.8612, lng: 11.4988 },
    { city: 'Mbalmayo', lat: 3.5153, lng: 11.5008 }
  ],
  'Littoral': [
    { city: 'Douala (Akwa)', lat: 4.0482, lng: 9.7043 },
    { city: 'Douala (Bonabéri)', lat: 4.0722, lng: 9.6738 },
    { city: 'Douala (Bonanjo)', lat: 4.0427, lng: 9.6865 },
    { city: 'Edéa', lat: 3.8014, lng: 10.1251 }
  ],
  'West': [
    { city: 'Bafoussam', lat: 5.4741, lng: 10.4208 },
    { city: 'Dschang', lat: 5.4431, lng: 10.0526 },
    { city: 'Foumban', lat: 5.7291, lng: 10.9001 }
  ],
  'Southwest': [
    { city: 'Buea (Molyko)', lat: 4.1534, lng: 9.2412 },
    { city: 'Limbe', lat: 4.0244, lng: 9.2211 },
    { city: 'Kumba', lat: 4.6364, lng: 9.4411 }
  ],
  'Northwest': [
    { city: 'Bamenda (Up Station)', lat: 5.9631, lng: 10.1591 },
    { city: 'Commercial Avenue', lat: 5.9555, lng: 10.1501 },
    { city: 'Wum', lat: 6.3861, lng: 10.0651 }
  ],
  'North': [
    { city: 'Garoua', lat: 9.3031, lng: 13.3976 },
    { city: 'Guider', lat: 9.9327, lng: 13.9482 }
  ],
  'Far North': [
    { city: 'Maroua', lat: 10.5925, lng: 14.3216 },
    { city: 'Kousseri', lat: 12.0831, lng: 15.0321 }
  ],
  'Adamawa': [
    { city: 'Ngaoundéré', lat: 7.3195, lng: 13.5847 },
    { city: 'Meiganga', lat: 6.5181, lng: 14.2881 }
  ],
  'East': [
    { city: 'Bertoua', lat: 4.5778, lng: 13.6847 },
    { city: 'Abong-Mbang', lat: 3.9831, lng: 13.1831 }
  ],
  'South': [
    { city: 'Ebolowa', lat: 2.9195, lng: 11.1508 },
    { city: 'Kribi', lat: 2.9381, lng: 9.9081 }
  ]
};

const TYPICAL_ISSUES = [
  'Slow Browsing',
  'Call Drops',
  'No Signal Indoor',
  'High Latency',
  'VoIP Jitter',
  'Muffled Audio',
  'Weak LTE Coverage',
  'Buffering on Media'
];

const TRANSLATIONS = {
  EN: {
    title: "NetPulse QoS Terminal",
    desc: "Simulate mobile subscriber experience parameters. Modify network type, test speeds, and log your qualitative comments to sync QoS analytics to the central board.",
    activeCarrier: "Active Carrier",
    networkMode: "Network Mode",
    profile: "1. Subscriber User Account",
    carrierStandard: "2. Carrier & Hardware",
    operatorLabel: "Operator Name",
    standardLabel: "Network Standard",
    deviceModelLabel: "Device Model",
    locationHeading: "3. Location Profile",
    gpsLocate: "Use GPS",
    regionLabel: "Cameroon Region",
    cityLabel: "City/Zone",
    coordinates: "Coordinates Pointer",
    signalHeading: "4. Signal & Speed QoS Probe",
    interactiveSignal: "Interactive Signal Level",
    runQosSpeedtest: "Run QoS Speedtest",
    retestQos: "Retest QoS Path",
    latencyLabel: "Latency",
    packetLossLabel: "Packet Loss",
    downloadLabel: "Download Speed",
    uploadLabel: "Upload Speed",
    qoeHeading: "5. Experience Quality (QoE)",
    browsingSatisfaction: "Standard Web Browsing",
    callingSatisfaction: "Voice Calling Clarity",
    streamingSatisfaction: "HD Video Streaming",
    overallQoeLabel: "Overall Experience Score",
    selectIssuesLabel: "Select Issues Encountered",
    commentsLabel: "Feedback Comments & Logs",
    submitBtn: "Submit QoE Metrics",
    transmitting: "Transmitting telemetry...",
    successMsg: "QoE Telemetry Report Sent Safely!",
    downloadPdfBtn: "Print QoS Certificate (PDF)",
    downloadTxtBtn: "Save Diagnostic Logs",
    anonymous: "Submit Anonymously",
    predictionTitle: "Predict Operator Stability",
    predictionPrompt: "Our server analyzes historical subscriber speedtests to forecast which ISP is most stable at this location and time.",
    selectTime: "Select Prediction Hour Window",
    runPredictionBtn: "Predict Best Operator",
    calculating: "Calculating Stability...",
    recommends: "AI Recommended Operator",
    confidence: "Confidence Meter",
    viewSpeedtestTab: "Ookla Speedtest",
    viewMetricTab: "QoS Probe Form",
    viewMapTab: "Live Google Map View",
    viewPredictTab: "Network Stability AI",
    mapLayers: "Satellite Mode",
    locateMe: "Locate Me",
    searchPlaceholder: "Search towns, universities, Bastos, Akwa...",
    stabiltyRating: "Predicted Stability Rating",
    expectedDownload: "Forecast Speed",
    expectedLatency: "Expected Latency",
    satisfactionScore: "Satisfaction Index",
    mapTip: "Click anywhere on the Cameroon Google Map grid to snap subscriber's location to those exact coordinates!"
  },
  FR: {
    title: "Terminal NetPulse QoS",
    desc: "Simulez l'expérience mobile de l'abonné. Modifiez la connexion, effectuez des speedtests et enregistrez vos remarques pour synchroniser les données QoS avec le serveur national.",
    activeCarrier: "Opérateur Actif",
    networkMode: "Mode Réseau",
    profile: "1. Compte de l'Abonné Émetteur",
    carrierStandard: "2. Opérateur & Équipement",
    operatorLabel: "Nom de l'Opérateur",
    standardLabel: "Génération de Réseau",
    deviceModelLabel: "Modèle de Téléphone",
    locationHeading: "3. Localisation de l'Abonné",
    gpsLocate: "Activer GPS",
    regionLabel: "Région du Cameroun",
    cityLabel: "Ville/District",
    coordinates: "Coordonnées de l'Abonné",
    signalHeading: "4. Test de Débit QoS & Signal",
    interactiveSignal: "Niveau de Signal Interactif",
    runQosSpeedtest: "Lancer le Speedtest QoS",
    retestQos: "Relancer le Test QoS",
    latencyLabel: "Temps de Latence",
    packetLossLabel: "Perte de Paquets",
    downloadLabel: "Débit Descendant",
    uploadLabel: "Débit Montant",
    qoeHeading: "5. Qualité d'Expérience (QoE)",
    browsingSatisfaction: "Navigation Web Classique",
    callingSatisfaction: "Clarté des Appels Vocaux",
    streamingSatisfaction: "Streaming Vidéo HD",
    overallQoeLabel: "Note d'Expérience Globale",
    selectIssuesLabel: "Sélectionner Problèmes Rencontrés",
    commentsLabel: "Commentaires & Remarques de l'Abonné",
    submitBtn: "Transmettre les Métriques",
    transmitting: "Transmission en cours...",
    successMsg: "Rapport de Télémétrie Transmis avec Succès !",
    downloadPdfBtn: "Imprimer le Certificat QoS (PDF)",
    downloadTxtBtn: "Enregistrer Journal TXT",
    anonymous: "Soumettre Anonymement",
    predictionTitle: "Prédire la Stabilité Réseau",
    predictionPrompt: "Notre serveur analyse les speedtests des abonnés pour prédire quel FAI est le plus stable à cet endroit et à cette heure.",
    selectTime: "Période Horodate de Prédiction",
    runPredictionBtn: "Prédire le Meilleur Réseau",
    calculating: "Calcul de Stabilité...",
    recommends: "Opérateur Recommandé AI",
    confidence: "Indice de Confiance",
    viewSpeedtestTab: "Ookla Speedtest",
    viewMetricTab: "Formulaire QoS",
    viewMapTab: "Google Map Intégrée",
    viewPredictTab: "Intelligence Prédictive",
    mapLayers: "Mode Satellite",
    locateMe: "Me Localiser",
    searchPlaceholder: "Rechercher bastos, Akwa, universités...",
    stabiltyRating: "Indice de Stabilité Prédit",
    expectedDownload: "Débit Estimé",
    expectedLatency: "Latence Estimée",
    satisfactionScore: "Satisfaction Moyen",
    mapTip: "Cliquez n'importe où sur la carte Google Map Cameroun pour y pointer la position de l'abonné !"
  }
};

export default function MobileSimulator({ 
  onReportSubmitted, 
  users = [], 
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  themeMode = 'light',
  setThemeMode = () => {}
}: MobileSimulatorProps) {
  // Simulator configuration preferences
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');
  const [phoneScreenTab, setPhoneScreenTab] = useState<'speedtest' | 'probe' | 'map' | 'predict'>('speedtest');

  // Multi-user subscriber session mapping
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser?.id || 'usr-1');

  // Sync selected user with logged-in subscriber account
  useEffect(() => {
    if (currentUser?.id) {
      setSelectedUserId(currentUser.id);
    }
  }, [currentUser]);

  // Mobile Network Context State
  const [operator, setOperator] = useState<OperatorName>('MTN Cameroon');
  const [networkType, setNetworkType] = useState<NetworkType>('4G');
  const [region, setRegion] = useState<string>('Center');
  const [cityIndex, setCityIndex] = useState<number>(0);
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  const [gpsLocation, setGpsLocation] = useState<LocationData>({
    region: 'Center',
    city: 'Yaoundé (Bastos)',
    latitude: 3.8767,
    longitude: 11.5116
  });

  // Signal Strength Parameter (Auto-computed based on operator & location)
  const [signalStrength, setSignalStrength] = useState<number>(-82); // dBm
  const [customSignal, setCustomSignal] = useState<boolean>(false);

  // Speedtest State
  const [speedtestActive, setSpeedtestActive] = useState<boolean>(false);
  const [speedProgress, setSpeedProgress] = useState<number>(0); // 0 to 100%
  const [speedPhase, setSpeedPhase] = useState<'idle' | 'latency' | 'download' | 'upload' | 'done'>('idle');
  const [currentDisplaySpeed, setCurrentDisplaySpeed] = useState<number>(0);
  
  // Measured speed metrics
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [latency, setLatency] = useState<number>(0);
  const [packetLoss, setPacketLoss] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);

  // Subjective Feedback state
  const [overallQoE, setOverallQoE] = useState<number>(4);
  const [browsingRating, setBrowsingRating] = useState<number>(4);
  const [callingRating, setCallingRating] = useState<number>(4);
  const [streamingRating, setStreamingRating] = useState<number>(4);
  const [userComments, setUserComments] = useState<string>('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [deviceModel, setDeviceModel] = useState<string>('Tecno Phantom V Fold');

  // Map widget state
  const [isSatellite, setIsSatellite] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(8);
  const [mapSearch, setMapSearch] = useState<string>('');
  const [pinnedCoordinates, setPinnedCoordinates] = useState<{lat: number, lng: number}>({ lat: 3.8767, lng: 11.5116 });

  // Predictive state
  const [predictionTime, setPredictionTime] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Evening');
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<NetworkPredictionResult | null>(null);

  // Transmitting feedback state
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // Map pointer sync to location
  useEffect(() => {
    setPinnedCoordinates({ lat: gpsLocation.latitude, lng: gpsLocation.longitude });
  }, [gpsLocation]);

  // Handle user account toggle
  useEffect(() => {
    if (selectedUserId && selectedUserId !== 'anonymous') {
      const activeUser = users.find(u => u.id === selectedUserId);
      if (activeUser) {
        setRegion(activeUser.region);
        setDeviceModel('Samsung Galaxy Ultra');
        // snap index
        const list = REGIONS_CITIES[activeUser.region] || [];
        const foundIndex = list.findIndex(c => c.city.toLowerCase().includes(activeUser.city.toLowerCase()) || activeUser.city.toLowerCase().includes(c.city.toLowerCase()));
        if (foundIndex !== -1) {
          setCityIndex(foundIndex);
        } else {
          setCityIndex(0);
        }
      }
    }
  }, [selectedUserId, users]);

  // Dynamic signals calculator
  useEffect(() => {
    if (!customSignal) {
      let baseSignal = -80;
      if (operator === 'Orange Cameroon') {
        baseSignal = networkType === '5G' ? -93 : -83;
      } else if (operator === 'MTN Cameroon') {
        baseSignal = networkType === '5G' ? -89 : -77;
      } else if (operator === 'Camtel') {
        baseSignal = -85;
      } else if (operator === 'Nexttel') {
        baseSignal = -96;
      }

      if (region === 'Far North' || region === 'Northwest' || region === 'East') {
        baseSignal -= 13;
      }
      setSignalStrength(baseSignal);
    }
  }, [operator, networkType, region, customSignal]);

  // GPS Selector mapping
  useEffect(() => {
    const list = REGIONS_CITIES[region];
    if (list && list[cityIndex]) {
      const selected = list[cityIndex];
      setGpsLocation({
        region,
        city: selected.city,
        latitude: selected.lat,
        longitude: selected.lng
      });
    }
  }, [region, cityIndex]);

  const getSignalQuality = (dbm: number): string => {
    if (dbm >= -80) return 'Excellent';
    if (dbm >= -90) return 'Good';
    if (dbm >= -100) return 'Fair';
    return 'Poor';
  };

  const handleAutodetectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setGpsLocation({
            region: 'Center',
            city: 'Auto Detected GPS',
            latitude: parseFloat(lat.toFixed(4)),
            longitude: parseFloat(lng.toFixed(4))
          });
          setDetectingLocation(false);
          setPhoneScreenTab('probe');
        },
        () => {
          setTimeout(() => {
            setDetectingLocation(false);
          }, 800);
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  // Google Map Grid Simulation click listener
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Cameroon coordinates approximation mapping
    // Width corresponds to longitude (approx 8.5 to 16.5 East)
    // Height corresponds to latitude (approx 1.5 to 13 North)
    const normalizedX = clickX / rect.width;
    const normalizedY = 1 - (clickY / rect.height); // invert to match conventional Y pointing North
    
    const minLng = 8.5;
    const maxLng = 16.0;
    const minLat = 2.0;
    const maxLat = 12.8;

    const computedLat = parseFloat((minLat + normalizedY * (maxLat - minLat)).toFixed(4));
    const computedLng = parseFloat((minLng + normalizedX * (maxLng - minLng)).toFixed(4));

    // Determine nearest Cameroon region
    let matchedRegion = 'Center';
    let minDistance = 9999;
    
    Object.keys(REGIONS_CITIES).forEach(reg => {
      REGIONS_CITIES[reg].forEach(cityObj => {
        const dist = Math.sqrt(Math.pow(cityObj.lat - computedLat, 2) + Math.pow(cityObj.lng - computedLng, 2));
        if (dist < minDistance) {
          minDistance = dist;
          matchedRegion = reg;
        }
      });
    });

    setRegion(matchedRegion);
    setCityIndex(0);
    setGpsLocation({
      region: matchedRegion,
      city: `Custom Pin Location`,
      latitude: computedLat,
      longitude: computedLng
    });
  };

  // Search District search bar execution
  const executeMapSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch) return;

    let found = false;
    Object.keys(REGIONS_CITIES).forEach(reg => {
      REGIONS_CITIES[reg].forEach((cityObj, index) => {
        if (!found && cityObj.city.toLowerCase().includes(mapSearch.toLowerCase())) {
          setRegion(reg);
          setCityIndex(index);
          setGpsLocation({
            region: reg,
            city: cityObj.city,
            latitude: cityObj.lat,
            longitude: cityObj.lng
          });
          setMapZoom(12);
          found = true;
        }
      });
    });
  };

  // QoS Speedtest logic
  const handleRunSpeedtest = () => {
    setSpeedtestActive(true);
    setSpeedProgress(0);
    setSpeedPhase('latency');
    setCurrentDisplaySpeed(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setSpeedProgress(progress);

      if (progress < 25) {
        setSpeedPhase('latency');
        setCurrentDisplaySpeed(Math.floor(Math.random() * 15) + 30);
      } else if (progress >= 25 && progress < 65) {
        setSpeedPhase('download');
        let maxDownload = 24; 
        if (networkType === '5G') maxDownload = 135;
        else if (networkType === '4G') maxDownload = 45;
        else if (networkType === '3G') maxDownload = 7;
        else maxDownload = 0.22;

        if (operator === 'Nexttel' && networkType === '4G') maxDownload = 16;
        if (operator === 'Camtel') maxDownload = maxDownload * 0.95;
        
        setCurrentDisplaySpeed(parseFloat((Math.random() * (maxDownload * 0.3) + (maxDownload * 0.7)).toFixed(1)));
      } else if (progress >= 65 && progress < 95) {
        setSpeedPhase('upload');
        let maxUpload = 9;
        if (networkType === '5G') maxUpload = 48;
        else if (networkType === '4G') maxUpload = 14;
        else if (networkType === '3G') maxUpload = 1.8;
        else maxUpload = 0.09;

        setCurrentDisplaySpeed(parseFloat((Math.random() * (maxUpload * 0.3) + (maxUpload * 0.7)).toFixed(1)));
      } else if (progress >= 100) {
        clearInterval(interval);
        setSpeedtestActive(false);
        setSpeedPhase('done');
        
        let finalMaxDownload = 22;
        let finalMaxUpload = 8;
        let baseLatency = 45;

        if (networkType === '5G') {
          finalMaxDownload = 88 + Math.random() * 22;
          finalMaxUpload = 34 + Math.random() * 12;
          baseLatency = 17 + Math.random() * 12;
        } else if (networkType === '4G') {
          finalMaxDownload = 17 + Math.random() * 23;
          finalMaxUpload = 5.5 + Math.random() * 9;
          baseLatency = 40 + Math.random() * 28;
        } else if (networkType === '3G') {
          finalMaxDownload = 3.2 + Math.random() * 3.1;
          finalMaxUpload = 1 + Math.random() * 0.9;
          baseLatency = 98 + Math.random() * 75;
        } else {
          finalMaxDownload = 0.16 + Math.random() * 0.08;
          finalMaxUpload = 0.06 + Math.random() * 0.04;
          baseLatency = 420 + Math.random() * 180;
        }

        if (operator === 'Camtel') {
          baseLatency += 12;
        } else if (operator === 'Orange Cameroon' && region === 'Littoral') {
          finalMaxDownload *= 1.25;
        } else if (operator === 'MTN Cameroon' && region === 'Center') {
          finalMaxDownload *= 1.18;
        }

        const calculatedDl = parseFloat(finalMaxDownload.toFixed(1));
        const calculatedUl = parseFloat(finalMaxUpload.toFixed(1));
        const calculatedLat = Math.round(baseLatency);
        const calculatedJitter = Math.round(calculatedLat * (0.07 + Math.random() * 0.08));
        const calculatedLoss = calculatedLat > 120 ? parseFloat((1.1 + Math.random() * 2.5).toFixed(1)) : parseFloat((Math.random() * 0.3).toFixed(1));

        setDownloadSpeed(calculatedDl);
        setUploadSpeed(calculatedUl);
        setLatency(calculatedLat);
        setJitter(calculatedJitter);
        setPacketLoss(calculatedLoss);

        let autoRating = 4;
        if (calculatedDl < 3) autoRating = 1;
        else if (calculatedDl < 11 || calculatedLat > 115) autoRating = 2;
        else if (calculatedDl < 26) autoRating = 3;
        else if (calculatedDl >= 42 && calculatedLat < 38) autoRating = 5;

        setOverallQoE(autoRating);
        setBrowsingRating(Math.max(1, autoRating - (calculatedLat > 95 ? 1 : 0)));
        setCallingRating(Math.max(1, autoRating - (calculatedLoss > 2 ? 1 : 0)));
        setStreamingRating(Math.max(1, autoRating - (calculatedDl < 7 ? 2 : 0)));
      }
    }, 45);
  };

  const toggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  // Submit report trigger
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const reportsPayload = {
      location: gpsLocation,
      metrics: {
        signalStrength,
        signalQuality: getSignalQuality(signalStrength),
        networkType,
        downloadSpeed: downloadSpeed || 15.6,
        uploadSpeed: uploadSpeed || 5.1,
        latency: latency || 62,
        packetLoss: packetLoss || 0.1,
        jitter: jitter || 10,
        operator
      },
      feedback: {
        overallQoE,
        browsingRating,
        callingRating,
        streamingRating,
        userComments: userComments || `Automated feedback probe under operator ${operator}`,
        frequentIssues: selectedIssues
      },
      deviceModel,
      userId: selectedUserId !== 'anonymous' ? selectedUserId : null
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportsPayload)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        onReportSubmitted(); // Trigger parent sync
        
        setTimeout(() => {
          setSubmitSuccess(false);
          setUserComments('');
          setSelectedIssues([]);
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Execute AI server stability prediction
  const requestNetworkPrediction = async () => {
    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          city: gpsLocation.city,
          timeOfDay: predictionTime
        })
      });
      const data = await response.json();
      if (data.success) {
        setPredictionResult(data.prediction);
      }
    } catch (err) {
      console.error('Error calculating network predictive stats:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  // QoS PDF File Generation Download Method
  const downloadQoSCertificatePDF = () => {
    const reportDate = new Date().toLocaleString(lang === 'EN' ? 'en-US' : 'fr-FR');
    const filename = `NetPulse_Cert_${gpsLocation.city.replace(/\s+/g, '_')}_${operator.replace(/\s+/g, '_')}.html`;

    const htmlString = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NetPulse Telecommunications QoS Certificate</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: #f8fafc; padding: 40px; }
    .cert { max-width: 800px; margin: 0 auto; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header { text-align: center; border-bottom: 2px solid #3b82f6; pb: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; letter-spacing: -1px; }
    .logo span { color: #3b82f6; }
    .subtitle { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-top: 5px; }
    .title { font-size: 20px; font-weight: bold; margin: 20px 0 10px; text-align: center; color: #0f172a; }
    .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .meta-card { bg: #f1f5f9; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; p: 15px; padding: 15px; }
    .meta-card h3 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
    .meta-card p { margin: 0; font-size: 14px; font-weight: bold; color: #1e293b; }
    .metrics-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .metrics-table th { background: #0f172a; color: white; text-align: left; padding: 12px; font-size: 13px; text-transform: uppercase; }
    .metrics-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .metrics-table tr:nth-child(even) { background: #f8fafc; }
    .badge { display: inline-block; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; }
    .badge-excellent { background: #dcfce7; color: #15803d; }
    .badge-good { background: #e0f2fe; color: #0369a1; }
    .badge-fair { background: #fef3c7; color: #b45309; }
    .badge-poor { background: #fee2e2; color: #b91c1c; }
    .footer { text-align: center; font-size: 11px; color: #64748b; border-t:  1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; }
    .sign { width: 150px; height: auto; margin-top: 10px; }
    @media print {
      body { background: white; padding: 0; }
      .cert { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="header">
      <div class="logo">Net<span>Pulse</span> Cameroon</div>
      <div class="subtitle">NATIONAL QoS AUDITING & ANALYTICAL DIRECTIVE CERTIFICATE</div>
    </div>
    
    <div class="title">${lang === 'EN' ? 'SUBSCRIBER DEVICE QoS CERTIFICATE' : 'CERTIFICAT QoS ÉMISSION DE L\'ABONNÉ'}</div>
    
    <div class="meta-grid">
      <div class="meta-card">
        <h3>${lang === 'EN' ? 'AUDIT CONTEXT' : 'CONTEXTE DE L\'AUDIT'}</h3>
        <p>Operator: ${operator}</p>
        <p>Network type: ${networkType} Mode</p>
        <p>Terminal Model: ${deviceModel}</p>
        <p>Auditor Identity: ${selectedUserId !== 'anonymous' ? users.find(u => u.id === selectedUserId)?.name || 'Linked Account' : 'Anonymous Citizen Probe'}</p>
      </div>
      <div class="meta-card">
        <h3>${lang === 'EN' ? 'SPATIAL-TEMPORAL BOUNDS' : 'DONNÉES SPATIO-TEMPORELLES'}</h3>
        <p>Cameroon Region: ${gpsLocation.region} Region</p>
        <p>District / Zone: ${gpsLocation.city}</p>
        <p>Google map Location: ${gpsLocation.latitude}° N, ${gpsLocation.longitude}° E</p>
        <p>Audit Timestamp: ${reportDate}</p>
      </div>
    </div>

    <table class="metrics-table">
      <thead>
        <tr>
          <th>${lang === 'EN' ? 'Network Indicator' : 'Indicateurs Réseau'}</th>
          <th>${lang === 'EN' ? 'Audited QoS Value' : 'Valeurs QoS Certifées'}</th>
          <th>${lang === 'EN' ? 'Evaluation Rating' : 'Niveau de Performance'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Download Speed (QoS)</td>
          <td><strong>${downloadSpeed || '15.6'} Mbps</strong></td>
          <td><span class="badge ${downloadSpeed >= 30 ? 'badge-excellent' : downloadSpeed >= 12 ? 'badge-good' : 'badge-fair'}">${downloadSpeed >= 30 ? 'Excellent' : downloadSpeed >= 12 ? 'Good' : 'Fair'}</span></td>
        </tr>
        <tr>
          <td>Upload Speed (QoS)</td>
          <td><strong>${uploadSpeed || '5.1'} Mbps</strong></td>
          <td><span class="badge ${uploadSpeed >= 10 ? 'badge-excellent' : uploadSpeed >= 4 ? 'badge-good' : 'badge-fair'}">${uploadSpeed >= 10 ? 'Excellent' : uploadSpeed >= 4 ? 'Good' : 'Fair'}</span></td>
        </tr>
        <tr>
          <td>Round-trip Latency</td>
          <td><strong>${latency || '62'} ms</strong></td>
          <td><span class="badge ${latency < 45 ? 'badge-excellent' : latency < 90 ? 'badge-good' : 'badge-poor'}">${latency < 45 ? 'Low Latency (Excellent)' : latency < 90 ? 'Acceptable' : 'High Latency'}</span></td>
        </tr>
        <tr>
          <td>Packet Loss Ratio</td>
          <td><strong>${packetLoss || '0.1'} %</strong></td>
          <td><span class="badge ${packetLoss < 0.5 ? 'badge-excellent' : 'badge-fair'}">${packetLoss < 0.5 ? 'Stable' : 'Unstable Drops'}</span></td>
        </tr>
        <tr>
          <td>Signal Strength Level</td>
          <td><strong>${signalStrength} dBm</strong></td>
          <td><span class="badge ${signalStrength >= -80 ? 'badge-excellent' : signalStrength >= -92 ? 'badge-good' : 'badge-poor'}">${getSignalQuality(signalStrength)}</span></td>
        </tr>
        <tr>
          <td>Overall Experience (QoE)</td>
          <td><strong>${overallQoE} / 5 Stars</strong></td>
          <td><span class="badge ${overallQoE >= 4 ? 'badge-excellent' : 'badge-fair'}">${overallQoE}/5 Rating</span></td>
        </tr>
      </tbody>
    </table>

    <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 15px; font-size: 12px; margin-bottom: 30px;">
      <strong>Feedback Comment Logs:</strong><br>
      "${userComments || 'No comment was declared by the transmitter.'}"
    </div>

    <div class="footer">
      <p>This document certifies live diagnostic telemetry from the subscriber node in Cameroon under Telecommunications Regulatory Board guidelines.</p>
      <p style="font-weight: bold; color: #1e3a8a;">NETPULSE REGISTRATION SYSTEM CERTIFICATE ID: NP-${Math.floor(Math.random() * 89999 + 10000)}</p>
      <button onclick="window.print()" style="margin-top: 15px; padding: 8px 16px; background: #3b82f6; border: none; color: white; cursor: pointer; border-radius: 4px; font-weight: bold;">Click to Save PDF Certificate</button>
    </div>
  </div>
</body>
</html>
    `;

    // Download HTML representing PDF certificate wrapper
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      
      {/* Dynamic Integrated Header within the Application boundaries */}
      <div className={`flex flex-col md:flex-row justify-between items-center pb-4 mb-4 border-b gap-4 ${
        themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200/60'
      }`}>
        <div className="flex items-center space-x-3 select-none">
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2500/svg"
            >
              <defs>
                <linearGradient id="logoIntGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="40%" stopColor="#00CC99" />
                  <stop offset="100%" stopColor="#80E060" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoIntGrad)" />
              <path 
                d="M48 35C41.5 35 36.5 39.5 35.5 40.5M48 26C37.5 26.5 29.5 34.5 27.5 36.5M48 17C33.5 17.5 22.5 29.5 19.5 32.5" 
                stroke="white" 
                strokeWidth="5" 
                strokeLinecap="round" 
              />
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
            <div className="flex items-baseline leading-none">
              <span className="text-xl font-black tracking-tight text-blue-600 font-sans">Net</span>
              <span className="text-xl font-black tracking-tight text-emerald-500 font-sans">Pulse</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono mt-0.5">
              Cameroon QoS Audit Hub
            </span>
          </div>
        </div>

        {/* Admin Navigation toggles in-app if Header was bypassed */}
        {currentUser?.role === 'admin' && setActiveTab && activeTab && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/40">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-505 dark:text-slate-400 text-slate-500'
              }`}
            >
              Subscription view
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-505 dark:text-slate-400 text-slate-500'
              }`}
            >
              Regulator Dashboard
            </button>
          </div>
        )}

        {/* Unified Quick Language & Theme Controls on the same row! */}
        <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/80">
          <div className="flex bg-slate-200/60 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-100/50 dark:border-slate-950/20">
            <button 
              onClick={() => setLang('EN')} 
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                lang === 'EN' 
                  ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="English"
            >
              EN
            </button>
            <button 
              onClick={() => setLang('FR')} 
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                lang === 'FR' 
                  ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-xs' 
                  : 'text-slate-505 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Français"
            >
              FR
            </button>
          </div>

          <div className="h-4 w-[1.5px] bg-slate-250 dark:bg-slate-700/80" />

          <button 
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="flex items-center space-x-1.5 p-1 px-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-550 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-650" />
            )}
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">
              {themeMode === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {currentUser && (
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-black leading-none block">{currentUser.name}</span>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {currentUser.role === 'admin' ? 'Super Admin' : 'Subscriber Session'}
              </span>
            </div>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs px-3 py-2 rounded-xl border border-rose-100/50 dark:border-rose-550/10 transition-all font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Standalone content view with no phone bezel, borders, margins or frame constraints */}
      <div className={`w-full flex flex-col relative font-sans transition-all duration-300 ${
        themeMode === 'dark' 
          ? 'text-slate-100 bg-slate-900 rounded-3xl p-4 md:p-6' 
          : 'text-slate-800 bg-transparent'
      }`}>
          

          {/* Core Applet Navigation Inside Phone Screen */}
          <div className={`grid grid-cols-4 text-center border-b font-semibold text-[9.5px] uppercase tracking-wider font-mono ${
            themeMode === 'dark' ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button 
              onClick={() => setPhoneScreenTab('speedtest')}
              className={`py-3 flex flex-col items-center justify-center space-y-1 ${phoneScreenTab === 'speedtest' ? 'border-b-2 border-blue-500 text-blue-500 font-extrabold' : 'text-slate-400'}`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{t.viewSpeedtestTab ? (t.viewSpeedtestTab.length > 9 ? 'Speedest' : t.viewSpeedtestTab) : 'Speed'}</span>
            </button>
            <button 
              onClick={() => setPhoneScreenTab('probe')}
              className={`py-3 flex flex-col items-center justify-center space-y-1 ${phoneScreenTab === 'probe' ? 'border-b-2 border-blue-500 text-blue-500 font-extrabold' : 'text-slate-400'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.viewMetricTab ? (t.viewMetricTab.includes('Form') ? 'QoS Probe' : t.viewMetricTab) : 'Probe'}</span>
            </button>
            <button 
              onClick={() => setPhoneScreenTab('map')}
              className={`py-3 flex flex-col items-center justify-center space-y-1 ${phoneScreenTab === 'map' ? 'border-b-2 border-blue-500 text-blue-500 font-extrabold' : 'text-slate-400'}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.viewMapTab ? (t.viewMapTab.includes('Google') ? 'Maps' : t.viewMapTab) : 'Map'}</span>
            </button>
            <button 
              onClick={() => {
                setPhoneScreenTab('predict');
                requestNetworkPrediction();
              }}
              className={`py-3 flex flex-col items-center justify-center space-y-1 ${phoneScreenTab === 'predict' ? 'border-b-2 border-blue-500 text-blue-500 font-extrabold' : 'text-slate-400'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{t.viewPredictTab ? (t.viewPredictTab.includes('Network') ? 'Predict' : t.viewPredictTab) : 'AI Radar'}</span>
            </button>
          </div>

          <div className="flex-1 px-1 py-5 space-y-5">
            
            {/* SCREEN TAB S: Ookla Speedtest Dashboard */}
            {phoneScreenTab === 'speedtest' && (
              <div className="space-y-4 animate-fade-in">
                <OoklaSpeedtest 
                  operator={operator}
                  networkType={networkType}
                  gpsLocation={gpsLocation}
                  themeMode={themeMode}
                  onTestCompleted={(res) => {
                    setDownloadSpeed(res.download);
                    setUploadSpeed(res.upload);
                    setLatency(res.latency);
                    setJitter(res.jitter);
                    setPacketLoss(res.packetLoss);

                    let autoRating = 4;
                    if (res.download < 3) autoRating = 1;
                    else if (res.download < 11 || res.latency > 115) autoRating = 2;
                    else if (res.download < 26) autoRating = 3;
                    else if (res.download >= 42 && res.latency < 38) autoRating = 5;

                    setOverallQoE(autoRating);
                    setBrowsingRating(Math.max(1, autoRating - (res.latency > 95 ? 1 : 0)));
                    setCallingRating(Math.max(1, autoRating - (res.packetLoss > 2 ? 1 : 0)));
                    setStreamingRating(Math.max(1, autoRating - (res.download < 7 ? 2 : 0)));
                    
                    // Show speed check comment label
                    setUserComments(`Audited via Ookla speedtest engine: DL ${res.download} Mbps, UL ${res.upload} Mbps against regional network hosts.`);
                  }}
                />
              </div>
            )}

            {/* SCREEN TAB A: QoS Probe Metric Form */}
            {phoneScreenTab === 'probe' && (
              <div className="space-y-4">
                
                {/* 1. Account Selector Context */}
                {currentUser && currentUser.role !== 'admin' ? (
                  <div className={`p-3 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-955/50 border-slate-800' : 'bg-slate-50 border-slate-150'} shadow-xs space-y-1`}>
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-blue-500" />
                      <span>{lang === 'EN' ? 'ACTIVE PROFILE SESSION' : 'SESSION PROFIL ACTIF'}</span>
                    </label>
                    <div className="flex items-center space-x-2 pt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center border border-blue-200">
                        {currentUser.name ? currentUser.name.split(' ').map(n=>n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <span className={`text-xs font-black block leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                          {currentUser.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                          {currentUser.email} — {currentUser.region}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-3 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-955/50 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-2`}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.profile}</span>
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className={`w-full text-xs font-semibold rounded-lg p-2 focus:ring-1 focus:ring-blue-500 ${
                        themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="anonymous">{t.anonymous}</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.priorityTier} - {u.region})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 2. Brand & Operator Parameters */}
                <div className={`p-4 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-3`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.carrierStandard}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">{t.operatorLabel}</label>
                      <select 
                        value={operator}
                        onChange={(e) => setOperator(e.target.value as OperatorName)}
                        className={`w-full text-xs font-bold rounded-lg p-2 ${
                          themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="MTN Cameroon">MTN Cameroon</option>
                        <option value="Orange Cameroon">Orange Cameroon</option>
                        <option value="Camtel">Camtel</option>
                        <option value="Nexttel">Nexttel</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">{t.standardLabel}</label>
                      <select 
                        value={networkType} 
                        onChange={(e) => setNetworkType(e.target.value as NetworkType)}
                        className={`w-full text-xs font-bold rounded-lg p-2 ${
                          themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="5G">5G (LTE-A Pro)</option>
                        <option value="4G">4G LTE</option>
                        <option value="3G">3G HSPA+</option>
                        <option value="2G">2G EDGE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">{t.deviceModelLabel}</label>
                    <input 
                      type="text" 
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="e.g. Tecno, iPhone, Samsung"
                      className={`w-full text-xs font-bold rounded-lg p-2 ${
                        themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Location Select */}
                <div className={`p-4 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-3`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t.locationHeading}</span>
                    </h3>
                    <button 
                      type="button" 
                      onClick={handleAutodetectLocation}
                      disabled={detectingLocation}
                      className="text-[9px] text-blue-500 bg-blue-500/10 font-bold font-mono px-2 py-1 rounded flex items-center space-x-1"
                    >
                      <Navigation className={`w-2.5 h-2.5 ${detectingLocation ? 'animate-pulse' : ''}`} />
                      <span>{detectingLocation ? '...' : t.gpsLocate}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">{t.regionLabel}</label>
                      <select 
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          setCityIndex(0);
                        }}
                        className={`w-full text-xs font-bold rounded-lg p-2 ${
                          themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {Object.keys(REGIONS_CITIES).map(r => (
                          <option key={r} value={r}>{r} Region</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">{t.cityLabel}</label>
                      <select 
                        value={cityIndex}
                        onChange={(e) => setCityIndex(Number(e.target.value))}
                        className={`w-full text-xs font-bold rounded-lg p-2 ${
                          themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {REGIONS_CITIES[region]?.map((item, idx) => (
                          <option key={item.city} value={idx}>{item.city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Coordinates indicator */}
                  <div className={`p-2 rounded-lg flex justify-between items-center text-[9px] font-mono border ${
                    themeMode === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    <span>Lat: {gpsLocation.latitude}° N</span>
                    <span>Lng: {gpsLocation.longitude}° E</span>
                  </div>
                </div>

                {/* 4. Run QoS speed test, metrics selector */}
                <div className={`p-4 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-3`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Wifi className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.signalHeading}</span>
                  </h3>

                  {/* DBm sliding slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{t.interactiveSignal}</span>
                      <span className={`text-[11px] font-mono font-bold ${signalStrength >= -85 ? 'text-emerald-500' : signalStrength >= -98 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {signalStrength} dBm ({getSignalQuality(signalStrength)})
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-120" 
                      max="-45"
                      value={signalStrength}
                      onChange={(e) => {
                        setSignalStrength(Number(e.target.value));
                        setCustomSignal(true);
                      }}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* QoS dial section */}
                  <div className={`rounded-xl p-3.5 flex flex-col items-center justify-center space-y-3 relative border ${
                    themeMode === 'dark' ? 'bg-slate-950 border-slate-850 text-white' : 'bg-slate-950 text-white'
                  }`}>
                    {speedtestActive ? (
                      <div className="w-full flex flex-col items-center py-1">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="7" fill="transparent" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="42" 
                              stroke="#3b82f6" 
                              strokeWidth="7" 
                              fill="transparent" 
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * speedProgress) / 100}
                              className="transition-all duration-100"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-[9px] text-blue-400 uppercase font-black font-mono tracking-widest">{speedPhase}</span>
                            <span className="text-lg font-black font-mono tracking-tighter">{currentDisplaySpeed}</span>
                            <span className="text-[8px] text-slate-400 uppercase">
                              {speedPhase === 'latency' ? 'ms' : 'Mbps'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        {downloadSpeed > 0 ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div className="bg-slate-900/40 p-1.5 rounded-lg border border-slate-800">
                                <span className="text-[8px] text-slate-400 uppercase font-mono block">{t.downloadLabel}</span>
                                <span className="text-xs font-bold text-emerald-400">{downloadSpeed} Mbps</span>
                              </div>
                              <div className="bg-slate-900/40 p-1.5 rounded-lg border border-slate-800">
                                <span className="text-[8px] text-slate-400 uppercase font-mono block">{t.uploadLabel}</span>
                                <span className="text-xs font-bold text-cyan-400">{uploadSpeed} Mbps</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[10px] text-center border-t border-slate-800/80 pt-2 text-slate-300">
                              <div>
                                <span className="block text-[8px] text-slate-500">{t.latencyLabel}</span>
                                <span className="font-bold text-amber-400">{latency} ms</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-slate-500">Loss</span>
                                <span className="font-bold text-rose-450">{packetLoss}%</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-slate-500">Jitter</span>
                                <span className="font-bold text-teal-450">{jitter} ms</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-3 flex flex-col items-center space-y-1 text-slate-300">
                            <Activity className="w-7 h-7 text-slate-600 animate-pulse" />
                            <span className="text-[9px] text-slate-400">Launch standard diagnostics now</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleRunSpeedtest}
                          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold uppercase py-2 rounded-lg text-[10px] tracking-wider transition-all flex items-center justify-center space-x-1"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{downloadSpeed > 0 ? t.retestQos : t.runQosSpeedtest}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Subjective experience slider */}
                <form onSubmit={handleSubmitReport} className={`p-4 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-3`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <ThumbsDown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.qoeHeading}</span>
                  </h3>

                  <div className="space-y-2">
                    {[
                      { label: t.browsingSatisfaction, state: browsingRating, setter: setBrowsingRating },
                      { label: t.callingSatisfaction, state: callingRating, setter: setCallingRating },
                      { label: t.streamingSatisfaction, state: streamingRating, setter: setStreamingRating },
                      { label: t.overallQoeLabel, state: overallQoE, setter: setOverallQoE, priority: true }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-2 rounded-xl border ${
                        item.priority 
                          ? (themeMode === 'dark' ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50 border-amber-100')
                          : (themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-100')
                      }`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-bold ${item.priority ? 'text-amber-500' : 'text-slate-400'}`}>{item.label}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.state} / 5</span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((sVal) => (
                            <button
                              type="button"
                              key={sVal}
                              onClick={() => item.setter(sVal)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star className={`w-3.5 h-3.5 ${sVal <= item.state ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Typical Issues checklist checkboxes */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">{t.selectIssuesLabel}</label>
                    <div className="flex flex-wrap gap-1">
                      {TYPICAL_ISSUES.map(issue => {
                        const isSelected = selectedIssues.includes(issue);
                        return (
                          <button
                            type="button"
                            key={issue}
                            onClick={() => toggleIssue(issue)}
                            className={`text-[8px] font-semibold px-1 rounded-sm border transition-colors ${
                              isSelected
                                ? 'bg-rose-50 border-rose-250 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                                : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                          >
                            {issue}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments entry */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">{t.commentsLabel}</label>
                    <textarea 
                      rows={2}
                      value={userComments}
                      onChange={(e) => setUserComments(e.target.value)}
                      placeholder="e.g., buffering in the evening, signal drops indoors..."
                      className={`w-full text-xs p-2 rounded-lg border ${
                        themeMode === 'dark' ? 'bg-slate-850 border-slate-750 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    ></textarea>
                  </div>

                  {/* Document prints and Submit Buttons */}
                  <div className="pt-2 space-y-2">
                    {submitSuccess ? (
                      <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold p-2 rounded-lg flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{t.successMsg}</span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold uppercase py-2.5 rounded-lg shadow-md flex items-center justify-center space-x-1 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? t.transmitting : t.submitBtn}</span>
                      </button>
                    )}

                    {/* PDF downloading button toggler */}
                    {downloadSpeed > 0 && (
                      <button
                        type="button"
                        onClick={downloadQoSCertificatePDF}
                        className="w-full text-blue-500 border border-blue-500/30 hover:bg-blue-500/10 text-xs font-bold uppercase py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all bg-transparent"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t.downloadPdfBtn}</span>
                      </button>
                    )}
                  </div>

                </form>

              </div>
            )}

            {/* SCREEN TAB B: Live Google Map Localisation selector */}
            {phoneScreenTab === 'map' && (
              <div className="space-y-4">
                
                {/* Search Bar matching Google Maps aesthetic */}
                <form onSubmit={executeMapSearch} className={`flex space-x-1.5 p-1 rounded-full border shadow-sm ${
                  themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex-1 flex items-center pl-3">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={mapSearch}
                      onChange={(e) => setMapSearch(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-transparent border-none text-xs focus:ring-0 pl-1.5 py-1"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Simulated Google Map Canvas with Satellite layer switcher */}
                <div className="relative border border-slate-300 rounded-2xl overflow-hidden aspect-[4/5] bg-sky-200 flex flex-col justify-between">
                  {/* Google Satellite Toggle */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex space-x-1">
                    <button 
                      onClick={() => setIsSatellite(!isSatellite)}
                      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 p-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-[10px] font-bold flex items-center space-x-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t.mapLayers}</span>
                    </button>
                  </div>

                  {/* Map zoom controls */}
                  <div className="absolute bottom-3 right-3 z-10 flex flex-col space-y-1">
                    <button 
                      onClick={() => setMapZoom(Math.min(16, mapZoom + 1))}
                      className="bg-white/95 text-slate-800 p-2 font-black rounded-lg text-xs shadow-md border hover:bg-slate-100"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => setMapZoom(Math.max(4, mapZoom - 1))}
                      className="bg-white/95 text-slate-800 p-2 font-black rounded-lg text-xs shadow-md border hover:bg-slate-100"
                    >
                      -
                    </button>
                  </div>

                  {/* interactive SVG Map Canvas with Cameroon features */}
                  <svg 
                    id="simulated-google-maps"
                    onClick={handleMapClick}
                    className="absolute inset-0 w-full h-full cursor-crosshair select-none"
                    viewBox="0 0 100 120"
                  >
                    {/* Background Grid - Street pattern vs Satellite Dark Blue pattern */}
                    {isSatellite ? (
                      <rect width="100" height="120" fill="#0f172a" />
                    ) : (
                      <rect width="100" height="120" fill="#f1f5f9" />
                    )}

                    {/* Draw street matrix grids */}
                    {!isSatellite && (
                      <g stroke="#cbd5e1" strokeWidth="0.15" strokeDasharray="1 3">
                        {Array.from({length: 24}).map((_, i) => <line key={`h-${i}`} x1="0" y1={i*5} x2="100" y2={i*5} />)}
                        {Array.from({length: 20}).map((_, i) => <line key={`v-${i}`} x1={i*5} y1="0" x2={i*5} y2="120" />)}
                      </g>
                    )}

                    {/* Google Map water contours represent Gulf of Guinea */}
                    <path 
                      d="M -10 130 Q 15 110 35 130 Z" 
                      fill={isSatellite ? '#0284c7' : '#93c5fd'} 
                      opacity="0.8" 
                    />

                    {/* Sketch Cameroon Border Shape */}
                    <path 
                      d="M 25 115 L 35 105 L 32 80 L 15 75 L 20 60 L 10 40 L 40 30 L 60 10 L 75 14 L 62 45 L 80 50 L 72 70 L 65 85 L 55 98 L 40 105 Z" 
                      fill={isSatellite ? '#14532d' : '#e2e8f0'} 
                      stroke={isSatellite ? '#166534' : '#cbd5e1'} 
                      strokeWidth="0.8" 
                      opacity="0.55" 
                    />

                    {/* Render existing region cities as blue pin references */}
                    {Object.keys(REGIONS_CITIES).map(reg => {
                      return REGIONS_CITIES[reg].map(c => {
                        // Map coordinates (approx bounds)
                        const cx = ((c.lng - 8.5) / 7.5) * 100;
                        const cy = 120 - (((c.lat - 2.0) / 10.8) * 120);
                        return (
                          <g key={c.city} opacity="0.65">
                            <circle cx={cx} cy={cy} r="1.2" fill="#3b82f6" />
                            <text x={cx + 2} y={cy + 1} fill={isSatellite ? '#94a3b8' : '#64748b'} fontSize="2.8" fontStyle="italic">
                              {c.city.split(' ')[0]}
                            </text>
                          </g>
                        );
                      });
                    })}

                    {/* DRAGGABLE / PLACED POSITION PIN MARKER */}
                    {(() => {
                      const px = ((gpsLocation.longitude - 8.5) / 7.5) * 100;
                      const py = 120 - (((gpsLocation.latitude - 2.0) / 10.8) * 120);
                      return (
                        <g transform={`translate(${px}, ${py})`} className="animate-bounce">
                          {/* Radial coordinates halo */}
                          <circle cx="0" cy="0" r="4.5" fill="#ef4444" opacity="0.2" className="animate-pulse" />
                          <circle cx="0" cy="0" r="1.8" fill="#ef4444" opacity="0.4" />
                          {/* Pin teardrop */}
                          <path d="M 0 0 C -2 -3 -3 -5 0 -8 C 3 -5 2 -3 0 0 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
                          <circle cx="0" cy="-6" r="1" fill="#ffffff" />
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Maps status label indicator */}
                  <div className={`m-3 p-2.5 rounded-xl text-[10px] space-y-1 block z-10 w-4/5 shadow-md ${
                    themeMode === 'dark' ? 'bg-slate-950/95 text-slate-300 border border-slate-800' : 'bg-white/95 text-slate-700 border border-slate-100'
                  }`}>
                    <div className="flex justify-between font-bold">
                      <span className="text-blue-500 font-mono flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>Google Live Pointer</span>
                      </span>
                      <span className="text-slate-400 font-mono font-bold">Zoom {mapZoom}x</span>
                    </div>
                    <p className="text-slate-400 text-[9px] leading-relaxed">
                      {gpsLocation.city} ({gpsLocation.region} Region)
                    </p>
                    <div className="text-[9px] text-slate-550 flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 font-mono">
                      <span>Lat: {gpsLocation.latitude}</span>
                      <span>Lng: {gpsLocation.longitude}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-[10px] leading-relaxed text-blue-450 space-y-1">
                  <span className="font-extrabold flex items-center space-x-1 uppercase text-blue-500 font-mono">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Google Maps Localisation</span>
                  </span>
                  <p>{t.mapTip}</p>
                </div>

              </div>
            )}

            {/* SCREEN TAB C: AI Network Stability Prediction Panel */}
            {phoneScreenTab === 'predict' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-150'} shadow-sm space-y-3`}>
                  
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h3 className="text-xs font-black uppercase text-amber-500 font-mono">{t.predictionTitle}</h3>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    {t.predictionPrompt}
                  </p>

                  <div className="space-y-2 border-t border-slate-150 dark:border-slate-800 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{t.regionLabel}</span>
                        <div className="font-bold">{region}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{t.cityLabel}</span>
                        <div className="font-bold">{gpsLocation.city}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block">{t.selectTime}</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((block) => {
                          const isSel = predictionTime === block;
                          return (
                            <button
                              type="button"
                              key={block}
                              onClick={() => setPredictionTime(block)}
                              className={`text-[9.5px] font-bold py-1 px-1 rounded border transition-all text-center ${
                                isSel
                                  ? 'bg-amber-550 border-amber-600 text-slate-950 font-extrabold'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                              }`}
                            >
                              {block === 'Morning' && t.morning}
                              {block === 'Afternoon' && t.afternoon}
                              {block === 'Evening' && t.evening}
                              {block === 'Night' && t.night}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={requestNetworkPrediction}
                      disabled={isPredicting}
                      className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black uppercase tracking-wider py-2.5 rounded-lg text-xs flex items-center justify-center space-x-2 text-slate-950 shadow-md"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isPredicting ? 'animate-spin' : ''}`} />
                      <span>{isPredicting ? t.calculating : t.runPredictionBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Predictor Outcomes rendering */}
                {predictionResult && (
                  <div className={`p-4 rounded-2xl border animate-fade-in space-y-3.5 ${
                    themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-150'
                  } shadow-md`}>
                    
                    <div className="border-b dark:border-slate-800 pb-2.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
                        {t.recommends}
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                          {predictionResult.recommendedOperator}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] text-slate-500">{t.confidence}:</span>
                          <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-20 px-1.5 py-0.5 rounded">
                            {predictionResult.confidenceScore}%
                          </span>
                        </div>
                      </div>
                      <p className="text-[10 py text-slate-400 mt-2 leading-relaxed">
                        {predictionResult.reason}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">
                        {t.stabiltyRating}
                      </span>
                      
                      <div className="space-y-2">
                        {predictionResult.rankings.map((rank, i) => {
                          const percentage = rank.score;
                          // decide progress color
                          let barColor = 'bg-emerald-500';
                          if (percentage < 45) barColor = 'bg-rose-550';
                          else if (percentage < 70) barColor = 'bg-amber-500';

                          return (
                            <div key={rank.operator} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className={`font-bold ${i === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  {i + 1}. {rank.operator}
                                </span>
                                <span className="font-mono font-semibold">{rank.score} / 100 QoS</span>
                              </div>
                              <g className="flex items-center space-x-2">
                                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                                  <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono flex-shrink-0">
                                  {rank.expectedDownloadSpeed}M / {rank.expectedLatency}ms
                                </span>
                              </g>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
  );
}
