import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CP_REF } from "../data/cpReference";

const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

const generatedContentSchema: Schema = {
  // ⬅️ schema kamu PERSIS, tidak diubah
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { apiKey, action, payload } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API Key wajib diisi" });
    }

    const ai = getAI(apiKey);

    // ===== GENERATE RPM =====
    if (action === "generateRPM") {
      const data = payload;
      const pedagogies = data.meetings.map(
        (m: any) => `Pertemuan ${m.meetingNumber}: ${m.pedagogy}`
      ).join(", ");

      const dimensions = data.dimensions.join(", ");

      const prompt = `...PROMPT KAMU (TIDAK PERLU DIUBAH)...`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: generatedContentSchema,
        },
      });

      return res.status(200).json(JSON.parse(response.text || "{}"));
    }

    // ===== FIELD SUGGESTIONS =====
    if (action === "getFieldSuggestions") {
      const { field, subject, classLevel, currentContext } = payload;

      // 🔁 salin logika getFieldSuggestions kamu ke sini

      return res.status(200).json({ options });
    }

    return res.status(400).json({ error: "Action tidak dikenali" });

  } catch (err: any) {
    console.error("GEMINI ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
