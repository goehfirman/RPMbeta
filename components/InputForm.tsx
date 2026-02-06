
import React, { useState, useEffect } from 'react';
import { 
  ClassLevel, Semester, Subject, PedagogicalPractice, 
  GraduateDimension, FormData
} from '../types';
import { getFieldSuggestions } from '../services/geminiService';
import { Loader2, Check, X, ChevronDown, Sparkles, Eye, EyeOff, BookOpen, User, Calendar, BrainCircuit, Activity } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: FormData, apiKey: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    teacherName: '',
    teacherNIP: '',
    principalName: 'Veria Wulandari, S.Pd', 
    principalNIP: '198102012008012028',
    classLevel: ClassLevel.Kelas1,
    semester: Semester.Ganjil,
    subject: Subject.BahasaIndonesia,
    cp: '',
    tp: '',
    materi: '',
    meetingCount: 1,
    duration: '2 x 35 menit',
    meetings: [{ meetingNumber: 1, pedagogy: PedagogicalPractice.InkuiriDiscovery }],
    dimensions: []
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'cp' | 'tp' | 'materi' | null>(null);
  const [loadingField, setLoadingField] = useState<'cp' | 'tp' | 'materi' | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    setFormData(prev => {
      const currentCount = prev.meetings.length;
      const targetCount = prev.meetingCount;
      if (currentCount === targetCount) return prev;
      let newMeetings = [...prev.meetings];
      if (targetCount > currentCount) {
        for (let i = currentCount + 1; i <= targetCount; i++) {
          newMeetings.push({ meetingNumber: i, pedagogy: PedagogicalPractice.InkuiriDiscovery });
        }
      } else {
        newMeetings = newMeetings.slice(0, targetCount);
      }
      return { ...prev, meetings: newMeetings };
    });
  }, [formData.meetingCount]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (dim: GraduateDimension) => {
    setFormData(prev => {
      const exists = prev.dimensions.includes(dim);
      if (exists) {
        return { ...prev, dimensions: prev.dimensions.filter(d => d !== d) };
      } else {
        return { ...prev, dimensions: [...prev.dimensions, dim] };
      }
    });
  };

  const handlePedagogyChange = (index: number, value: PedagogicalPractice) => {
    const newMeetings = [...formData.meetings];
    newMeetings[index].pedagogy = value;
    setFormData(prev => ({ ...prev, meetings: newMeetings }));
  };

  const handleGetSuggestion = async (field: 'cp' | 'tp' | 'materi') => {
    if (!apiKey) {
      alert("Mohon isi Google API Key terlebih dahulu di bagian atas formulir.");
      return;
    }
    setLoadingField(field);
    setSuggestions([]);
    setSelectedSuggestions([]);
    setActiveField(null);
    let context = field === 'tp' ? formData.cp : (field === 'materi' ? `CP: ${formData.cp}. TP: ${formData.tp}` : "");
    const opts = await getFieldSuggestions(field, formData.subject, formData.classLevel, apiKey, context);
    setSuggestions(opts);
    setActiveField(field);
    setLoadingField(null);
  };

  const handleSelectSuggestion = (val: string) => {
    if (activeField) {
        setFormData(prev => ({ ...prev, [activeField]: val }));
        setActiveField(null);
        setSuggestions([]);
        setSelectedSuggestions([]);
    }
  };

  const handleToggleSuggestion = (val: string) => {
    setSelectedSuggestions(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  };

  const handleApplySelected = () => {
    if (activeField && selectedSuggestions.length > 0) {
      const joinedValue = selectedSuggestions.join('\n');
      setFormData(prev => ({ ...prev, [activeField]: joinedValue }));
      setActiveField(null);
      setSuggestions([]);
      setSelectedSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      alert("Mohon isi Google API Key terlebih dahulu.");
      return;
    }
    onSubmit(formData, apiKey);
  };

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="mb-8 mt-12 pb-4 border-b border-purple-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 shadow-sm text-purple-600">
          <Icon size={18} />
        </div>
        <h3 className="text-lg font-tech font-bold text-slate-800 tracking-wider uppercase">{title}</h3>
      </div>
      <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-transparent rounded-full"></div>
    </div>
  );

  const InputLabel = ({ label, required }: { label: string, required?: boolean }) => (
    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
      {label} {required && <span className="text-purple-600">*</span>}
    </label>
  );

  const InputClasses = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] outline-none transition-all duration-300 shadow-sm";
  const SelectClasses = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none appearance-none cursor-pointer transition-all duration-300 hover:border-purple-300 shadow-sm";

  const renderSuggestionInput = (field: 'cp' | 'tp' | 'materi', label: string, rows: number, placeholder: string) => {
    const isMultiSelect = field === 'tp' || field === 'materi';
    return (
      <div className="relative group space-y-2 p-6 bg-white/50 border border-purple-100 rounded-xl hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
               <InputLabel label={label} required />
               <button 
                  type="button" 
                  onClick={() => handleGetSuggestion(field)}
                  disabled={loadingField === field}
                  className="px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-sm"
               >
                  {loadingField === field ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {loadingField === field ? 'Memproses...' : 'Saran AI'}
               </button>
          </div>
          <div className="relative">
            <textarea 
                required 
                name={field} 
                value={formData[field]} 
                onChange={handleChange} 
                rows={rows} 
                className={`${InputClasses} resize-none leading-relaxed bg-white/80`}
                placeholder={placeholder} 
            />
          </div>
          {activeField === field && suggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 w-full bg-white border border-purple-200 shadow-2xl rounded-xl mt-2 overflow-hidden animate-fade-in-up backdrop-blur-xl ring-1 ring-purple-100">
                   <div className="px-4 py-3 bg-purple-50/50 border-b border-purple-100 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} />
                        {isMultiSelect ? 'Pilih Beberapa' : 'Pilih Satu'}
                      </span>
                      <button type="button" onClick={() => setActiveField(null)} className="text-slate-400 hover:text-purple-600 transition">
                          <X size={16} />
                      </button>
                   </div>
                   <ul className="max-h-72 overflow-y-auto">
                      {suggestions.map((s, idx) => {
                          const isSelected = selectedSuggestions.includes(s);
                          return (
                            <li 
                                key={idx} 
                                onClick={() => isMultiSelect ? handleToggleSuggestion(s) : handleSelectSuggestion(s)} 
                                className={`px-5 py-4 text-sm border-b border-slate-50 last:border-0 cursor-pointer transition-all flex items-start gap-4 leading-relaxed ${isSelected ? 'bg-purple-50 text-purple-800 font-medium' : 'hover:bg-slate-50 text-slate-600 hover:text-purple-600'}`}
                            >
                                {isMultiSelect && (
                                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-300 bg-white'}`}>
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                  </div>
                                )}
                                <span className="flex-1">{s}</span>
                            </li>
                          );
                      })}
                   </ul>
                   {isMultiSelect && (
                     <div className="p-4 border-t border-purple-100 bg-purple-50/30">
                       <button
                         type="button"
                         onClick={handleApplySelected}
                         disabled={selectedSuggestions.length === 0}
                         className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg disabled:opacity-50"
                       >
                         Konfirmasi {selectedSuggestions.length} Pilihan
                       </button>
                     </div>
                   )}
              </div>
          )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 md:p-12 max-w-5xl mx-auto rounded-2xl shadow-xl shadow-purple-500/5 relative overflow-hidden ring-1 ring-purple-100">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
      
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm mb-10 relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          <div className="flex-1">
             <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-2 block flex items-center gap-2">
               Otorisasi Sistem: Gemini API Key
             </label>
             <div className="relative">
               <input 
                 type={showApiKey ? "text" : "password"} 
                 value={apiKey} 
                 onChange={handleApiKeyChange}
                 placeholder="Tempelkan Kunci API Di Sini..." 
                 className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-lg px-4 py-3 text-sm font-mono text-slate-700 outline-none"
               />
             </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="text-slate-400 hover:text-purple-600">
               {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
             <div className="h-8 w-px bg-slate-200"></div>
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white border border-purple-200 text-purple-600 text-xs font-bold rounded-lg hover:bg-purple-50 uppercase tracking-wide">
               Buat Kunci
             </a>
          </div>
        </div>
      </div>

      <section>
        <SectionTitle title="1. Informasi Pendidik" icon={User} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="opacity-60 pointer-events-none grayscale">
            <InputLabel label="Nama Satuan Pendidikan" />
            <input type="text" value="SDN Pekayon 09" disabled className={InputClasses} />
          </div>
          <div className="hidden md:block"></div>
          <div>
            <InputLabel label="Nama Guru" required />
            <input required name="teacherName" value={formData.teacherName} onChange={handleChange} className={InputClasses} placeholder="Nama Lengkap & Gelar" />
          </div>
          <div>
            <InputLabel label="NIP Guru" required />
            <input required name="teacherNIP" value={formData.teacherNIP} onChange={handleChange} className={InputClasses} placeholder="NIP tanpa spasi" />
          </div>
          <div>
            <InputLabel label="Nama Kepala Sekolah" />
            <input name="principalName" value={formData.principalName} onChange={handleChange} className={InputClasses} />
          </div>
          <div>
            <InputLabel label="NIP Kepala Sekolah" />
            <input name="principalNIP" value={formData.principalNIP} onChange={handleChange} className={InputClasses} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="2. Kurikulum & Materi" icon={BookOpen} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative">
            <InputLabel label="Kelas" />
            <select name="classLevel" value={formData.classLevel} onChange={handleChange} className={SelectClasses}>
              {Object.values(ClassLevel).map(c => <option key={c} value={c}>Kelas {c}</option>)}
            </select>
          </div>
          <div className="relative">
            <InputLabel label="Semester" />
            <select name="semester" value={formData.semester} onChange={handleChange} className={SelectClasses}>
              {Object.values(Semester).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative">
            <InputLabel label="Mata Pelajaran" />
            <select name="subject" value={formData.subject} onChange={handleChange} className={SelectClasses}>
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-6">
             {renderSuggestionInput('cp', 'Capaian Pembelajaran (CP)', 3, 'Tulis CP atau gunakan Saran AI...')}
             {renderSuggestionInput('tp', 'Tujuan Pembelajaran (TP)', 2, 'Tulis TP atau gunakan Saran AI...')}
             {renderSuggestionInput('materi', 'Materi Pelajaran', 2, 'Tulis Materi atau gunakan Saran AI...')}
        </div>
      </section>

      <section>
        <SectionTitle title="3. Strategi Pertemuan" icon={Calendar} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="relative">
            <InputLabel label="Jumlah Pertemuan" />
            <select name="meetingCount" value={formData.meetingCount} onChange={(e) => setFormData({...formData, meetingCount: parseInt(e.target.value)})} className={SelectClasses}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Pertemuan</option>)}
            </select>
           </div>
           <div>
            <InputLabel label="Durasi Total" />
            <input name="duration" value={formData.duration} onChange={handleChange} className={InputClasses} placeholder="Contoh: 2 x 35 menit" />
           </div>
        </div>
        <div className="space-y-4">
           <InputLabel label="Model Pembelajaran per Pertemuan" />
           {formData.meetings.map((meeting, idx) => (
             <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-purple-100 bg-white shadow-sm">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest w-28">Pertemuan {meeting.meetingNumber}</span>
                <div className="relative flex-1">
                  <select 
                    value={meeting.pedagogy} 
                    onChange={(e) => handlePedagogyChange(idx, e.target.value as PedagogicalPractice)}
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  >
                    {Object.values(PedagogicalPractice).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
             </div>
           ))}
        </div>
      </section>

      <section>
        <SectionTitle title="4. Profil Lulusan" icon={BrainCircuit} />
        <div className="bg-white/50 p-6 rounded-xl border border-purple-100">
           <InputLabel label="Pilih Dimensi yang Relevan" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mt-4">
             {Object.values(GraduateDimension).map((dim) => (
               <label key={dim} className="flex items-center gap-3 cursor-pointer group hover:bg-purple-50 p-2 rounded transition-colors">
                  <input type="checkbox" checked={formData.dimensions.includes(dim)} onChange={() => handleDimensionChange(dim)} className="peer h-5 w-5 rounded border border-slate-300" />
                  <span className={`text-sm ${formData.dimensions.includes(dim) ? 'text-purple-700 font-medium' : 'text-slate-600'}`}>
                    {dim}
                  </span>
               </label>
             ))}
           </div>
        </div>
      </section>

      <div className="pt-8">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full border-2 border-purple-500 hover:bg-purple-50 text-purple-600 font-tech font-bold text-base uppercase tracking-widest py-5 rounded-lg shadow-lg disabled:opacity-50 flex justify-center items-center gap-4 transition-all group"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Memproses Data...</span>
            </>
          ) : (
            <>
              <span>Mulai Buat RPM</span>
              <Sparkles className="group-hover:scale-125 transition-transform" size={20} fill="currentColor" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
