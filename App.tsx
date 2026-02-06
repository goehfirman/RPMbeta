
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import RPMPreview from './components/RPMPreview';
import { FormData, RPMResult } from './types';
import { generateRPM } from './services/geminiService';
import { Cpu, Zap, Clock, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [rpmResult, setRpmResult] = useState<RPMResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  // Pengatur Waktu Jam
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (data: FormData, apiKey: string) => {
    setIsLoading(true);
    try {
      const generatedContent = await generateRPM(data, apiKey);
      const fullResult: RPMResult = {
        ...data,
        ...generatedContent
      };
      setRpmResult(fullResult);
    } catch (error) {
      alert("Terjadi kesalahan saat menghubungi AI. Pastikan Kunci API Anda benar atau kuota Anda masih tersedia.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-900">
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent">
        
        {/* Header Modern Glossy */}
        <header className="sticky top-0 z-40 border-b border-purple-200/50 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.ibb.co.com/1fQ81J6v/LOGO-PEKAYON-09.jpg" 
                alt="Logo SDN Pekayon 09" 
                className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
              />
               <div>
                 <h1 className="text-xl font-tech font-bold text-slate-800 tracking-wider flex items-center gap-2">
                   GENERATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">RPM</span>
                 </h1>
                 <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-0.5">SDN Pekayon 09</p>
               </div>
            </div>

            {/* Tampilan Tanggal & Waktu */}
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 bg-white/50 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm">
               <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                  <Calendar size={14} className="text-purple-500" />
                  <span>{dateTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
               </div>
               <div className="flex items-center gap-2 pl-1">
                  <Clock size={14} className="text-purple-500" />
                  <span className="tabular-nums font-bold text-purple-900">{dateTime.toLocaleTimeString('id-ID')}</span>
               </div>
            </div>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="p-6 md:p-12 max-w-6xl mx-auto">
          {!rpmResult ? (
            <div className="animate-fade-in-up">
               {/* Bagian Hero */}
               <div className="text-center space-y-6 mb-16 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/30 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <div className="inline-flex items-center justify-center p-4 mb-2 relative group">
                    <div className="absolute inset-0 bg-purple-100 rounded-full blur-md group-hover:bg-purple-200 transition-all duration-500"></div>
                    <Cpu size={48} strokeWidth={1.5} className="text-purple-600 relative z-10" />
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-tech font-bold text-slate-900 tracking-tight leading-tight">
                    PERENCANAAN <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 animate-gradient-x neon-text-glow">PEMBELAJARAN</span>
                  </h2>
                  <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                    Hasilkan dokumen RPM terstruktur dengan integrasi kecerdasan buatan. <br/>
                    <span className="font-medium text-purple-700">Modern, Cepat, dan Presisi.</span>
                  </p>
               </div>
               
               <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <RPMPreview data={rpmResult} onReset={() => setRpmResult(null)} />
            </div>
          )}
        </main>

        {/* Kaki Halaman */}
        <footer className="mt-20 py-8 text-center no-print border-t border-purple-100 bg-white/40 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
            <Zap size={16} className="text-purple-400" />
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
               &copy; {new Date().getFullYear()} Sistem Digital SDN Pekayon 09
            </p>
            <p className="text-slate-400 text-[10px] font-medium tracking-wide">
               Pengembang: Teguh Firmansyah Apriliana <span className="text-purple-500">@goehfirmaan</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
