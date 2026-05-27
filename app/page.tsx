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
  AlertCircle
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

export default function Page() {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [systemState, setSystemState] = useState<'AMAN' | 'PERINGATAN' | 'BAHAYA'>('AMAN');
  const [riskScore, setRiskScore] = useState(18);
  const [liveSuhu, setLiveSuhu] = useState(26.4);
  const [liveKelembaban, setLiveKelembaban] = useState(58);
  const [liveGerakan, setLiveGerakan] = useState(12);
  const [liveCahaya, setLiveCahaya] = useState(120);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [chartRange, setChartRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'danger'>('info');

  const triggerToast = (msg: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (systemState === 'AMAN') {
        setLiveSuhu(prev => +(prev + (Math.random() - 0.5) * 0.2).toFixed(1));
        setLiveKelembaban(prev => Math.min(100, Math.max(0, prev + Math.floor((Math.random() - 0.5) * 3))));
        setLiveGerakan(prev => Math.min(30, Math.max(1, prev + Math.floor((Math.random() - 0.5) * 4))));
        setLiveCahaya(prev => Math.min(400, Math.max(10, prev + Math.floor((Math.random() - 0.5) * 10))));
      }
    }, 4000);
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
  };

  const handleSimulateWarning = () => {
    setSystemState('PERINGATAN');
    setRiskScore(48);
    setLiveSuhu(28.9);
    setLiveKelembaban(64);
    setLiveGerakan(5);
    setLiveCahaya(80);
    
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      title: 'Suhu ruangan terlampau tinggi (AC Mati?)',
      severity: 'Medium',
      time: 'Sekarang'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerToast('Simulasi: Suhu ruangan melebihi ambang batas normal', 'warning');
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
  };

  const getChartData = () => {
    switch(chartRange) {
      case '7d': return raw7dData;
      case '30d': return raw30dData;
      default: return raw24hData;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col md:flex-row font-sans antialiased overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E5E7EB] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E5E7EB] flex items-center space-x-3">
          <div className="w-9 h-9 bg-[#0F766E] rounded-xl flex items-center justify-center text-white shadow-sm">
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

        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/50 hidden md:block">
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

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-white border-b border-[#E5E7EB] py-4 px-4 md:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-3">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold tracking-tight text-[#111827]">Overview Monitoring</h1>
              <span className="inline-flex items-center bg-[#ECFDF5] text-[#0F766E] text-xs px-2.5 py-0.5 rounded-full font-medium border border-[#0F766E]/10 gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-ping"></span>
                Live · Simulated IoT Data
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Sistem Ambient Intelijen pendeteksi dini anomali aktivitas & lingkungan pasien stroke iskemik
            </p>
          </div>
          
          <div className="flex items-center space-x-4 self-end sm:self-auto">
            <div className="text-right">
              <p className="text-xs font-semibold text-[#111827]">Selasa, 21 Mei 2026</p>
              <p className="text-[10px] text-[#64748B]">Terakhir diperbarui: 10:24 WIB</p>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="p-4 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {/* GRID ATAS (Patient Status Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Patient Status */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Status Pasien Saat Ini</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 10:24 WIB
                </span>
              </div>

              {systemState === 'AMAN' && (
                <div className="flex items-center space-x-3.5 mb-3">
                  <div className="w-11 h-11 bg-[#ECFDF5] text-[#059669] rounded-xl flex items-center justify-center border border-[#059669]/10">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#059669] tracking-tight">AMAN & STABIL</h3>
                    <p className="text-xs text-[#059669] font-medium">Dalam batas toleransi medis</p>
                  </div>
                </div>
              )}

              {systemState === 'PERINGATAN' && (
                <div className="flex items-center space-x-3.5 mb-3">
                  <div className="w-11 h-11 bg-[#FFFBEB] text-[#F59E0B] rounded-xl flex items-center justify-center border border-[#F59E0B]/10">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#F59E0B] tracking-tight">PERINGATAN</h3>
                    <p className="text-xs text-[#F59E0B] font-medium">Butuh pengecekan lingkungan</p>
                  </div>
                </div>
              )}

              {systemState === 'BAHAYA' && (
                <div className="flex items-center space-x-3.5 mb-3">
                  <div className="w-11 h-11 bg-rose-50 text-[#EF4444] rounded-xl flex items-center justify-center border border-[#EF4444]/15">
                    <AlertCircle className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#EF4444] tracking-tight">PERLU TINDAKAN</h3>
                    <p className="text-xs text-[#EF4444] font-medium">Terdeteksi gerakan anomali tinggi</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                {systemState === 'AMAN' && "Pasien dalam kondisi stabil. Parameter lingkungan dan aktivitas masih berada dalam rentang normal."}
                {systemState === 'PERINGATAN' && "Perhatian: Parameter ruangan/suhu melebihi ambang batas nyaman. Mohon sesuaikan pendingin ruangan."}
                {systemState === 'BAHAYA' && "Bahaya: Sensor mendeteksi akselerasi/gerakan cepat tidak beraturan. Potensi pasien jatuh atau kejang!"}
              </p>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Risk Score Index</span>
                  <span className="text-lg font-extrabold text-[#111827]">{riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
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

            {/* Patient Info */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Profil Pasien Terpantau</span>
                <span className="text-[10px] bg-slate-100 text-[#111827] px-2 py-0.5 rounded font-bold">Bed #1</span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-teal-50 text-[#0F766E] rounded-xl flex items-center justify-center font-bold text-lg border border-teal-100">
                  SA
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Ibu Siti Aminah</h3>
                  <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                    <span>68 Tahun</span>
                    <span>•</span>
                    <span className="text-[#0F766E] font-medium">Pasca Stroke Iskemik</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-slate-100 pt-4">
                <div>
                  <span className="text-[#64748B] block text-[10px]">Lokasi Pemantauan</span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Kediri, Jawa Timur
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Kontak Utama Caregiver</span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Anak (Dina)
                  </span>
                </div>
              </div>
            </div>

            {/* Device Summary */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0F766E]" /> Ringkasan Performa Alat
                  </h3>
                  <span className="text-[10px] text-[#0F766E] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full">Device Active</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-[#64748B] block">Uptime</span>
                    <span className="text-sm font-extrabold text-[#059669]">99.8%</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-[#64748B] block">Signal</span>
                    <span className="text-sm font-extrabold text-[#0F766E]">Excellent</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] text-[#64748B] block">Baterai</span>
                    <span className="text-sm font-extrabold text-[#111827]">92%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-[#64748B] leading-snug flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                <Info className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  Ambient AI memproses sinyal secara lokal di node IoT sebelum diteruskan ke server visualisasi dashboard ini.
                </span>
              </div>
            </div>

          </div>

          {/* SENSOR METRIC CARDS (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Suhu */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Suhu Ruangan</span>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <Thermometer className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-[#111827] tracking-tight">{liveSuhu}°C</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    liveSuhu > 28 ? 'bg-orange-100 text-orange-700' : 'bg-[#ECFDF5] text-[#059669]'
                  }`}>
                    {liveSuhu > 28 ? 'Sedikit Tinggi' : 'Normal'}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Saran Nyaman: &lt;28°C</span>
                </div>
              </div>
            </div>

            {/* Kelembaban */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Kelembaban Ambien</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-[#111827] tracking-tight">{liveKelembaban}%</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                    Optimal
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Ideal: 50% - 70%</span>
                </div>
              </div>
            </div>

            {/* Gerakan */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Aktivitas Gerak</span>
                <div className="p-2 bg-teal-50 text-[#0F766E] rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-[#111827] tracking-tight">{liveGerakan} <span className="text-xs font-normal text-slate-400">kali/menit</span></span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    liveGerakan > 35 ? 'bg-rose-100 text-rose-700' : 'bg-[#ECFDF5] text-[#059669]'
                  }`}>
                    {liveGerakan > 35 ? 'Tinggi' : 'Normal'}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Rerata Motorik</span>
                </div>
              </div>
            </div>

            {/* Cahaya */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-[#64748B]">Intensitas Cahaya</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Sun className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-[#111827] tracking-tight">{liveCahaya} <span className="text-xs font-normal text-slate-400">lux</span></span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                    Cukup
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>Malam: &lt;50, Siang: &gt;100</span>
                </div>
              </div>
            </div>

          </div>

          {/* LOWER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart & Alerts */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Chart */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0F766E]" /> Trend Parameter 24 Jam Terakhir
                    </h3>
                    <p className="text-xs text-[#64748B]">Grafik fluktuasi historis sensor suhu, kelembaban, dan gerak motorik</p>
                  </div>
                  
                  <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                    {(['24h', '7d', '30d'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setChartRange(range);
                          triggerToast(`Grafik diperbarui: Rentang ${range === '24h' ? '24 Jam' : range === '7d' ? '7 Hari' : '30 Hari'}`, 'info');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                          chartRange === range
                            ? 'bg-white text-[#0F766E] shadow-sm'
                            : 'text-[#64748B] hover:text-[#111827]'
                        }`}
                      >
                        {range === '24h' ? '24 Jam' : range === '7d' ? '7 Hari' : '30 Hari'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                      <Line name="Suhu (°C)" type="monotone" dataKey="suhu" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 2 }} />
                      <Line name="Kelembaban (%)" type="monotone" dataKey="kelembaban" stroke="#3B82F6" strokeWidth={2} dot={{ r: 1 }} />
                      <Line name="Gerakan (x/mnt)" type="monotone" dataKey="gerakan" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Peringatan Terbaru</h3>
                    <p className="text-xs text-[#64748B]">Anomali dan peringatan dari parameter sensor ruangan</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAlerts(initialAlerts);
                      triggerToast('Daftar peringatan diset ulang ke default', 'info');
                    }}
                    className="text-xs text-[#0F766E] hover:underline font-semibold"
                  >
                    Reset Log Peringatan
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                      <div className="flex items-center space-x-3.5">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${alert.severity === 'High' ? 'bg-[#EF4444] animate-ping' : alert.severity === 'Medium' ? 'bg-[#F59E0B]' : 'bg-slate-300'}`}></span>
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">{alert.title}</p>
                          <span className="text-[10px] text-slate-400">{alert.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${alert.severity === 'High' ? 'bg-rose-50 text-[#EF4444]' : alert.severity === 'Medium' ? 'bg-amber-50 text-[#F59E0B]' : 'bg-slate-100 text-[#64748B]'}`}>{alert.severity === 'High' ? 'Tinggi' : alert.severity === 'Medium' ? 'Sedang' : 'Rendah'}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Weekly Summary & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#111827]">Laporan Mingguan</h3>
                  <p className="text-xs text-[#64748B]">Estimasi agregat kondisi 7 hari terakhir</p>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1.5">
                      <span>Waktu Kondisi Aman (Safety)</span>
                      <span className="text-[#0F766E]">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0F766E] h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Total Peringatan Terpicu</span>
                      <span className="font-bold text-[#111827]">12 Kali</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <span className="text-[#64748B]">Rata-rata Suhu Ruang</span>
                      <span className="font-bold text-[#111827]">26.1°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-[#64748B]">Aktivitas Motorik Rata-rata</span>
                      <span className="font-bold text-[#111827]">14 kali/menit</span>
                    </div>
                  </div>

                  <div className="bg-teal-50/50 border border-teal-100/50 p-4 rounded-xl mt-4">
                    <h4 className="text-xs font-bold text-[#0F766E] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Rekomendasi Caregiver
                    </h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      "Kondisi pasien cukup baik. Tetap jaga suhu ruangan di bawah 28°C dan pastikan pencahayaan cukup di malam hari untuk mencegah disorientasi kognitif pasca-stroke."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-[#111827]">Tindakan Cepat</h3>
                  <p className="text-xs text-[#64748B]">Respon darurat dan kebutuhan administrasi medik</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => triggerToast('Menghubungi Caregiver Ibu Dina...', 'success')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-teal-600/30 hover:bg-slate-50 transition-all text-center gap-2 group">
                    <div className="p-2.5 bg-teal-50 text-[#0F766E] rounded-lg group-hover:scale-110 transition-all"><Phone className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-[#111827]">Hubungi</span>
                  </button>
                  <button onClick={() => triggerToast('Draf Laporan PDF berhasil dibuat dan diunduh!', 'success')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-teal-600/30 hover:bg-slate-50 transition-all text-center gap-2 group">
                    <div className="p-2.5 bg-slate-100 text-[#111827] rounded-lg group-hover:scale-110 transition-all"><FileText className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-[#111827]">Laporan</span>
                  </button>
                  <button onClick={() => triggerToast('Buka formulir rekam catatan kesehatan pasien...', 'info')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-teal-600/30 hover:bg-slate-50 transition-all text-center gap-2 group">
                    <div className="p-2.5 bg-slate-100 text-[#111827] rounded-lg group-hover:scale-110 transition-all"><Activity className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-[#111827]">Catatan</span>
                  </button>
                  <button onClick={() => triggerToast('🚨 SOS PROTOCAL AKTIF!', 'danger')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all text-center gap-2 group">
                    <div className="p-2.5 bg-red-600 text-white rounded-lg group-hover:scale-110 transition-all animate-pulse"><AlertTriangle className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-red-600">Darurat SOS</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* TOAST SYSTEM */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E5E7EB] p-4 flex items-start space-x-3.5">
            <div className={`p-2 rounded-xl shrink-0 ${toastType === 'success' ? 'bg-emerald-50 text-[#059669]' : toastType === 'warning' ? 'bg-amber-50 text-[#F59E0B]' : toastType === 'danger' ? 'bg-rose-50 text-[#EF4444]' : 'bg-blue-50 text-blue-600'}`}>
              {toastType === 'success' && <CheckCircle className="w-5 h-5" />}
              {toastType === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {toastType === 'danger' && <AlertCircle className="w-5 h-5" />}
              {toastType === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#111827]">Pemberitahuan Sistem</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
          </div>
        )}

        {/* SIMULATOR */}
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-[#0F766E]/20 shadow-[0_4px_20px_rgba(15,118,110,0.15)] rounded-2xl p-4 w-72">
          <div className="flex items-center space-x-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">
            <Zap className="w-4 h-4" />
            <span>Simulator Demo GEMASTIK</span>
          </div>
          <p className="text-[10px] text-[#64748B] mb-3 leading-relaxed">
            Klik tombol di bawah ini untuk menunjukkan reaksi real-time sistem saat pitch di depan dewan juri.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleSimulateNormal} className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-all duration-200 ${systemState === 'AMAN' ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Aman</button>
            <button onClick={handleSimulateWarning} className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-all duration-200 ${systemState === 'PERINGATAN' ? 'bg-[#F59E0B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Suhu Naik</button>
            <button onClick={handleSimulateCritical} className={`text-[10px] py-1.5 px-2 rounded-lg font-bold transition-all duration-200 ${systemState === 'BAHAYA' ? 'bg-[#EF4444] text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Jatuh</button>
          </div>
        </div>

      </main>
    </div>
  );
}
