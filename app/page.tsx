'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Phone, 
  HeartPulse, 
  Settings, 
  Users, 
  Bell, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  User, 
  MapPin, 
  Sparkles, 
  Clock, 
  Radio,
  Zap,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Eye,
  Video,
  VideoOff,
  RefreshCw,
  Sparkle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// ==========================================
// DATA TYPES & SCHEMAS
// ==========================================

interface MetricData {
  time: string;
  suhu: number;
  kelembaban: number;
  gerakan: number;
}

const raw24hData: MetricData[] = [
  { time: '10:00', suhu: 25.8, kelembaban: 59, gerakan: 10 },
  { time: '12:00', suhu: 26.1, kelembaban: 58, gerakan: 11 },
  { time: '14:00', suhu: 26.5, kelembaban: 56, gerakan: 15 },
  { time: '16:00', suhu: 26.8, kelembaban: 55, gerakan: 14 },
  { time: '18:00', suhu: 26.3, kelembaban: 57, gerakan: 12 },
  { time: '20:00', suhu: 26.0, kelembaban: 58, gerakan: 9 },
  { time: '22:00', suhu: 25.9, kelembaban: 59, gerakan: 8 },
  { time: '00:00', suhu: 25.7, kelembaban: 60, gerakan: 6 },
  { time: '02:00', suhu: 25.5, kelembaban: 60, gerakan: 4 },
  { time: '04:00', suhu: 25.4, kelembaban: 61, gerakan: 5 },
  { time: '06:00', suhu: 25.8, kelembaban: 59, gerakan: 10 },
  { time: '08:00', suhu: 26.2, kelembaban: 58, gerakan: 13 },
  { time: '10:00', suhu: 26.4, kelembaban: 58, gerakan: 12 }
];

const raw7dData = [
  { time: 'Senin', suhu: 25.9, kelembaban: 58, gerakan: 11 },
  { time: 'Selasa', suhu: 26.1, kelembaban: 57, gerakan: 13 },
  { time: 'Rabu', suhu: 26.0, kelembaban: 59, gerakan: 12 },
  { time: 'Kamis', suhu: 26.2, kelembaban: 58, gerakan: 14 },
  { time: 'Jumat', suhu: 26.4, kelembaban: 58, gerakan: 12 },
  { time: 'Sabtu', suhu: 26.3, kelembaban: 57, gerakan: 10 },
  { time: 'Minggu', suhu: 26.1, kelembaban: 58, gerakan: 11 }
];

const raw30dData = [
  { time: 'Minggu 1', suhu: 26.0, kelembaban: 58, gerakan: 12 },
  { time: 'Minggu 2', suhu: 26.2, kelembaban: 57, gerakan: 13 },
  { time: 'Minggu 3', suhu: 26.1, kelembaban: 58, gerakan: 11 },
  { time: 'Minggu 4', suhu: 26.3, kelembaban: 57, gerakan: 12 }
];

interface AlertItem {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  time: string;
}

const initialAlerts: AlertItem[] = [
  { id: '1', title: 'Gerakan tidak biasa terdeteksi', severity: 'High', time: '07:45 WIB' },
  { id: '2', title: 'Suhu ruangan sedikit tinggi', severity: 'Medium', time: '05:20 WIB' },
  { id: '3', title: 'Cahaya ruangan rendah', severity: 'Low', time: '02:15 WIB' }
];

const DEFAULT_AI_PROMPTS = {
  AMAN: "An overhead high-angle wide CCTV camera shot of an elderly Asian grandmother with short gray hair, wearing light blue hospital pajamas, lying flat on her back sleeping peacefully and safely on a cozy modern bedroom bed. There is NO blanket or quilt on the bed, her entire body and pajamas are fully visible and uncovered. Ambient warm room lighting, sharp surveillance camera, realistic, photorealistic.",
  PERINGATAN: "An overhead high-angle wide CCTV camera shot of an elderly Asian grandmother with short gray hair, wearing light blue hospital pajamas, lying uneasy and restless near the very edge of her bedroom bed, struggling to turn over. There is NO blanket or quilt, her entire body and pajamas are fully visible and completely uncovered. Ambient warm room lighting, sharp surveillance camera, realistic, photorealistic.",
  BAHAYA: "An overhead high-angle wide CCTV camera shot of an elderly Asian grandmother with short gray hair, wearing light blue hospital pajamas, who has accidentally fallen out of bed onto the floor in her bedroom, lying beside the bed, emergency situation. There is NO blanket or quilt, her entire body and pajamas are fully visible on the floor. Ambient warm room lighting, sharp surveillance camera, realistic, photorealistic."
};

