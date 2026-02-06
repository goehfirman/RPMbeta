
import React, { useRef } from 'react';
import { RPMResult } from '../types';
import { Copy, Download, ArrowLeft } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface RPMPreviewProps {
  data: RPMResult;
  onReset: () => void;
}

const RPMPreview: React.FC<RPMPreviewProps> = ({ data, onReset }) => {
  const contentRef = useRef<HTMLDivElement>(null);

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
    const opt = {
      margin: 10, 
      filename: `RPM_${data.subject}_Kelas${data.classLevel}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
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
          pdf.setTextColor(0, 0, 0); 
          const leftText = `RPM Kelas ${data.classLevel} | ${data.subject}`;
          pdf.text(leftText, 10, pageHeight - 5); 
          const rightText = `Hal. ${i} dari ${totalPages}`;
          const textWidth = pdf.getStringUnitWidth(rightText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          pdf.text(rightText, pageWidth - 10 - textWidth, pageHeight - 5); 
        }
        pdf.save(opt.filename);
      });
  };

  const TARGET_TEACHER = "Teguh Firmansyah Apriliana, S.Pd";
  const SIGNATURE_URL = "https://i.ibb.co.com/KctJSrRC/ttd-gue.png";
  const shouldShowSignature = data.teacherName.trim() === TARGET_TEACHER;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="sticky top-4 z-50 flex flex-wrap gap-3 justify-between items-center bg-white/80 backdrop-blur-xl border border-purple-200 p-4 rounded-xl shadow-lg mb-8 no-print">
        <button onClick={onReset} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold uppercase text-xs tracking-wider transition">
          <ArrowLeft size={16} /> Ubah Data
        </button>
        <div className="flex gap-3">
          <button onClick={handleCopyToDocs} className="flex items-center gap-2 bg-white border border-purple-200 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide text-purple-700 shadow-sm transition">
            <Copy size={16} />
            <span className="hidden sm:inline">Salin & Buka G-Docs</span>
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md transition">
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      <div id="rpm-content" ref={contentRef} className="bg-white p-8 md:p-12 shadow-2xl min-h-screen border border-slate-200 text-black">
        <style>
            {`
              #rpm-content { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; color: #000; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 2px solid #000; }
              th { background-color: #000; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 9pt; padding: 10px; text-align: left; }
              td { padding: 10px; border-bottom: 1px solid #000; vertical-align: top; font-size: 10pt; }
              .section-header { display: flex; align-items: center; gap: 10px; margin-top: 25px; margin-bottom: 15px; border-bottom: 3px solid #000; padding-bottom: 5px; }
              .section-number { background-color: #000; color: #fff; font-weight: 800; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
              .section-title-text { font-weight: 800; font-size: 12pt; text-transform: uppercase; }
              .label-cell { font-weight: 700; background-color: #f1f5f9; width: 25%; border-right: 1px solid #000; }
              .header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 4px solid #000; padding-bottom: 20px; }
            `}
        </style>

        <div className="header-container">
            <div style={{ width: '15%' }}><img src="https://i.ibb.co.com/1fQ81J6v/LOGO-PEKAYON-09.jpg" crossOrigin="anonymous" style={{ height: '70px' }} /></div>
            <div style={{ width: '70%', textAlign: 'center' }}>
                <h1 style={{ fontWeight: '900', fontSize: '15pt', margin: 0 }}>RENCANA PEMBELAJARAN MENDALAM (RPM)</h1>
                <p style={{ fontSize: '10pt', margin: '5px 0' }}>SDN PEKAYON 09 JAKARTA TIMUR</p>
                <p style={{ fontSize: '8pt', margin: 0 }}>Jl. Pendidikan Rt 04 Rw 09 Kel. Pekayon Kec. Pasar Rebo</p>
            </div>
            <div style={{ width: '15%', textAlign: 'right' }}><img src="https://i.ibb.co.com/fz9ttjq6/Logo-of-Ministry-of-Education-and-Culture-of-Republic-of-Indonesia-svg.png" crossOrigin="anonymous" style={{ height: '70px' }} /></div>
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
          <thead><tr><th>Tahapan</th><th>Deskripsi Kegiatan</th></tr></thead>
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

        <div className="signature-box" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
            <div style={{ textAlign: 'center', width: '40%' }}>
                <p>Mengetahui,</p><p>Kepala SDN Pekayon 09</p><div style={{ height: '120px' }}></div>
                <p><strong><u>{data.principalName}</u></strong></p><p>NIP. {data.principalNIP}</p>
            </div>
            <div style={{ textAlign: 'center', width: '40%' }}>
                <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>Guru Kelas / Mapel</p>
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {shouldShowSignature && <img src={SIGNATURE_URL} crossOrigin="anonymous" style={{ height: '100px' }} />}
                </div>
                <p><strong><u>{data.teacherName}</u></strong></p><p>NIP. {data.teacherNIP}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RPMPreview;
