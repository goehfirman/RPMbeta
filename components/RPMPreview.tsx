
import React, { useRef, useState } from 'react';
import { RPMResult } from '../types';
import { Copy, Download, ArrowLeft, Settings2, Eye, EyeOff, ChevronDown, MessageCircle } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface RPMPreviewProps {
  data: RPMResult;
  onReset: () => void;
}

const RPMPreview: React.FC<RPMPreviewProps> = ({ data, onReset }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State untuk pengaturan PDF
  const [showSettings, setShowSettings] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [margins, setMargins] = useState({
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  });

  const handleCopyToDocs = async () => {
    if (!contentRef.current) return;
    try {
      const blob = new Blob([contentRef.current.innerHTML], { type: 'text/html' });
      // @ts-ignore
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      // @ts-ignore
      await navigator.clipboard.write([clipboardItem]);
      const confirm = window.confirm("Konten RPM telah disalin ke Clipboard! \n\nSekarang kami akan membuka Google Docs baru. \nSilakan tekan 'Ctrl+V' (Tempel) di halaman Google Docs untuk melihat hasilnya.");
      if(confirm) {
        window.open('https://docs.google.com/document/create', '_blank');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyalin otomatis. Silakan seleksi manual dan salin.');
    }
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    // Konfigurasi dinamis berdasarkan input user
    const opt = {
      margin: [margins.top, margins.left, margins.bottom, margins.right], 
      filename: `RPM_${data.subject}_Kelas${data.classLevel}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      }, 
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as const 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    };

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100); 
          const leftText = `RPM SDN Pekayon 09 | ${data.subject}`;
          pdf.text(leftText, margins.left, pageHeight - 5); 
          const rightText = `Halaman ${i} dari ${totalPages}`;
          const textWidth = pdf.getStringUnitWidth(rightText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          pdf.text(rightText, pageWidth - margins.right - textWidth, pageHeight - 5); 
        }
        pdf.save(opt.filename);
      });
  };

  const TARGET_TEACHER = "Teguh Firmansyah Apriliana, S.Pd";
  const SIGNATURE_URL = "https://i.ibb.co.com/KctJSrRC/ttd-gue.png";
  const shouldShowSignature = data.teacherName.trim() === TARGET_TEACHER;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Tombol Aksi & Pengaturan */}
      <div className="sticky top-4 z-50 flex flex-col gap-3 bg-white/80 backdrop-blur-xl border border-purple-200 p-4 rounded-xl shadow-lg mb-8 no-print">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <button onClick={onReset} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold uppercase text-[10px] tracking-wider transition">
            <ArrowLeft size={14} /> Ubah Data
          </button>
          
          <div className="flex flex-wrap gap-2">
            {/* Tombol Pengaturan */}
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wide transition shadow-sm ${showSettings ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings2 size={14} />
              Pengaturan PDF
              <ChevronDown size={12} className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            <button onClick={handleCopyToDocs} className="flex items-center gap-2 bg-white border border-purple-200 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wide text-purple-700 shadow-sm transition">
              <Copy size={14} />
              <span className="hidden sm:inline">Salin & Buka G-Docs</span>
            </button>
            
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wide shadow-md transition group">
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Panel Pengaturan Detail */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
             <div className="sm:col-span-4 flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atur Margin Halaman (mm)</span>
                <button 
                  onClick={() => setShowGuides(!showGuides)}
                  className={`flex items-center gap-2 text-[9px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${showGuides ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                >
                  {showGuides ? <Eye size={12} /> : <EyeOff size={12} />}
                  {showGuides ? 'Sembunyikan Panduan' : 'Tampilkan Panduan'}
                </button>
             </div>
             
             {['top', 'bottom', 'left', 'right'].map((dir) => (
               <div key={dir} className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">{dir === 'top' ? 'Atas' : dir === 'bottom' ? 'Bawah' : dir === 'left' ? 'Kiri' : 'Kanan'}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={margins[dir as keyof typeof margins]} 
                      onChange={(e) => setMargins({...margins, [dir]: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:border-purple-400 outline-none"
                    />
                    <span className="text-[9px] text-slate-400 font-bold">mm</span>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Konten Dokumen */}
      <div 
        id="rpm-content" 
        ref={contentRef} 
        className="bg-white shadow-2xl min-h-screen border border-slate-200 text-black relative"
        style={{
          paddingTop: showGuides ? 0 : `${margins.top}mm`,
          paddingBottom: showGuides ? 0 : `${margins.bottom}mm`,
          paddingLeft: showGuides ? 0 : `${margins.left}mm`,
          paddingRight: showGuides ? 0 : `${margins.right}mm`,
          width: '210mm', 
          margin: '0 auto',
          boxSizing: 'content-box' 
        }}
      >
        {/* Panduan Visual Margin */}
        {showGuides && (
          <div 
            className="absolute inset-0 pointer-events-none no-print border-purple-400/30 border-dashed"
            style={{
              borderTopWidth: `${margins.top}mm`,
              borderBottomWidth: `${margins.bottom}mm`,
              borderLeftWidth: `${margins.left}mm`,
              borderRightWidth: `${margins.right}mm`,
              borderStyle: 'solid',
              boxSizing: 'border-box'
            }}
          >
            <div className="w-full h-full border border-purple-500/20 flex items-center justify-center">
               <span className="text-[10px] text-purple-400 font-tech font-bold opacity-30 tracking-widest uppercase">Area Cetak Aman</span>
            </div>
          </div>
        )}

        <style>
            {`
              #rpm-content { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; color: #000; box-sizing: border-box; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 2px solid #000; table-layout: fixed; word-wrap: break-word; page-break-inside: avoid; }
              th { background-color: #000; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 8pt; padding: 10px; text-align: left; border: 1px solid #000; }
              td { padding: 8px; border: 1px solid #000; vertical-align: top; font-size: 9pt; }
              .section-header { display: flex; align-items: center; gap: 10px; margin-top: 20px; margin-bottom: 12px; border-bottom: 3px solid #000; padding-bottom: 5px; page-break-after: avoid; }
              .section-number { background-color: #000; color: #fff; font-weight: 800; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 4px; flex-shrink: 0; font-size: 9pt; }
              .section-title-text { font-weight: 800; font-size: 11pt; text-transform: uppercase; }
              .label-cell { font-weight: 700; background-color: #f1f5f9; width: 25%; }
              .header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 4px solid #000; padding-bottom: 15px; }
              .rubric-table th { font-size: 7pt; text-align: center; }
              .rubric-table td { font-size: 8pt; }
              ul, ol { margin: 0; padding-left: 1.2rem; }
              li { margin-bottom: 2px; }
            `}
        </style>

        <div className="header-container">
            <div style={{ width: '15%' }}><img src="https://i.ibb.co.com/1fQ81J6v/LOGO-PEKAYON-09.jpg" crossOrigin="anonymous" style={{ height: '65px' }} /></div>
            <div style={{ width: '70%', textAlign: 'center' }}>
                <h1 style={{ fontWeight: '900', fontSize: '14pt', margin: 0 }}>RENCANA PEMBELAJARAN MENDALAM (RPM)</h1>
                <p style={{ fontSize: '10pt', margin: '3px 0', fontWeight: 'bold' }}>SDN PEKAYON 09 JAKARTA TIMUR</p>
                <p style={{ fontSize: '8pt', margin: 0 }}>Jl. Pendidikan Rt 04 Rw 09 Kel. Pekayon Kec. Pasar Rebo</p>
            </div>
            <div style={{ width: '15%', textAlign: 'right' }}><img src="https://i.ibb.co.com/fz9ttjq6/Logo-of-Ministry-of-Education-and-Culture-of-Republic-of-Indonesia-svg.png" crossOrigin="anonymous" style={{ height: '65px' }} /></div>
        </div>

        <div className="section-header"><div className="section-number">1</div><div className="section-title-text">Identitas</div></div>
        <table><tbody>
            <tr><td className="label-cell">Satuan Pendidikan</td><td>SDN Pekayon 09</td><td className="label-cell">Mata Pelajaran</td><td>{data.subject}</td></tr>
            <tr><td className="label-cell">Kelas / Semester</td><td>{data.classLevel} / {data.semester}</td><td className="label-cell">Alokasi Waktu</td><td>{data.duration} ({data.meetingCount} Pertemuan)</td></tr>
        </tbody></table>

        <div className="section-header"><div className="section-number">2</div><div className="section-title-text">Identifikasi</div></div>
        <table><tbody>
            <tr><td className="label-cell">Karakteristik Siswa</td><td dangerouslySetInnerHTML={{ __html: data.studentCharacteristics }}></td></tr>
            <tr><td className="label-cell">Materi Pokok</td><td style={{ whiteSpace: 'pre-line' }}>{data.materi}</td></tr>
            <tr><td className="label-cell">Profil Lulusan</td><td>{data.dimensions.join(", ")}</td></tr>
        </tbody></table>

        <div className="section-header"><div className="section-number">3</div><div className="section-title-text">Desain Pembelajaran</div></div>
        <table><tbody>
            <tr><td className="label-cell">CP</td><td>{data.cp}</td></tr>
            <tr><td className="label-cell">TP</td><td style={{ whiteSpace: 'pre-line' }}>{data.tp}</td></tr>
            <tr><td className="label-cell">Lintas Disiplin</td><td dangerouslySetInnerHTML={{ __html: data.crossDisciplinary }}></td></tr>
            <tr><td className="label-cell">Pedagogi</td><td>{data.meetings.map(m => `P${m.meetingNumber}: ${m.pedagogy}`).join(" | ")}</td></tr>
        </tbody></table>

        <div className="section-header"><div className="section-number">4</div><div className="section-title-text">Pengalaman Belajar</div></div>
        <table>
          <thead><tr><th style={{ width: '25%' }}>Tahapan</th><th>Deskripsi Kegiatan</th></tr></thead>
          <tbody>
            <tr><td className="label-cell">Awal (Memahami)</td><td dangerouslySetInnerHTML={{ __html: data.learningExperiences.memahami }}></td></tr>
            <tr><td className="label-cell">Inti (Mengaplikasi)</td><td dangerouslySetInnerHTML={{ __html: data.learningExperiences.mengaplikasi }}></td></tr>
            <tr><td className="label-cell">Penutup (Refleksi)</td><td dangerouslySetInnerHTML={{ __html: data.learningExperiences.refleksi }}></td></tr>
          </tbody>
        </table>

        <div className="section-header"><div className="section-number">5</div><div className="section-title-text">Asesmen</div></div>
        <table>
          <thead><tr><th>Asesmen Awal</th><th>Asesmen Proses</th><th>Asesmen Akhir</th></tr></thead>
          <tbody><tr>
            <td dangerouslySetInnerHTML={{ __html: data.assessments.initial }}></td>
            <td dangerouslySetInnerHTML={{ __html: data.assessments.process }}></td>
            <td dangerouslySetInnerHTML={{ __html: data.assessments.final }}></td>
          </tr></tbody>
        </table>

        <div className="section-header"><div className="section-number">6</div><div className="section-title-text">Rubrik Penilaian</div></div>
        <p style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '8px' }}>{data.rubric.title}</p>
        <table className="rubric-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Aspek</th>
              <th>Sangat Baik (4)</th>
              <th>Baik (3)</th>
              <th>Cukup (2)</th>
              <th>Perlu Bimbingan (1)</th>
            </tr>
          </thead>
          <tbody>
            {data.rubric.rows.map((row, idx) => (
              <tr key={idx}>
                <td className="label-cell" style={{ textAlign: 'center', fontSize: '8pt' }}>{row.aspect}</td>
                <td>{row.score4}</td>
                <td>{row.score3}</td>
                <td>{row.score2}</td>
                <td>{row.score1}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="signature-box" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', pageBreakInside: 'avoid' }}>
            <div style={{ textAlign: 'center', width: '40%' }}>
                <p style={{ margin: 0 }}>Mengetahui,</p><p style={{ margin: 0 }}>Kepala SDN Pekayon 09</p><div style={{ height: '100px' }}></div>
                <p style={{ margin: 0 }}><strong><u>{data.principalName}</u></strong></p><p style={{ margin: 0 }}>NIP. {data.principalNIP}</p>
            </div>
            <div style={{ textAlign: 'center', width: '40%' }}>
                <p style={{ margin: 0 }}>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p style={{ margin: 0 }}>Guru Kelas / Mapel</p>
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {shouldShowSignature && <img src={SIGNATURE_URL} crossOrigin="anonymous" style={{ height: '90px' }} />}
                </div>
                <p style={{ margin: 0 }}><strong><u>{data.teacherName}</u></strong></p><p style={{ margin: 0 }}>NIP. {data.teacherNIP}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RPMPreview;
