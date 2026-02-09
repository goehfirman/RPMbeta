import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { apiKey, payload } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `
Buatkan Rencana Pembelajaran dengan detail berikut:
${JSON.stringify(payload, null, 2)}
    `;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      data: result.response.text(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gemini API failed",
      detail: error.message,
    });
  }
}
