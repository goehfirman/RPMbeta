
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, GeneratedContent, Subject, ClassLevel } from "../types";
import { CP_REF } from "../data/cpReference";

const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

const generatedContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    studentCharacteristics: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    crossDisciplinary: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    topics: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    partnerships: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    environment: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    digitalTools: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
    learningExperiences: {
      type: Type.OBJECT,
      properties: {
        memahami: { type: Type.STRING, description: "Daftar Terurut (<ol><li>...</li></ol>)." },
        mengaplikasi: { type: Type.STRING, description: "Daftar Terurut (<ol><li>...</li></ol>)." },
        refleksi: { type: Type.STRING, description: "Daftar Terurut (<ol><li>...</li></ol>)." },
      },
      required: ["memahami", "mengaplikasi", "refleksi"]
    },
    assessments: {
      type: Type.OBJECT,
      properties: {
        initial: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
        process: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
        final: { type: Type.STRING, description: "Daftar HTML (<ul><li>...</li></ul>)." },
      },
      required: ["initial", "process", "final"]
    },
    rubric: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING },
              score4: { type: Type.STRING },
              score3: { type: Type.STRING },
              score2: { type: Type.STRING },
              score1: { type: Type.STRING },
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
  const pedagogies = data.meetings.map(m => `P${m.meetingNumber}: ${m.pedagogy}`).join(", ");
  const dimensions = data.dimensions.join(", ");

  const prompt = `
    Bertindaklah sebagai Konsultan Kurikulum Merdeka Senior untuk SDN Pekayon 09.
    Tugas: Membuat Rencana Pembelajaran Mendalam (RPM) profesional.
    
    Data:
    - Kelas: ${data.classLevel}, Mapel: ${data.subject}, Materi: ${data.materi}
    - CP: ${data.cp}, TP: ${data.tp}
    - Profil Lulusan: ${dimensions}
    - Strategi: ${pedagogies}

    Berikan output dalam Bahasa Indonesia formal sesuai standar pendidikan di Jakarta.
    Gunakan tag HTML <ul>/<li> untuk daftar dan <ol>/<li> untuk langkah-langkah kegiatan inti yang harus sesuai dengan sintaks model pembelajaran yang dipilih.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: generatedContentSchema,
        temperature: 0.7
      }
    });
    return JSON.parse(response.text || "{}") as GeneratedContent;
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
    if (!apiKey) return ["Kunci API Kosong"];
    const ai = getAI(apiKey);
    const phase = getPhase(classLevel);
    const officialCP = CP_REF[subject]?.[phase] || "";

    const prompt = `Berikan 5 saran profesional untuk bidang ${field} pada mata pelajaran ${subject} Kelas ${classLevel} SD (Fase ${phase}). ${officialCP ? 'Gunakan referensi CP ini: ' + officialCP : ''} ${currentContext ? 'Konteks saat ini: ' + currentContext : ''}. Output JSON: { "options": ["...", "..."] }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { options: { type: Type.ARRAY, items: { type: Type.STRING } } }
                }
            }
        });
        const result = JSON.parse(response.text || "{}");
        return result.options || [];
    } catch (e) {
        return ["Gagal memuat saran AI"];
    }
};