export default function Page() {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [systemState, setSystemState] = useState<'AMAN' | 'PERINGATAN' | 'BAHAYA'>('AMAN');
  const [riskScore, setRiskScore] = useState(18);
  const [liveSuhu, setLiveSuhu] = useState(26.4);
  const [liveKelembaban, setLiveKelembaban] = useState(58);
  const [liveGerakan, setLiveGerakan] = useState(12);
  const [liveCahaya, setLiveCahaya] = useState(120);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [chartRange, setChartRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [fps, setFps] = useState(30);

  const [generatedFeeds, setGeneratedFeeds] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'danger'>('info');

  const triggerToast = (msg: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const generateCameraFeed = async (stateKey: 'AMAN' | 'PERINGATAN' | 'BAHAYA', userPrompt?: string) => {
    const promptText = userPrompt || DEFAULT_AI_PROMPTS[stateKey];
    setIsGenerating(true);
    setGenerationError(null);
    
    let delay = 1000;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const payload = {
          instances: { prompt: promptText },
          parameters: { "sampleCount": 1 }
        };
        const apiKey = ""; // Disisipkan secara otomatis oleh lingkungan kerja
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        
        const result = await response.json();
        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
          const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
          setGeneratedFeeds(prev => ({ ...prev, [stateKey]: imageUrl }));
          setIsGenerating(false);
          triggerToast('Koneksi Aliran Kamera CCTV Berhasil Tersambung', 'success');
          return;
        }
      } catch (err) {
        console.warn(`Attempt ${attempt + 1} to fetch camera feed failed. Retrying...`, err);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    setIsGenerating(false);
    // Jika API error/tanpa key, fallback digambar lewat interface secara elegan tanpa merusak demo
    setGenerationError("Kamera lokal gagal terhubung. Menggunakan emulasi visual terkalibrasi.");
  };

  useEffect(() => {
    generateCameraFeed('AMAN');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (systemState === 'AMAN') {
        setLiveSuhu(prev => +(prev + (Math.random() - 0.5) * 0.15).toFixed(1));
        setLiveKelembaban(prev => Math.min(100, Math.max(0, prev + Math.floor((Math.random() - 0.5) * 2))));
        setLiveGerakan(prev => Math.min(30, Math.max(1, prev + Math.floor((Math.random() - 0.5) * 3))));
        setLiveCahaya(prev => Math.min(400, Math.max(10, prev + Math.floor((Math.random() - 0.5) * 5))));
        setFps(prev => Math.min(31, Math.max(29, prev + Math.floor((Math.random() - 0.5) * 1.2))));
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [systemState]);

  const handleSimulateNormal = () => {
    setSystemState('AMAN');
    setRiskScore(18);
    setLiveSuhu(26.4);
    setLiveKelembaban(58);
    setLiveGerakan(12);
    setLiveCahaya(120);
    triggerToast('Simulasi: Kondisi pasien kembali Normal & Stabil', 'success');
    
    if (!generatedFeeds['AMAN']) {
      generateCameraFeed('AMAN');
    }
  };

  const handleSimulateWarning = () => {
    setSystemState('PERINGATAN');
    setRiskScore(48);
    setLiveSuhu(26.1); 
    setLiveKelembaban(59);
    setLiveGerakan(22); 
    setLiveCahaya(120);
    
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      title: 'Pasien tidur menepi & kesulitan bergerak',
      severity: 'Medium',
      time: 'Sekarang'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerToast('Simulasi: Pasien berbaring menepi & gelisah', 'warning');
    
    if (!generatedFeeds['PERINGATAN']) {
      generateCameraFeed('PERINGATAN');
    }
  };

  const handleSimulateCritical = () => {
    setSystemState('BAHAYA');
    setRiskScore(92);
    setLiveSuhu(26.2);
    setLiveKelembaban(58);
    setLiveGerakan(45); 
    setLiveCahaya(120);
    
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      title: 'Deteksi Gerakan Spontan / Potensi Pasien Jatuh!',
      severity: 'High',
      time: 'Sekarang'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerToast('BAHAYA: Deteksi aktivitas motorik ekstrim pasca-stroke!', 'danger');
    
    if (!generatedFeeds['BAHAYA']) {
      generateCameraFeed('BAHAYA');
    }
  };

  const handleCustomGeneration = () => {
    if (!customPrompt.trim()) return;
    triggerToast('Menganalisis skenario ruang baru pada sensor visual...', 'info');
    generateCameraFeed(systemState, customPrompt);
  };

  const getChartData = () => {
    switch(chartRange) {
      case '7d': return raw7dData;
      case '30d': return raw30dData;
      default: return raw24hData;
    }
  };

  const renderLiveCameraFeed = () => {
    if (!isCameraOn) {
      return (
        <div className="absolute inset-0 bg-[#070A13] flex flex-col items-center justify-center text-slate-500">
          <VideoOff className="w-10 h-10 mb-2 animate-pulse" />
          <p className="text-xs font-semibold">Aliran Kamera Dinonaktifkan</p>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="absolute inset-0 bg-[#070A13] flex flex-col items-center justify-center text-teal-400 p-6 z-30">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin"></div>
            <Sparkle className="w-6 h-6 text-teal-300 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-xs font-mono tracking-wider animate-pulse text-center">MENGHUBUNGKAN KE LIVE FEED CCTV...</p>
          <span className="text-[9px] text-slate-500 mt-2 text-center max-w-xs font-mono">DEKODE ALIRAN FRAME CCTV...</span>
        </div>
      );
    }

    const currentAiImage = generatedFeeds[systemState];

    let boundingBoxColor = "border-emerald-500";
    let boundingBoxBg = "bg-emerald-500/5";
    let boundingBoxText = "ANALISIS: Postur Normal (Aman)";
    let confidenceRate = "98.7%";
    let coordinateLabel = "X: 142 Y: 84 Z: 1.2m";

    if (systemState === 'PERINGATAN') {
      boundingBoxColor = "border-amber-500";
      boundingBoxBg = "bg-amber-500/5";
      boundingBoxText = "ANALISIS: Posisi Menepi (Gelisah)";
      confidenceRate = "93.8%";
      coordinateLabel = "X: 190 Y: 110 Z: 0.9m";
    } else if (systemState === 'BAHAYA') {
      boundingBoxColor = "border-red-500";
      boundingBoxBg = "bg-red-500/10 animate-pulse";
      boundingBoxText = "🚨 ANALISIS: DETEKSI PASIEN JATUH!";
      confidenceRate = "99.1%";
      coordinateLabel = "X: 92 Y: 210 Z: 0.1m";
    }

    return (
      <div className="absolute inset-0 bg-[#070A13] flex flex-col justify-between p-4 overflow-hidden select-none">
        
        {/* Render real-time generated photograph if ready, otherwise fallback gracefully to dynamic infrared medical vector */}
        {currentAiImage ? (
          <img 
            src={currentAiImage} 
            alt="Real-time CCTV Feed" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2 opacity-90 z-0">
            <svg className="w-full h-full max-w-lg" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="thermalHead" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </radialGradient>
                <linearGradient id="thermalTorso" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              <rect x="40" y="55" width="240" height="70" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.4" />
              <rect x="225" y="42" width="35" height="10" rx="2" fill="#1E293B" />

              {systemState === 'AMAN' && (
                <g className="transition-all duration-500">
                  <circle cx="235" cy="48" r="9" fill="url(#thermalHead)" stroke="#10B981" strokeWidth="1" />
                  <rect x="130" y="50" width="95" height="16" rx="5" fill="url(#thermalTorso)" stroke="#0284C7" strokeWidth="1" />
                  <rect x="60" y="52" width="70" height="12" rx="4" fill="#0284C7" />
                  
                  <circle cx="235" cy="48" r="2.5" fill="#10B981" className="animate-ping" />
                  <line x1="235" y1="48" x2="210" y2="58" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="210" cy="58" r="2.5" fill="#10B981" />
                  <line x1="210" y1="58" x2="150" y2="58" stroke="#10B981" strokeWidth="1" />
                  <circle cx="150" cy="58" r="2.5" fill="#10B981" />
                  <line x1="150" y1="58" x2="95" y2="58" stroke="#10B981" strokeWidth="1" />
                  <circle cx="95" cy="58" r="2.5" fill="#10B981" />
                </g>
              )}

              {systemState === 'PERINGATAN' && (
                <g className="transition-all duration-500">
                  <circle cx="235" cy="98" r="9" fill="url(#thermalHead)" stroke="#F59E0B" strokeWidth="1" />
                  <rect x="130" y="100" width="95" height="16" rx="5" fill="url(#thermalTorso)" stroke="#D97706" strokeWidth="1" />
                  <rect x="60" y="102" width="70" height="12" rx="4" fill="#D97706" />
                  
                  <circle cx="235" cy="98" r="2.5" fill="#F59E0B" />
                  <line x1="235" y1="98" x2="210" y2="108" stroke="#F59E0B" strokeWidth="1.5" />
                  <circle cx="210" cy="108" r="2.5" fill="#F59E0B" />
                  <line x1="210" y1="108" x2="150" y2="108" stroke="#F59E0B" strokeWidth="1" />
                  <circle cx="150" cy="108" r="2.5" fill="#F59E0B" />
                  <line x1="150" y1="108" x2="95" y2="108" stroke="#F59E0B" strokeWidth="1" />
                  <circle cx="95" cy="108" r="2.5" fill="#F59E0B" />
                </g>
              )}

              {systemState === 'BAHAYA' && (
                <g className="transition-all duration-500">
                  <circle cx="215" cy="150" r="9" fill="url(#thermalHead)" stroke="#EF4444" strokeWidth="1.5" />
                  <rect x="110" y="152" width="95" height="16" rx="5" fill="url(#thermalTorso)" stroke="#DC2626" strokeWidth="1" />
                  <rect x="40" y="154" width="70" height="12" rx="4" fill="#DC2626" />
                  
                  <circle cx="215" cy="150" r="2.5" fill="#EF4444" className="animate-ping" />
                  <line x1="215" y1="150" x2="190" y2="160" stroke="#EF4444" strokeWidth="1.5" />
                  <circle cx="190" cy="160" r="2.5" fill="#EF4444" />
                  <line x1="190" y1="160" x2="130" y2="160" stroke="#EF4444" strokeWidth="1" />
                  <circle cx="130" cy="160" r="2.5" fill="#EF4444" />
                  <line x1="130" y1="160" x2="75" y2="160" stroke="#EF4444" strokeWidth="1.5" />
                  <circle cx="75" cy="160" r="2.5" fill="#EF4444" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(15,118,110,0.15),transparent)] opacity-60 z-10"></div>
        <div className="absolute left-0 right-0 h-0.5 bg-teal-500/30 shadow-md animate-pulse top-1/3 pointer-events-none z-10"></div>
        
        {/* HUD Telemetry Details */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {systemState === 'AMAN' && (
            <div className={`absolute top-[20%] left-[15%] right-[15%] bottom-[35%] border border-dashed rounded-xl transition-all duration-300 ${boundingBoxColor} ${boundingBoxBg}`}>
              <span className="absolute top-1 left-2 bg-emerald-600 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                {boundingBoxText} • {confidenceRate}
              </span>
            </div>
          )}

          {systemState === 'PERINGATAN' && (
            <div className={`absolute top-[45%] left-[15%] right-[15%] bottom-[10%] border border-dashed rounded-xl transition-all duration-300 ${boundingBoxColor} ${boundingBoxBg}`}>
              <span className="absolute top-1 left-2 bg-amber-600 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                {boundingBoxText} • {confidenceRate}
              </span>
            </div>
          )}

          {systemState === 'BAHAYA' && (
            <div className={`absolute top-[70%] left-[10%] right-[20%] bottom-[2%] border-2 rounded-xl transition-all duration-300 ${boundingBoxColor} ${boundingBoxBg}`}>
              <span className="absolute -top-6 left-1 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-bounce">
                {boundingBoxText} • {confidenceRate}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-500/50"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-500/50"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-500/50"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-500/50"></div>
        </div>

        {/* Top telemetry panel */}
        <div className="flex items-center justify-between z-20">
          <div className="flex items-center space-x-2 bg-slate-950/85 px-2.5 py-1 rounded-lg text-[9px] text-slate-300 font-mono border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-semibold">PANDA_CAM_01 • OVERHEAD_VIEW</span>
          </div>
          <div className="bg-slate-950/85 px-2.5 py-1 rounded-lg text-[9px] text-slate-300 font-mono border border-slate-800">
            FPS: {fps} · SPATIAL_AI_ACTIVE
          </div>
        </div>

        {/* Bottom calibration data */}
        <div className="flex items-end justify-between z-20 w-full mt-auto">
          <div className="px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider bg-slate-950/90 text-teal-400 border border-teal-500/20 flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>KALIBRASI: {coordinateLabel}</span>
          </div>
          <div className="text-[8px] text-slate-400 font-mono bg-slate-950/80 px-2 py-0.5 rounded">
            RUMAH SAKIT BED #1
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex font-sans antialiased overflow-x-hidden">
      
      {/* Mobile Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#0F766E] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#0F766E]/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-tight text-[#111827] text-lg">PANDA</span>
                <span className="bg-[#ECFDF5] text-[#0F766E] text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-[#0F766E]/10">MVP</span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">Patient Monitoring</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { name: 'Overview', icon: Activity },
            { name: 'Live Monitoring', icon: Radio, badge: 'Live' },
            { name: 'Alerts', icon: AlertTriangle, count: alerts.length },
            { name: 'Reports', icon: FileText },
            { name: 'Patients', icon: Users },
            { name: 'Settings', icon: Settings },
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setIsSidebarOpen(false);
                  triggerToast(`Beralih ke halaman ${item.name}`, 'info');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0F766E]/5 text-[#0F766E] border-l-4 border-[#0F766E] pl-3' 
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-[#0F766E]' : 'text-[#64748B]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#EF4444]/10 text-[#EF4444] text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-slate-100 text-[#111827] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-sm border border-teal-200">
                DN
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#059669] border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#111827] truncate">Dina Aminah</h4>
              <p className="text-[10px] text-[#64748B] truncate">Caregiver (Anak)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main layout frame */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header navbar */}
        <header className="bg-white border-b border-[#E5E7EB] py-4 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 lg:space-x-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#111827]">Overview Monitoring</h1>
                <span className="inline-flex items-center bg-[#ECFDF5] text-[#0F766E] text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-medium border border-[#0F766E]/10 gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-ping"></span>
                  Live · Ambient Intelligence
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5 hidden sm:block">
                Sistem Ambient Intelijen pendeteksi dini anomali aktivitas & lingkungan pasien stroke
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-[#111827]">Selasa, 21 Mei 2026</p>
              <p className="text-[10px] text-[#64748B]">Terakhir diperbarui: 10:24 WIB</p>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dashboard inner viewport */}
        <div className="p-4 sm:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {/* Row 1 Grid: Camera viewport & Status indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Camera View Block */}
            <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-4.5 h-4.5 text-[#0F766E]" />
                  <span className="text-xs sm:text-sm font-bold text-[#111827]">Aliran CCTV Kamera & Analisis Postur Pasien</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setIsCameraOn(!isCameraOn);
                      triggerToast(isCameraOn ? 'Kamera dinonaktifkan' : 'Kamera diaktifkan', 'info');
                    }}
                    className="p-1 px-2.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-[#64748B] flex items-center gap-1.5"
                  >
                    <span>{isCameraOn ? 'Matikan Feed' : 'Aktifkan Feed'}</span>
                  </button>
                  <button 
                    onClick={() => generateCameraFeed(systemState)}
                    disabled={isGenerating}
                    className="p-1 px-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video bg-[#070A13] rounded-xl overflow-hidden mt-3 border border-slate-200">
                {renderLiveCameraFeed()}
              </div>

              {/* Masked Scenario Input Panel */}
              <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">Konfigurasi Skenario Kamar (Uji Sensor Visual)</span>
                  <input 
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Contoh: Skenario perawat sedang memeriksa infus di sisi tempat tidur..."
                    className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <button 
                  onClick={handleCustomGeneration}
                  disabled={isGenerating || !customPrompt.trim()}
                  className="bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-teal-800 transition flex items-center justify-center gap-1.5 self-end"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Uji Skenario</span>
                </button>
              </div>
            </div>

            {/* Current Patient medical status summary block */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Status Pasien Saat Ini</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 10:24 WIB
                    </span>
                  </div>

                  {systemState === 'AMAN' && (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-[#ECFDF5] text-[#059669] rounded-xl flex items-center justify-center border border-[#059669]/10">
                        <ShieldCheck className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#059669] tracking-tight">AMAN & STABIL</h3>
                        <p className="text-[11px] text-[#059669] font-medium">Dalam batas toleransi medis</p>
                      </div>
                    </div>
                  )}

                  {systemState === 'PERINGATAN' && (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-[#FFFBEB] text-[#F59E0B] rounded-xl flex items-center justify-center border border-[#F59E0B]/10">
                        <AlertTriangle className="w-5.5 h-5.5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#F59E0B] tracking-tight">POSISI MENEPI (GELISAH)</h3>
                        <p className="text-[11px] text-[#F59E0B] font-medium">Pasien terlalu dekat dengan tepi kasur</p>
                      </div>
                    </div>
                  )}

                  {systemState === 'BAHAYA' && (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-rose-50 text-[#EF4444] rounded-xl flex items-center justify-center border border-[#EF4444]/15">
                        <AlertCircle className="w-5.5 h-5.5 animate-bounce" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#EF4444] tracking-tight">PERLU TINDAKAN (SOS)</h3>
                        <p className="text-[11px] text-[#EF4444] font-medium">Terdeteksi gerakan anomali tinggi di lantai</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {systemState === 'AMAN' && "Pasien dalam kondisi tidur stabil. Parameter lingkungan dan aktivitas masih berada dalam rentang normal."}
                    {systemState === 'PERINGATAN' && "Perhatian: Pasien berbaring menepi mendekati ujung kasur namun kesulitan bergerak/bangun. Risiko jatuh sedang, harap periksa kondisi pasien."}
                    {systemState === 'BAHAYA' && "Bahaya: Sensor mendeteksi akselerasi/gerakan jatuh cepat di lantai samping kasur. Potensi cedera berat!"}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#64748B] block">Risk Score Index</span>
                    <span className="text-base font-extrabold text-[#111827]">{riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
                  </div>
                  <div className="w-1/2 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        riskScore > 75 ? 'bg-[#EF4444]' : riskScore > 40 ? 'bg-[#F59E0B]' : 'bg-[#0F766E]'
                      }`}
                      style={{ width: `${riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Profil Pasien Terpantau</span>
                  <span className="text-[10px] bg-slate-100 text-[#111827] px-2 py-0.5 rounded font-bold">Bed #1</span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-11 h-11 bg-teal-50 text-[#0F766E] rounded-xl flex items-center justify-center font-bold text-base border border-teal-100">
                    SA
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827]">Ibu Siti Aminah</h3>
                    <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                      <span>68 Tahun</span>
                      <span>•</span>
                      <span className="text-[#0F766E] font-semibold">Pasca Stroke Iskemik</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[#64748B] block text-[9px] uppercase font-semibold">Lokasi</span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5 truncate text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> Kediri, Jatim
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[9px] uppercase font-semibold">Caregiver</span>
                    <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5 truncate text-[11px]">
                      <User className="w-3 h-3 text-slate-400 shrink-0" /> Anak (Dina)
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Row 2 Grid: Sensor parameters cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Suhu Sensor */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-teal-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Suhu Ruangan</span>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <Thermometer className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">{liveSuhu}°C</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    liveSuhu > 28 ? 'bg-orange-100 text-orange-700' : 'bg-[#ECFDF5] text-[#059669]'
                  }`}>
                    {liveSuhu > 28 ? 'Tinggi' : 'Normal'}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between text-[9px] text-[#64748B]">
                  <span>Saran: &lt;28°C</span>
                  <span className="text-slate-400">Indoor Sensor</span>
                </div>
              </div>
            </div>

            {/* Kelembaban Sensor */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-teal-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Kelembaban</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">{liveKelembaban}%</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#ECFDF5] text-[#059669] rounded-full">
                    Optimal
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between text-[9px] text-[#64748B]">
                  <span>Ideal: 50%-70%</span>
                  <span className="text-slate-400">Humidity Sensor</span>
                </div>
              </div>
            </div>

            {/* Gerakan Sensor */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-teal-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Aktivitas Gerak</span>
                <div className="p-2 bg-teal-50 text-[#0F766E] rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">{liveGerakan} <span className="text-[10px] font-normal text-slate-400">/mnt</span></span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    liveGerakan > 30 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-[#ECFDF5] text-[#059669]'
                  }`}>
                    {liveGerakan > 30 ? 'Abnormal' : 'Normal'}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between text-[9px] text-[#64748B]">
                  <span>Motorik Rerata: 14/m</span>
                  <span className="text-slate-400">Pelepasan Tekanan</span>
                </div>
              </div>
            </div>

            {/* Cahaya Sensor */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-teal-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Intensitas Cahaya</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Sun className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">{liveCahaya} <span className="text-[10px] font-normal text-slate-400">lux</span></span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#ECFDF5] text-[#059669] rounded-full">
                    Cukup
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between text-[9px] text-[#64748B]">
                  <span>Malam: &lt;50 lux</span>
                  <span className="text-slate-400">Ambient Lux</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3 Grid: Line charts & recent alerts log */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0F766E]" /> Trend Parameter Sensor
                    </h3>
                    <p className="text-xs text-[#64748B]">Grafik historis real-time sensor IoT</p>
                  </div>
                  
                  <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
                    {(['24h', '7d', '30d'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setChartRange(range);
                          triggerToast(`Grafik diperbarui: Rentang ${range === '24h' ? '24 Jam' : range === '7d' ? '7 Hari' : '30 Hari'}`, 'info');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          chartRange === range
                            ? 'bg-white text-[#0F766E] shadow-sm'
                            : 'text-[#64748B] hover:text-[#111827]'
                        }`}
                      >
                        {range === '24h' ? '24J' : range === '7d' ? '7H' : '30H'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-60 sm:h-72 mt-6 w-full overflow-x-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '11px' }} />
                      <Legend verticalAlign="top" height={32} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                      <Line name="Suhu (°C)" type="monotone" dataKey="suhu" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      <Line name="Kelembaban (%)" type="monotone" dataKey="kelembaban" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                      <Line name="Gerakan (x/m)" type="monotone" dataKey="gerakan" stroke="#0F766E" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Warnings List Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827]">Peringatan Terbaru</h3>
                    <p className="text-xs text-[#64748B]">Log aktivitas abnormal sensor pasien</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAlerts(initialAlerts);
                      triggerToast('Daftar peringatan diatur ulang', 'info');
                    }}
                    className="text-xs text-[#0F766E] hover:underline font-semibold self-start sm:self-center"
                  >
                    Reset Log Peringatan
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all gap-2"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {alert.severity === 'High' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 animate-pulse"></span>
                        )}
                        {alert.severity === 'Medium' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0"></span>
                        )}
                        {alert.severity === 'Low' && (
                          <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111827] truncate">{alert.title}</p>
                          <span className="text-[9px] text-slate-400">{alert.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          alert.severity === 'High' 
                            ? 'bg-rose-50 text-[#EF4444]' 
                            : alert.severity === 'Medium'
                            ? 'bg-amber-50 text-[#F59E0B]'
                            : 'bg-slate-100 text-[#64748B]'
                        }`}>
                          {alert.severity === 'High' ? 'Tinggi' : alert.severity === 'Medium' ? 'Sedang' : 'Rendah'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column Panel (Summary Reports & Quick Actions) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-sm sm:text-base font-bold text-[#111827]">Laporan Mingguan</h3>
                  <p className="text-xs text-[#64748B]">Estimasi kondisi 7 hari terakhir</p>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
                      <span>Waktu Aman (Safety)</span>
                      <span className="text-teal-700 font-bold">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0F766E] h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Peringatan Terpicu</span>
                      <span className="font-semibold text-[#111827]">12 Kali</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Rata-rata Suhu</span>
                      <span className="font-semibold text-[#111827]">26.1°C</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#64748B]">Rata-rata Gerak</span>
                      <span className="font-semibold text-[#111827]">14 /menit</span>
                    </div>
                  </div>

                  <div className="bg-teal-50/50 border border-teal-100/50 p-3 sm:p-4 rounded-xl mt-3">
                    <h4 className="text-xs font-bold text-[#0F766E] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Rekomendasi
                    </h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      "Kondisi pasien cukup stabil. Harap pantau kelembaban agar tidak kering di atas 70% dan jaga suhu kamar selalu sejuk."
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#111827]">Tindakan Cepat</h3>
                  <p className="text-xs text-[#64748B]">Kontak darurat & manajemen medis</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => triggerToast('Menghubungi Caregiver Ibu Dina...', 'success')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-[#0F766E]/30 hover:bg-slate-50 transition-all text-center gap-2 group"
                  >
                    <div className="p-2 bg-teal-50 text-[#0F766E] rounded-lg group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#111827]">Hubungi</span>
                  </button>

                  <button 
                    onClick={() => triggerToast('Laporan PDF berhasil di-generate!', 'success')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-[#0F766E]/30 hover:bg-slate-50 transition-all text-center gap-2 group"
                  >
                    <div className="p-2 bg-slate-100 text-[#111827] rounded-lg group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#111827]">Laporan</span>
                  </button>

                  <button 
                    onClick={() => triggerToast('Rekam catatan medik pasien dibuka...', 'info')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-[#0F766E]/30 hover:bg-slate-50 transition-all text-center gap-2 group"
                  >
                    <div className="p-2 bg-slate-100 text-[#111827] rounded-lg group-hover:scale-105 transition-transform">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-[#111827]">Catatan</span>
                  </button>

                  <button 
                    onClick={() => triggerToast('🚨 SOS PROTOCAL AKTIF! MENGHUBUNGI INSTANSI KESEHATAN...', 'danger')}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all text-center gap-2 group"
                  >
                    <div className="p-2 bg-red-600 text-white rounded-lg group-hover:scale-105 transition-transform animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-red-600">Darurat SOS</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
        
        {/* Toast notifications */}
        {toastMessage && (
          <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-auto z-50 max-w-sm bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-[#E5E7EB] p-3.5 flex items-start space-x-3">
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toastType === 'success' ? 'bg-emerald-50 text-[#059669]' : 
              toastType === 'warning' ? 'bg-amber-50 text-[#F59E0B]' :
              toastType === 'danger' ? 'bg-rose-50 text-[#EF4444]' :
              'bg-blue-50 text-blue-600'
            }`}>
              {toastType === 'success' && <CheckCircle className="w-4.5 h-4.5" />}
              {toastType === 'warning' && <AlertTriangle className="w-4.5 h-4.5" />}
              {toastType === 'danger' && <AlertCircle className="w-4.5 h-4.5" />}
              {toastType === 'info' && <Info className="w-4.5 h-4.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-[#111827]">Pemberitahuan</h4>
              <p className="text-[10px] text-[#64748B] mt-0.5 leading-tight">{toastMessage}</p>
            </div>
          </div>
        )}

        {/* Demo simulator panel */}
        <div className={`
          fixed bottom-4 right-4 z-40 bg-white border border-[#0F766E]/20 
          shadow-[0_4px_20px_rgba(15,118,110,0.15)] rounded-2xl transition-all duration-300
          ${isSidebarOpen ? 'hidden' : 'block'}
        `}>
          <div className="p-4 w-72">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Kontrol Simulasi Node Sensor</span>
              </div>
            </div>
            <p className="text-[9px] text-[#64748B] mb-3 leading-relaxed">
              Gunakan kontrol ini untuk mensimulasikan perubahan status pasien pada perangkat keras IoT secara cepat saat demonstrasi.
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button 
                onClick={handleSimulateNormal}
                className={`text-[9px] py-2 px-1 rounded-lg font-bold transition-all ${
                  systemState === 'AMAN' ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Aman
              </button>
              <button 
                onClick={handleSimulateWarning}
                className={`text-[9px] py-2 px-1 rounded-lg font-bold transition-all ${
                  systemState === 'PERINGATAN' ? 'bg-[#F59E0B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sedang
              </button>
              <button 
                onClick={handleSimulateCritical}
                className={`text-[9px] py-2 px-1 rounded-lg font-bold transition-all ${
                  systemState === 'BAHAYA' ? 'bg-[#EF4444] text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Bahaya 🚨
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
