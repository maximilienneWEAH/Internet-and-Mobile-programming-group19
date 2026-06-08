/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { 
  Database,
  Network, 
  Activity, 
  TrendingUp, 
  Cpu, 
  ShieldAlert, 
  Search, 
  Filter, 
  MapPin, 
  Sparkles, 
  CornerDownRight, 
  Clock, 
  Signal, 
  ArrowUpDown,
  DownloadCloud,
  User,
  UserPlus,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserCog,
  Crown,
  AlertTriangle,
  Mail,
  Phone,
  Settings,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { QoEReport, OperatorComparisonStats, RegionSummary, SubscriberUser } from '../types';

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

const translations = {
  EN: {
    portal: "ART National Regulator Room",
    operatorPortal: "Operator Portal",
    title: "NetPulse Administrative Grid Console",
    operatorTitle: "QoS Audit Dashboard",
    desc: "Audit telemetric speed tests, monitor ISP stability ratios, and manage Cameroon subscriber and operator access credentials.",
    operatorDesc: "Review subscribers' direct feedback logs, bandwidth measurements, and active signal quality indexes reported for different operators.",
    tabMetrics: "National QoS Telemetries",
    tabDirectory: "Subscriber & Operator Directory",
    dbTitle: "Subscriber Database",
    activeRecs: "Total Active Telemetry Recs",
    dbDesc: "Real-time user feedback and QoS traces",
    nationalMeanQoe: "National Mean QoE",
    satisfactionIndex: "Subscriber Satisfaction Index",
    avgQosDownload: "Avg QoS Download",
    meanSubscriberBandwidth: "Mean Subscriber Bandwidth",
    weightedAvg: "Weighted average of combined operators",
    meanLatency: "Mean Network Latency",
    rttDelay: "RTT National Response Delay",
    optimalLatency: "Optimal latency index < 60ms",
    regionalWatchlist: "Cameroon Region Watchlist",
    regionalWatchlistDesc: "Analysis of average subjective subscriber satisfaction and poor connectivity ratio across all 10 regions.",
    activeWatchlistCount: "Active Watchlist: 10 Regions",
    sampleCount: "Sample Count",
    traces: "Traces",
    troubleRatio: "Trouble Ratio",
    intelligenceNote: "Watchlist Intelligence Advisory Note:",
    intelligenceBody: "Camtel, Orange, Nexttel, and MTN Cameroon utilize distinct radio bands. Highly forested, hilly or remote regions such as the Northwest, East and Far North often record significant packet drops due to physical attenuation and tower spacing constraints.",
    bandBenchmarks: "QoS Carrier Bandwidth Benchmarks (Mbps)",
    bandBenchmarksDesc: "Measures the average objective transmission capability across Cameroon.",
    downloadSpeedLabel: "Download Speed (Mbps)",
    uploadSpeedLabel: "Upload Speed (Mbps)",
    carrierSatisfactionLabel: "Carrier Satisfaction Index (QoE)",
    carrierSatisfactionDesc: "Cross-comparing consumer subjective satisfaction rating vs average sample volumes.",
    meanSatisfactionLine: "Mean Satisfaction (QoE / 5.0)",
    recordedSampleCountLine: "Recorded Sample Count",
    liveDbTitle: "Live Subscriber Telemetry Database",
    liveDbDesc: "Search and segment live subscriber QoE complaints and physical QoS test records.",
    viewingRows: "Viewing {filtered} of {total} subscriber rows",
    searchPlaceholder: "Search city, device, comment...",
    allOperators: "All Operators",
    allRegions: "All Regions",
    allNetworkTypes: "All Connection Types",
    submittedUtc: "Submitted (UTC)",
    location: "Location",
    operator: "Operator",
    radioStandards: "Radio Standards",
    signalDbm: "Signal (dBm)",
    qosPerformance: "QoS Performance",
    customerQoeIndex: "Customer QoE Index",
    subscriberFeedback: "Subscriber Feedback",
    noLogsMatched: "No subscriber logs match the active query filters.",
    noDescLogged: "No description logged.",
    regionText: "Region",
    languageSelect: "Language",
    themeModeSelect: "Theme Mode",
    successMsg: "Subscribers status updated successfully!"
  },
  FR: {
    portal: "Salle de Régulation Nationale de l'ART",
    operatorPortal: "Portail Opérateur",
    title: "Console Réseau Administrative NetPulse",
    operatorTitle: "Tableau de Bord d’Audit QoS",
    desc: "Auditez les tests de débit télémétriques, surveillez les ratios de stabilité des FAI et gérez les identifiants d’accès des abonnés et des opérateurs au Cameroun.",
    operatorDesc: "Examinez les journaux de commentaires des abonnés, les mesures de bande passante et les indices de qualité de signal actif signalés pour les différents opérateurs.",
    tabMetrics: "Télémétrie Nationale QoS",
    tabDirectory: "Répertoire Abonnés & Opérateurs",
    dbTitle: "Base de Données des Abonnés",
    activeRecs: "Total des Relevés Télémétriques Actifs",
    dbDesc: "Commentaires des utilisateurs en temps réel et traces de qualité de service (QoS)",
    nationalMeanQoe: "QoE Moyenne Nationale",
    satisfactionIndex: "Indice de Satisfaction des Abonnés",
    avgQosDownload: "Débit Interne Moyen descendant",
    meanSubscriberBandwidth: "Bande Passante Moyenne des Abonnés",
    weightedAvg: "Moyenne pondérée des opérateurs combinés",
    meanLatency: "Latence Réseau Moyenne",
    rttDelay: "Délai de Réponse National RTT",
    optimalLatency: "Index de latence optimal < 60ms",
    regionalWatchlist: "Liste de Surveillance Métrique des Régions",
    regionalWatchlistDesc: "Analyse de la satisfaction subjective moyenne des abonnés et du taux de mauvaise connectivité dans les 10 régions.",
    activeWatchlistCount: "Surveillance Active : 10 Régions",
    sampleCount: "Nombre d'Échantillons",
    traces: "Mesures",
    troubleRatio: "Taux d'Anomalies",
    intelligenceNote: "Note Consultative de Renseignement :",
    intelligenceBody: "Camtel, Orange, Nexttel et MTN Cameroun utilisent des bandes radio distinctes. Les régions très forestières, montagneuses ou reculées telles que le Nord-Ouest, l'Est et l'Extrême-Nord enregistrent souvent des pertes de paquets importantes en raison de l'atténuation physique et de l'espacement des pylônes.",
    bandBenchmarks: "Bande Passante de Référence des Opérateurs (Mbps)",
    bandBenchmarksDesc: "Mesure la capacité de transmission objective moyenne à travers le Cameroun.",
    downloadSpeedLabel: "Vitesse de Téléchargement (Mbps)",
    uploadSpeedLabel: "Vitesse de Téléversement (Mbps)",
    carrierSatisfactionLabel: "Indice de Satisfaction des Transporteurs (QoE)",
    carrierSatisfactionDesc: "Comparaison croisée du taux de satisfaction subjective des consommateurs par rapport aux volumes moyens d'échantillons.",
    meanSatisfactionLine: "Satisfaction Moyenne (QoE / 5.0)",
    recordedSampleCountLine: "Volume d'Échantillons Enregistrés",
    liveDbTitle: "Base de Données de Télémétrie en Direct",
    liveDbDesc: "Recherchez et segmentez les plaintes QoE et les enregistrements de tests QoS physiques des abonnés.",
    viewingRows: "Affichage de {filtered} sur {total} lignes d'abonnés",
    searchPlaceholder: "Rechercher ville, appareil, commentaire...",
    allOperators: "Tous les Opérateurs",
    allRegions: "Toutes les Régions",
    allNetworkTypes: "Tous les Types de Connexion",
    submittedUtc: "Soumis (UTC)",
    location: "Emplacement",
    operator: "Opérateur",
    radioStandards: "Normes Radio",
    signalDbm: "Signal (dBm)",
    qosPerformance: "Performance QoS",
    customerQoeIndex: "Indice QoE Client",
    subscriberFeedback: "Commentaires de l'Abonné",
    noLogsMatched: "Aucun relevé d'abonné ne correspond aux filtres de recherche actifs.",
    noDescLogged: "Aucune remarque enregistrée.",
    regionText: "Région",
    languageSelect: "Langue",
    themeModeSelect: "Mode Thème",
    successMsg: "Statut de l'abonné mis à jour avec succès !"
  }
};

interface AnalyticsDashboardProps {
  reports: QoEReport[];
  stats: OperatorComparisonStats[];
  regionStats: RegionSummary[];
  totals: {
    totalSubmissions: number;
    avgOverallQoE: number;
    avgSpeed: number;
    latency: number;
  };
  users?: SubscriberUser[];
  onRefreshUsers?: () => void;
  currentUser?: SubscriberUser;
  themeMode?: 'light' | 'dark';
  setThemeMode?: (theme: 'light' | 'dark') => void;
}

export default function AnalyticsDashboard({ 
  reports, 
  stats, 
  regionStats, 
  totals,
  users = [],
  onRefreshUsers,
  currentUser,
  themeMode = 'light',
  setThemeMode
}: AnalyticsDashboardProps) {

  // Selected bilinguality lang selector
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');

  // Main Dashboard Panel Tabs: 'metrics' | 'userManagement'
  const [activeDashboardTab, setActiveDashboardTab] = useState<'metrics' | 'userManagement'>('metrics');

  // Metrics search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedNetwork, setSelectedNetwork] = useState('All');

  // We explicitly removed operator operatorName restrictions here, so all subscription reports are visible and searchable!

  // User directory filters and additions
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRegionFilter, setUserRegionFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userTierFilter, setUserTierFilter] = useState('All');

  // New Subscriber or Operator Creation State (Super Admin Control)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRegion, setNewUserRegion] = useState('Center');
  const [newUserCity, setNewUserCity] = useState('');
  const [newUserTier, setNewUserTier] = useState<'Standard' | 'Premium' | 'VIP'>('Standard');
  const [newUserRole, setNewUserRole] = useState<'subscriber' | 'operator'>('subscriber');
  const [newUserOperatorName, setNewUserOperatorName] = useState<any>('MTN Cameroon');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  
  const [userSubmitError, setUserSubmitError] = useState('');
  const [userSubmitSuccess, setUserSubmitSuccess] = useState('');

  // General Notification States
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Active Map-Hover region view
  const [activeRegionView, setActiveRegionView] = useState<string>('Center');

  // Filter telemetries database
  const filteredReports = reports.filter(r => {
    const matchesSearch = searchTerm === '' ||
      r.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.feedback.userComments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOperator = selectedOperator === 'All' || r.metrics.operator === selectedOperator;
    const matchesRegion = selectedRegion === 'All' || r.location.region === selectedRegion;
    const matchesNetwork = selectedNetwork === 'All' || r.metrics.networkType === selectedNetwork;

    return matchesSearch && matchesOperator && matchesRegion && matchesNetwork;
  });

  // Filter subscriber users array
  const filteredUsers = users.filter(usr => {
    const matchesUserSearch = userSearchTerm === '' ||
      usr.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      usr.phoneNumber.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      usr.city.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesRegion = userRegionFilter === 'All' || usr.region === userRegionFilter;
    const matchesStatus = userStatusFilter === 'All' || usr.status === userStatusFilter;
    const matchesTier = userTierFilter === 'All' || usr.priorityTier === userTierFilter;

    return matchesUserSearch && matchesRegion && matchesStatus && matchesTier;
  });

  // REST API: Change User Status (Active, Suspended, Banned)
  const handleUpdateUserStatus = async (userId: string, newStatus: 'Active' | 'Suspended' | 'Banned') => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`Subscribers status updated to "${newStatus}"!`);
        if (onRefreshUsers) onRefreshUsers();
        setTimeout(() => setActionSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // REST API: Toggle Priority Level (Standard, Premium, VIP)
  const handleUpdateUserTier = async (userId: string, newTier: 'Standard' | 'Premium' | 'VIP') => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priorityTier: newTier })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`Subscriber membership tier promoted to "${newTier}"!`);
        if (onRefreshUsers) onRefreshUsers();
        setTimeout(() => setActionSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // REST API: Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this subscriber account? This action is irreversible.")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMessage(`Subscriber workspace credentials terminated successfully.`);
        if (onRefreshUsers) onRefreshUsers();
        setTimeout(() => setActionSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // REST API: Submit new user
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSubmitError('');
    setUserSubmitSuccess('');

    if (!newUserName || !newUserEmail) {
      setUserSubmitError('Full name and email address are required.');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          phoneNumber: newUserPhone || '+237 671 23 45 67',
          city: newUserCity || 'Yaoundé Bastos',
          region: newUserRegion,
          priorityTier: newUserTier,
          role: newUserRole,
          password: newUserPassword,
          operatorName: newUserRole === 'operator' ? newUserOperatorName : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserSubmitSuccess(
          newUserRole === 'operator'
            ? `Generated credentials for Operator "${data.user.name}" successfully.`
            : `New Subscriber "${data.user.name}" registered safely.`
        );
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        setNewUserCity('');
        setNewUserPassword('password123');
        setNewUserRole('subscriber');
        
        if (onRefreshUsers) onRefreshUsers();
        setTimeout(() => {
          setShowAddUserModal(false);
          setUserSubmitSuccess('');
        }, 1500);
      } else {
        setUserSubmitError(data.error || 'Server rejected registration parameters.');
      }
    } catch (err) {
      setUserSubmitError('Could not contact creation endpoint.');
      console.error(err);
    }
  };

  // Color mappings for operators
  const getOperatorColor = (op: string) => {
    if (op.includes('MTN')) return '#EAB308'; // MTN Yellow
    if (op.includes('Orange')) return '#F97316'; // Orange Orange
    if (op.includes('Camtel')) return '#3B82F6'; // Camtel Blue
    return '#EF4444'; // Nexttel Red
  };

  // Format date helper
  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 py-4">

      {/* CORE REGULATOR/OPERATOR ROLE-BASED INTERFACE HEADER */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 ${
        themeMode === 'dark' ? 'border-slate-800' : 'border-slate-150'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`text-white font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase ${
              currentUser?.role === 'operator' ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              {currentUser?.role === 'operator' 
                ? `${currentUser.operatorName} ${translations[lang].operatorPortal}` 
                : translations[lang].portal}
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {currentUser?.role === 'operator' 
              ? `${currentUser.operatorName} ${translations[lang].operatorTitle}` 
              : translations[lang].title}
          </h1>
          <p className="text-xs text-slate-400">
            {currentUser?.role === 'operator' 
              ? translations[lang].operatorDesc 
              : translations[lang].desc}
          </p>
        </div>

        {/* Tab Controllers Toggle & Lang/Theme selector controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* FR/ENG Selector */}
          <div className={`flex rounded-lg p-0.5 border ${themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setLang('EN')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                lang === 'EN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : themeMode === 'dark' ? 'text-slate-400 hover:text-slate-250' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('FR')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                lang === 'FR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : themeMode === 'dark' ? 'text-slate-400 hover:text-slate-250' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              FR
            </button>
          </div>

          {/* Theme Mode Toggle (Sun/Moon) */}
          <button
            onClick={() => setThemeMode?.(themeMode === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-lg border transition-all ${
              themeMode === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-yellow-500 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
            }`}
            title={lang === 'EN' ? "Toggle Theme" : "Basculer le Thème"}
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Tab Controllers Toggle - Hidden or restricted based on role */}
          {currentUser?.role === 'admin' && (
            <div className={`flex p-1 rounded-xl border shadow-xs ${themeMode === 'dark' ? 'bg-slate-850 border-slate-750' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setActiveDashboardTab('metrics')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeDashboardTab === 'metrics' 
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold' 
                    : themeMode === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{translations[lang].tabMetrics}</span>
              </button>
              
              <button
                onClick={() => setActiveDashboardTab('userManagement')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeDashboardTab === 'userManagement' 
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold' 
                    : themeMode === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>{translations[lang].tabDirectory}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL ACTIONS SUCCESS BANNER */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 animate-bounce">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* PANEL TAB 1: National QoS metrics monitoring cockpit */}
      {activeDashboardTab === 'metrics' && (
        <div className="space-y-8">
          {/* SECTION 1: Strategic KPI Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className={`p-5 rounded-2xl border shadow-sm space-y-2 flex flex-col justify-between transition-all duration-300 ${
              themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono">{translations[lang].dbTitle}</span>
                <Database className="w-4 h-4 text-blue-500" />
              </div>
              <div className="py-2">
                <span className={`text-3xl font-black tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{totals.totalSubmissions}</span>
                <span className="text-xs font-mono text-slate-500 block">{translations[lang].activeRecs}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{translations[lang].dbDesc}</p>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm space-y-2 flex flex-col justify-between transition-all duration-300 ${
              themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono">{translations[lang].nationalMeanQoe}</span>
                <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div className="py-2">
                <div className="flex items-baseline space-x-1">
                  <span className={`text-3xl font-black tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{totals.avgOverallQoE}</span>
                  <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                </div>
                <span className="text-xs font-mono text-slate-500 block">{translations[lang].satisfactionIndex}</span>
              </div>
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`w-2 h-2 rounded-full ${star <= Math.round(totals.avgOverallQoE) ? 'bg-amber-400' : themeMode === 'dark' ? 'bg-slate-755' : 'bg-slate-200'}`}></span>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm space-y-2 flex flex-col justify-between transition-all duration-305 ${
              themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase font-mono">{translations[lang].avgQosDownload}</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="py-2">
                <span className={`text-3xl font-black tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{totals.avgSpeed}</span>
                <span className="text-xs font-semibold text-emerald-600 ml-1">Mbps</span>
                <span className="text-xs font-mono text-slate-500 block">{translations[lang].meanSubscriberBandwidth}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{translations[lang].weightedAvg}</p>
            </div>

            <div className={`p-5 rounded-2xl border shadow-sm space-y-2 flex flex-col justify-between transition-all duration-300 ${
              themeMode === 'dark' 
                ? 'bg-slate-900 border-indigo-950/40 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-blue-900/10' 
                : 'bg-white border-emerald-100 bg-gradient-to-br from-emerald-50/20 to-teal-50/10'
            }`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold uppercase font-mono ${themeMode === 'dark' ? 'text-indigo-400' : 'text-emerald-600'}`}>{translations[lang].meanLatency}</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="py-2">
                <span className={`text-3xl font-black tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{totals.latency}</span>
                <span className="text-xs font-semibold text-emerald-600 ml-1">ms</span>
                <span className="text-xs font-mono text-slate-500 block">{translations[lang].rttDelay}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium md:max-w-[200px]">{translations[lang].optimalLatency}</p>
            </div>

          </div>

          {/* SECTION 2: Cameroon Regional Watchlist and Intelligence */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-6 transition-all duration-300 ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b ${
              themeMode === 'dark' ? 'border-slate-800' : 'border-rose-50/50'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-base font-extrabold uppercase tracking-wide flex items-center space-x-2 ${
                  themeMode === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  <MapPin className="w-5 h-5 text-rose-500 animate-pulse" />
                  <span>{translations[lang].regionalWatchlist}</span>
                </h3>
                <p className="text-xs text-slate-400">{translations[lang].regionalWatchlistDesc}</p>
              </div>
              <div className={`text-xs font-mono border px-3 py-1.5 rounded-lg ${
                themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}>
                {translations[lang].activeWatchlistCount}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {regionStats.map((reg) => {
                let dotClass = 'bg-emerald-500';
                if (reg.avgQoE <= 2.5) {
                  dotClass = 'bg-red-500';
                } else if (reg.avgQoE < 3.8) {
                  dotClass = 'bg-amber-500';
                }

                return (
                  <div 
                    key={reg.region}
                    onClick={() => setActiveRegionView(reg.region)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                      activeRegionView === reg.region 
                        ? 'border-blue-500 bg-blue-50/10 shadow-sm ring-1 ring-blue-505' 
                        : themeMode === 'dark'
                        ? 'border-slate-800 hover:border-slate-700 hover:bg-slate-800 bg-slate-900/20'
                        : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></span>
                          <span className={`text-sm font-bold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{reg.region}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          themeMode === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100'
                        }`}>
                          {reg.sampleCount} {translations[lang].traces}
                        </span>
                      </div>

                      <div className={`space-y-1.5 pt-2 border-t ${themeMode === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-450">{translations[lang].traces}:</span>
                          <span className={`font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{reg.avgQoE} / 5.0</span>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-450">{translations[lang].troubleRatio}:</span>
                          <span className={`font-mono font-bold ${reg.troubleRatio > 25 ? 'text-red-500' : themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {reg.troubleRatio}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
              themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'
            }`}>
              <span className={`font-extrabold block text-[11px] uppercase tracking-wider font-mono ${
                themeMode === 'dark' ? 'text-white' : 'text-slate-700'
              }`}>{translations[lang].intelligenceNote}</span>
              <p className="leading-relaxed">
                {translations[lang].intelligenceBody}
              </p>
            </div>
          </div>

          {/* SECTION 3: Detailed Charts comparative analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart A: QoS Download & Upload Benchmarks */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-sm font-extrabold uppercase tracking-wide flex items-center space-x-1 ${
                  themeMode === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>{translations[lang].bandBenchmarks}</span>
                </h3>
                <p className="text-xs text-slate-400">{translations[lang].bandBenchmarksDesc}</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeMode === 'dark' ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="operator" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend tick={{ fontSize: '11px' }} />
                    <Bar name={translations[lang].downloadSpeedLabel} dataKey="avgDownload" radius={[4, 4, 0, 0]}>
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getOperatorColor(entry.operator)} />
                      ))}
                    </Bar>
                    <Bar name={translations[lang].uploadSpeedLabel} dataKey="avgUpload" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Latency vs Consumer Satisfaction Indexes */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="space-y-1">
                <h3 className={`text-sm font-extrabold uppercase tracking-wide flex items-center space-x-1 ${
                  themeMode === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>{translations[lang].carrierSatisfactionLabel}</span>
                </h3>
                <p className="text-xs text-slate-400">{translations[lang].carrierSatisfactionDesc}</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeMode === 'dark' ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="operator" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend tick={{ fontSize: '11px' }} />
                    <Line 
                      name={translations[lang].meanSatisfactionLine} 
                      type="monotone" 
                      dataKey="avgQoE" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      name={translations[lang].recordedSampleCountLine} 
                      type="monotone" 
                      dataKey="sampleCount" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* SECTION 4: Live Subscriber Telemetry Feed Table */}
          <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            
            {/* Table Controls */}
            <div className={`p-6 border-b space-y-4 ${
              themeMode === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'
            }`}>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className={`text-base font-extrabold flex items-center space-x-1.5 ${
                    themeMode === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Database className="w-4.5 h-4.5 text-blue-600" />
                    <span>{translations[lang].liveDbTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{translations[lang].liveDbDesc}</p>
                </div>

                <div className={`text-xs border px-3 py-1.5 rounded-lg flex items-center space-x-1 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{translations[lang].viewingRows.replace('{filtered}', String(filteredReports.length)).replace('{total}', String(reports.length))}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder={translations[lang].searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-9 pr-4 py-2 w-full text-xs border rounded-lg focus:ring-1 focus:ring-blue-500 ${
                      themeMode === 'dark' ? 'bg-slate-800 border-slate-705 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-855'
                    }`}
                  />
                </div>

                {/* Filter by Operator */}
                <div className={`flex items-center space-x-2 border rounded-lg px-2.5 py-1.5 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select 
                    id="filter-operator-select"
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className={`text-xs bg-transparent border-none w-full focus:outline-none ${
                      themeMode === 'dark' ? 'text-slate-100' : 'text-slate-850'
                    }`}
                  >
                    <option value="All" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>{translations[lang].allOperators}</option>
                    <option value="MTN Cameroon" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>MTN Cameroon</option>
                    <option value="Orange Cameroon" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>Orange Cameroon</option>
                    <option value="Camtel" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>Camtel</option>
                    <option value="Nexttel" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>Nexttel</option>
                  </select>
                </div>

                {/* Filter by Region */}
                <div className={`flex items-center space-x-2 border rounded-lg px-2.5 py-1.5 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <select 
                    id="filter-region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className={`text-xs bg-transparent border-none w-full focus:outline-none ${
                      themeMode === 'dark' ? 'text-slate-100' : 'text-slate-850'
                    }`}
                  >
                    <option value="All" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>{translations[lang].allRegions}</option>
                    {CAMEROON_REGIONS.map(reg => (
                      <option key={reg} value={reg} className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>{reg} {translations[lang].regionText}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Connection Type */}
                <div className={`flex items-center space-x-2 border rounded-lg px-2.5 py-1.5 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <Signal className="w-3.5 h-3.5 text-slate-400" />
                  <select 
                    id="filter-network-select"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className={`text-xs bg-transparent border-none w-full focus:outline-none ${
                      themeMode === 'dark' ? 'text-slate-105' : 'text-slate-850'
                    }`}
                  >
                    <option value="All" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>{translations[lang].allNetworkTypes}</option>
                    <option value="5G" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>5G (LTE-A Pro)</option>
                    <option value="4G" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>4G LTE</option>
                    <option value="3G" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>3G HSPA+</option>
                    <option value="2G" className={themeMode === 'dark' ? 'bg-slate-900 text-white' : ''}>2G EDGE</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Physical Grid Table */}
            <div className={`overflow-x-auto ${themeMode === 'dark' ? 'text-slate-100 bg-slate-900' : 'text-slate-800 bg-white'}`}>
              {filteredReports.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Database className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                  <p className="text-xs font-semibold">{translations[lang].noLogsMatched}</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`uppercase font-mono font-bold border-b ${
                      themeMode === 'dark' ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-50/80 border-slate-100 text-slate-500'
                    }`}>
                      <th className="px-6 py-4">{translations[lang].submittedUtc}</th>
                      <th className="px-6 py-4">{translations[lang].location}</th>
                      <th className="px-6 py-4">{translations[lang].operator}</th>
                      <th className="px-6 py-4">{translations[lang].radioStandards}</th>
                      <th className="px-6 py-4">{translations[lang].signalDbm}</th>
                      <th className="px-6 py-4">{translations[lang].qosPerformance}</th>
                      <th className="px-6 py-4">{translations[lang].customerQoeIndex}</th>
                      <th className="px-6 py-4">{translations[lang].subscriberFeedback}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    themeMode === 'dark' ? 'divide-slate-800 text-slate-350' : 'divide-slate-100 text-slate-700'
                  }`}>
                    {filteredReports.map((item) => (
                      <tr key={item.id} className={`transition-colors duration-150 ${
                        themeMode === 'dark' ? 'hover:bg-slate-800/40 text-slate-100' : 'hover:bg-slate-50/50 text-slate-700'
                      }`}>
                        
                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(item.timestamp)}</span>
                        </td>

                        {/* Geolocation */}
                        <td className="px-6 py-4">
                          <div className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.location.city}</div>
                          <div className={`text-[10px] font-mono inline-block rounded px-1 ${
                            themeMode === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-400'
                          }`}>{item.location.region} {translations[lang].regionText}</div>
                        </td>

                        {/* Operator */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 font-sans">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getOperatorColor(item.metrics.operator) }}></span>
                            <span className={`font-semibold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.metrics.operator}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{item.deviceModel}</div>
                        </td>

                        {/* Radio */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            themeMode === 'dark' ? 'bg-blue-950/40 text-blue-300' : 'bg-blue-50 text-blue-800'
                          }`}>
                            {item.metrics.networkType}
                          </span>
                        </td>

                        {/* Signal */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`font-mono font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{item.metrics.signalStrength} dBm</div>
                          <div className={`text-[10px] font-semibold ${
                            item.metrics.signalQuality === 'Excellent' || item.metrics.signalQuality === 'Good'
                              ? 'text-emerald-500'
                              : item.metrics.signalQuality === 'Fair'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}>
                            {item.metrics.signalQuality}
                          </div>
                        </td>

                        {/* Bandwidth Performance */}
                        <td className="px-6 py-4">
                          <div className={`grid grid-cols-2 gap-x-2 text-[10px] font-mono ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <div>DL: <strong className="text-emerald-500 font-bold">{item.metrics.downloadSpeed}M</strong></div>
                            <div>UL: <strong className="text-cyan-500 font-bold">{item.metrics.uploadSpeed}M</strong></div>
                            <div>RTT: <strong className="text-amber-500 font-bold">{item.metrics.latency}ms</strong></div>
                            <div>Loss: <strong className="text-rose-500 font-bold">{item.metrics.packetLoss}%</strong></div>
                          </div>
                        </td>

                        {/* Satisfaction value */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <span className={`px-2 py-1 rounded text-[11px] font-extrabold ${
                              item.feedback.overallQoE >= 4
                                ? themeMode === 'dark' ? 'bg-emerald-950/20 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                                : item.feedback.overallQoE >= 3
                                ? themeMode === 'dark' ? 'bg-amber-950/20 text-amber-300' : 'bg-amber-50 text-amber-800'
                                : themeMode === 'dark' ? 'bg-rose-950/20 text-rose-300' : 'bg-rose-50 text-rose-800'
                            }`}>
                              {item.feedback.overallQoE} / 5
                            </span>
                          </div>
                        </td>

                        {/* Comment & Frequent list */}
                        <td className="px-6 py-4 max-w-xs break-words">
                          {item.feedback.userComments ? (
                            <p className={`italic border-l-2 pl-2 mb-1.5 ${
                              themeMode === 'dark' ? 'text-slate-350 border-slate-700' : 'text-slate-700 border-slate-200'
                            }`}>
                              "{item.feedback.userComments}"
                            </p>
                          ) : (
                            <span className="text-slate-400 italic">{translations[lang].noDescLogged}</span>
                          )}
                          
                          {item.feedback.frequentIssues.length > 0 && (
                            <div className="flex flex-wrap gap-0.5 mt-1">
                              {item.feedback.frequentIssues.map(issue => (
                                <span key={issue} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                                  themeMode === 'dark' ? 'bg-rose-950/25 border-rose-900/30 text-rose-300' : 'bg-rose-50 border-rose-100 text-rose-700'
                                }`}>
                                  {issue}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>
      )}

      {/* PANEL TAB 2: User Account Credentials CRUD list */}
      {activeDashboardTab === 'userManagement' && (
        <div className="space-y-6">
          
          {/* USER MANAGEMENT CONTROL RAIL */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center space-x-1.5">
                <UserCog className="w-5 h-5 text-indigo-600" />
                <span>Global Subscribers & Devices Directory</span>
              </h3>
              <p className="text-xs text-slate-500">
                Grant memberships, elevate subscriber priority ranks, suspend accounts, and add diagnostic testing records.
              </p>
            </div>

            {/* BUTTON ADD USER ACCOUNT */}
            <button
              onClick={() => setShowAddUserModal(!showAddUserModal)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-md flex items-center space-x-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Generate Account Credentials</span>
            </button>
          </div>

          {/* DYNAMIC REGISTRATION DRAWER COLLAPSIBLE */}
          {showAddUserModal && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 p-6 rounded-3xl border border-blue-100/40 shadow-inner animate-fade-in space-y-4">
              <h4 className="text-sm font-black uppercase text-blue-700 flex items-center space-x-1.5">
                <UserPlus className="w-4 h-4" />
                <span>Configure Role, Credentials & Operator Assigns</span>
              </h4>

              {userSubmitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg font-semibold">
                  {userSubmitError}
                </div>
              )}
              {userSubmitSuccess && (
                <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs p-3 rounded-lg font-semibold">
                  {userSubmitSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUserSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amadou Bello"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. amadou@netpulse.cm"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +237 691 88 55 22"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cameroon Region</label>
                  <select
                    value={newUserRegion}
                    onChange={(e) => setNewUserRegion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                  >
                    {CAMEROON_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg} Region</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City/District</label>
                  <input
                    type="text"
                    placeholder="e.g. Bastos"
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">User Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-slate-205 rounded-lg text-slate-800 font-bold"
                  >
                    <option value="subscriber">Subscriber (Access App Sim)</option>
                    <option value="operator">Network Operator Auditor</option>
                  </select>
                </div>

                {newUserRole === 'operator' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Operator ISP Assignment</label>
                    <select
                      value={newUserOperatorName}
                      onChange={(e) => setNewUserOperatorName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                    >
                      <option value="MTN Cameroon">MTN Cameroon</option>
                      <option value="Orange Cameroon">Orange Cameroon</option>
                      <option value="Camtel">Camtel</option>
                      <option value="Nexttel">Nexttel</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Membership Rank</label>
                    <select
                      value={newUserTier}
                      onChange={(e) => setNewUserTier(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-800"
                    >
                      <option value="Standard">Standard (Regular)</option>
                      <option value="Premium">Premium Citizen</option>
                      <option value="VIP">VIP Gold</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Login Password</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter default login password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-205 rounded-lg text-slate-805 font-mono"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="bg-slate-205 hover:bg-slate-300 text-slate-800 text-xs px-4 py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2 rounded-lg font-bold shadow"
                  >
                    Generate Credentials
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST FILTER AND USER MATRIX */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            
            {/* Control Panel Filter for directory */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, phone, email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-2.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={userRegionFilter}
                  onChange={(e) => setUserRegionFilter(e.target.value)}
                  className="text-xs bg-transparent border-none w-full focus:outline-none text-slate-800"
                >
                  <option value="All">All Regions</option>
                  {CAMEROON_REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-2.5">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="text-xs bg-transparent border-none w-full focus:outline-none text-slate-800"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-2.5">
                <Crown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={userTierFilter}
                  onChange={(e) => setUserTierFilter(e.target.value)}
                  className="text-xs bg-transparent border-none w-full focus:outline-none text-slate-800"
                >
                  <option value="All">All Ranks</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            {/* DIRECTORY LIST COMPONENT */}
            <div className="overflow-x-auto text-slate-800">
              {filteredUsers.length === 0 ? (
                <div className="p-16 text-center text-slate-400 space-y-2">
                  <User className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No Subscriber Accounts Found</p>
                  <p className="text-[11px] text-slate-400">Add a subscriber card or clear filters to refresh the system indexes.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-mono font-bold">
                      <th className="px-6 py-4">Subscriber Identity</th>
                      <th className="px-6 py-4">Location Pointer</th>
                      <th className="px-6 py-4">Account Status</th>
                      <th className="px-6 py-4">Membership Tier</th>
                      <th className="px-6 py-4 text-center">Submitted Qos Traces</th>
                      <th className="px-6 py-4">Date Joined</th>
                      <th className="px-6 py-4 text-right">Administrative Commands</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredUsers.map((usr) => {
                      // Status colors
                      let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                      if (usr.status === 'Suspended') statusBadge = 'bg-amber-50 text-amber-800 border-amber-100';
                      if (usr.status === 'Banned') statusBadge = 'bg-rose-50 text-rose-800 border-rose-100';

                      // Membership badge
                      let tierBadge = 'bg-slate-100 text-slate-700';
                      if (usr.priorityTier === 'Premium') tierBadge = 'bg-indigo-50 text-indigo-800 font-bold border-indigo-100';
                      if (usr.priorityTier === 'VIP') tierBadge = 'bg-amber-50 text-amber-850 font-black border-amber-200';

                      return (
                        <tr key={usr.id} className="hover:bg-slate-50/40 transition-colors">
                          
                          {/* Profile Identity Details */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {/* Avatar design */}
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-700 font-extrabold text-xs shadow-inner">
                                {usr.name ? usr.name.split(' ').map(n=>n[0]).join('') : 'U'}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                                  <span>{usr.name}</span>
                                  {usr.priorityTier === 'VIP' && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1 items-center">
                                  {usr.role === 'admin' ? (
                                    <span className="bg-red-50 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-red-200">Admin</span>
                                  ) : usr.role === 'operator' ? (
                                    <span className="bg-amber-55 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-amber-200">Operator: {usr.operatorName}</span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-slate-200">Subscriber</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 flex flex-col space-y-0.5">
                                  <span className="flex items-center space-x-1"><Mail className="w-2.5 h-2.5 text-slate-400" /> <span>{usr.email}</span></span>
                                  <span className="flex items-center space-x-1"><Phone className="w-2.5 h-2.5 text-slate-400" /> <span>{usr.phoneNumber}</span></span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Regional location parameters */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">{usr.city}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                              {usr.region} Region
                            </div>
                          </td>

                          {/* Account Status column */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wide uppercase ${statusBadge}`}>
                              {usr.status}
                            </span>
                          </td>

                          {/* Member rating priority tier */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${tierBadge}`}>
                              {usr.priorityTier}
                            </span>
                          </td>

                          {/* Traces Count */}
                          <td className="px-6 py-4 whitespace-nowrap text-center font-mono font-bold text-slate-900 bg-slate-50/25">
                            {usr.tracesCount}
                          </td>

                          {/* Join date */}
                          <td className="px-6 py-4 whitespace-nowrap text-[10px] text-slate-400 font-mono">
                            {new Date(usr.registeredAt).toLocaleDateString()}
                          </td>

                          {/* Administrative Operations Control buttons */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                            <div className="flex justify-end items-center gap-1.5 list-none">
                              
                              {/* QUICK STATUS ACTIONS DROPDOWN/CYCLE */}
                              {usr.status !== 'Active' ? (
                                <button
                                  onClick={() => handleUpdateUserStatus(usr.id, 'Active')}
                                  title="Restore Account to Active Status"
                                  className="p-1 px-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold"
                                >
                                  Activate
                                </button>
                              ) : (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleUpdateUserStatus(usr.id, 'Suspended')}
                                    title="Temporarily Suspend Account privileges"
                                    className="p-1 px-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-bold"
                                  >
                                    Suspend
                                  </button>
                                  <button
                                    onClick={() => handleUpdateUserStatus(usr.id, 'Banned')}
                                    title="Hard Ban Credentials of Abonne"
                                    className="p-1 px-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-[10px] font-bold"
                                  >
                                    Ban
                                  </button>
                                </div>
                              )}

                              {/* TIER TOGGLE */}
                              <button
                                onClick={() => handleUpdateUserTier(usr.id, usr.priorityTier === 'VIP' ? 'Standard' : usr.priorityTier === 'Premium' ? 'VIP' : 'Premium')}
                                title="Promote subscriber rank cycle"
                                className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-700 rounded"
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => handleDeleteUser(usr.id)}
                                title="Delete account information instantly"
                                className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Matrix advisory disclaimer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 font-mono text-[9px] text-slate-400 leading-relaxed flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                Subscriber access and QoS evaluation tier ratings influence predicted stability limits and server API weights dynamically.
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
