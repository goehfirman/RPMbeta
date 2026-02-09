
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, GeneratedContent, Subject, ClassLevel } from "../types";
import { CP_REF } from "../data/cpReference";

// Helper untuk membuat instansi AI secara dinamis
const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

const generatedContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    studentCharacteristics: { type: Type.STRING, description: "Deskripsi karakteristik siswa berdasarkan usia/kelas. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    crossDisciplinary: { type: Type.STRING, description: "Kaitan dengan mata pelajaran lain. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    topics: { type: Type.STRING, description: "Topik pembelajaran spesifik yang diturunkan dari materi. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    partnerships: { type: Type.STRING, description: "Kemitraan pembelajaran (orang tua, pakar, komunitas). Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    environment: { type: Type.STRING, description: "Pengaturan lingkungan belajar. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    digitalTools: { type: Type.STRING, description: "Rekomendasi alat digital dan cara menggunakannya. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
    learningExperiences: {
      type: Type.OBJECT,
      properties: {
        memahami: { type: Type.STRING, description: "Kegiatan untuk fase 'Memahami' (Pembukaan). Kembalikan sebagai Daftar Terurut HTML (<ol><li>...</li></ol>)." },
        mengaplikasi: { type: Type.STRING, description: "Kegiatan untuk fase 'Mengaplikasi' (Inti) yang sesuai dengan sintaks pedagogi. Kembalikan sebagai Daftar Terurut HTML (<ol><li>...</li></ol>)." },
        refleksi: { type: Type.STRING, description: "Kegiatan untuk fase 'Refleksi' (Penutup). Kembalikan sebagai Daftar Terurut HTML (<ol><li>...</li></ol>)." },
      },
      required: ["memahami", "mengaplikasi", "refleksi"]
    },
    assessments: {
      type: Type.OBJECT,
      properties: {
        initial: { type: Type.STRING, description: "Ide asesmen diagnostik. Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
        process: { type: Type.STRING, description: "Asesmen formatif (rubrik, observasi). Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
        final: { type: Type.STRING, description: "Asesmen sumatif (produk, portofolio). Kembalikan sebagai Daftar Tidak Terurut HTML (<ul><li>...</li></ul>)." },
      },
      required: ["initial", "process", "final"]
    },
    rubric: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Judul rubrik penilaian." },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING, description: "Kriteria/aspek penilaian." },
              score4: { type: Type.STRING, description: "Deskripsi untuk skor 4 (Sangat Baik)." },
              score3: { type: Type.STRING, description: "Deskripsi untuk skor 3 (Baik)." },
              score2: { type: Type.STRING, description: "Deskripsi untuk skor 2 (Cukup)." },
              score1: { type: Type.STRING, description: "Deskripsi untuk skor 1 (Perlu Bimbingan)." },
            },
            required: ["aspect", "score4", "score3", "score2", "score1"]
          }
        }
      },
      required: ["title", "rows"]
    }
  },
  required: ["studentCharacteristics", "crossDisciplinary", "topics", "partnerships", "environment", "digitalTools", "learningExperiences", "assessments", "rubric"]
};

