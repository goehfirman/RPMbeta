
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import RPMPreview from './components/RPMPreview';
import { FormData, RPMResult } from './types';
import { generateRPM } from './services/geminiService';
import { Cpu, Zap, Clock, Calendar, Lock, ArrowRight } from 'lucide-react';

const WA_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/3840px-WhatsApp.svg.png";

const App: React.FC = () => {
  const [rpmResult, setRpmResult] = useState<RPMResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  
  // State Autentikasi
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Pengatur Waktu Jam
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'teguhganteng') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

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

  // Tampilan Login / Proteksi Password
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white p-8 rounded-3xl shadow-2xl shadow-purple-200/50 animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500"></div>
          
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex p-4 bg-purple-50 rounded-2xl border border-purple-100 text-purple-600 mb-2">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-tech font-bold text-slate-800 tracking-tight">AKSES SISTEM RPM</h1>
            <p className="text-slate-500 text-sm">Silakan masukkan password untuk melanjutkan ke Generator RPM SDN Pekayon 09.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password..." 
                className={`w-full px-5 py-4 bg-white border ${authError ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'} rounded-xl text-center font-bold tracking-[0.2em] outline-none transition-all duration-300 shadow-sm`}
              />
              {authError && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase text-center animate-bounce">Password Salah!</p>}
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
            >
              Buka Akses <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Butuh Bantuan Password?</p>
            <a 
              href="https://wa.me/6283816186000" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <img src={WA_LOGO_URL} alt="WhatsApp Logo" className="w-5 h-5 object-contain" />
              Hubungi Whatsapp
            </a>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
            <Zap size={16} className="text-purple-400" />
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
               &copy; {new Date().getFullYear()} Sistem Digital SDN Pekayon 09
            </p>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/6283816186000" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#25D366] font-bold text-[10px] uppercase tracking-wider hover:underline">
                <img src={WA_LOGO_URL} alt="WhatsApp Logo" className="w-3.5 h-3.5 object-contain" /> 
                Hubungi Whatsapp
              </a>
            </div>
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