export const generateRPM = async (data: FormData, apiKey: string): Promise<GeneratedContent> => {
  if (!apiKey) throw new Error("API Key wajib diisi.");

  const ai = getAI(apiKey);
  const pedagogies = data.meetings.map(m => `Pertemuan ${m.meetingNumber}: ${m.pedagogy}`).join(", ");
  const dimensions = data.dimensions.join(", ");

  const prompt = `
    Bertindaklah sebagai ahli kurikulum SD Indonesia. Buatlah konten Rencana Pembelajaran Mendalam (RPM) untuk SDN Pekayon 09.
    
    Data Input:
    - Kelas: ${data.classLevel}
    - Mapel: ${data.subject}
    - Materi: ${data.materi}
    - CP: ${data.cp}
    - TP: ${data.tp}
    - Dimensi Profil Lulusan (Profil Pelajar): ${dimensions}
    - Praktik Pedagogis per Pertemuan: ${pedagogies}

    Tugas:
    Lengkapi bagian-bagian rencana pembelajaran yang kosong berikut ini dengan bahasa Indonesia yang formal, edukatif, namun aplikatif.
    
    INSTRUKSI FORMATTING PENTING:
    Gunakan tag HTML <ul> dan <li> untuk membuat daftar poin agar output terlihat rapi.
    Gunakan tag HTML <ol> dan <li> untuk langkah-langkah kegiatan yang berurutan.

    1. Karakteristik Siswa: Deskripsikan karakteristik umum siswa kelas ${data.classLevel} SD. Format: <ul><li>...</li></ul>
    2. Lintas Disiplin Ilmu: Hubungkan materi ini dengan mata pelajaran lain. Format: <ul><li>...</li></ul>
    3. Topik Pembelajaran: Breakdown materi menjadi topik spesifik. Format: <ul><li>...</li></ul>
    4. Kemitraan: Siapa yang bisa dilibatkan (orang tua, ahli, lingkungan)? Format: <ul><li>...</li></ul>
    5. Lingkungan: Bagaimana pengaturan kelas atau luar kelas yang mendukung? Format: <ul><li>...</li></ul>
    6. Digital: Rekomendasi alat digital spesifik (misal: Quizizz, Canva, Youtube, dll). Format: <ul><li>...</li></ul>
    7. Pengalaman Belajar:
       - Memahami (Awal): Kegiatan pemantik yang 'berkesadaran/bermakna/menggembirakan'. Format: <ol><li>...</li></ol>
       - Mengaplikasi (Inti): Rangkaian kegiatan inti yang SANGAT SESUAI dengan sintaks ${pedagogies}. Format: <ol><li>...</li></ol>
       - Refleksi (Penutup): Kegiatan refleksi dan penutup. Format: <ol><li>...</li></ol>
    8. Asesmen: Ide untuk Asesmen Awal, Proses, dan Akhir. Semuanya Format: <ul><li>...</li></ul>
    9. Rubrik Penilaian: Buat tabel rubrik penilaian dengan skala 1-4.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: generatedContentSchema,
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as GeneratedContent;
  } catch (error) {
    console.error("Kesalahan pembuatan RPM:", error);
    throw error;
  }
};

const getPhase = (classLevel: string): 'FaseA' | 'FaseB' | 'FaseC' => {
  if (classLevel === ClassLevel.Kelas1 || classLevel === ClassLevel.Kelas2) return 'FaseA';
  if (classLevel === ClassLevel.Kelas3 || classLevel === ClassLevel.Kelas4) return 'FaseB';
  return 'FaseC';
};

export const getFieldSuggestions = async (
  field: 'cp' | 'tp' | 'materi',
  subject: Subject,
  classLevel: ClassLevel,
  apiKey: string,
  currentContext: string = "" 
): Promise<string[]> => {
    if (!apiKey) return ["Harap masukkan Kunci API terlebih dahulu."];

    const ai = getAI(apiKey);
    let fieldName = "";
    let promptContext = "";

    const phase = getPhase(classLevel);
    const officialCP = CP_REF[subject]?.[phase];

    if (field === 'cp') {
        fieldName = "Capaian Pembelajaran (CP)";
        if (officialCP) {
          promptContext = `Referensi CP RESMI: "${officialCP}". Berikan 5 variasi kalimat CP yang spesifik.`;
        } else {
          promptContext = `Berikan 5 opsi CP yang sesuai Kurikulum Merdeka untuk mata pelajaran ini.`;
        }
    } else if (field === 'tp') {
        fieldName = "Tujuan Pembelajaran (TP)";
        if (currentContext && currentContext.length > 5) {
           promptContext = `Berdasarkan CP: "${currentContext}", berikan 5 TP yang logis dan terukur.`;
        } else if (officialCP) {
           promptContext = `Gunakan referensi CP ini: "${officialCP}". Berikan 5 TP yang relevan.`;
        }
    } else if (field === 'materi') {
        fieldName = "Materi Pelajaran";
        if (currentContext) {
           promptContext = `Berdasarkan CP/TP: "${currentContext}", sarankan 5 topik materi pokok.`;
        }
    }

    const prompt = `
      Berikan 5 opsi pilihan ${fieldName} untuk mata pelajaran ${subject} Kelas ${classLevel} SD.
      ${promptContext}
      Output wajib JSON: { "options": ["opsi 1", "opsi 2", ...] }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const result = JSON.parse(response.text || "{}");
        return result.options || [];
    } catch (e) {
        console.error(e);
        return ["Gagal mengambil saran. Periksa Kunci API Anda."];
    }
};
