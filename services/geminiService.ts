import { GoogleGenAI } from "@google/genai";
import { ModelMode } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Frontend AI Engineer. 
Your task is to generate a COMPLETE, SINGLE-FILE HTML solution based on the user's request.
The file must include ALL necessary CSS (inside <style> tags) and JavaScript (inside <script> tags).
Do not use external CSS/JS files unless using a CDN for popular libraries (like Tailwind, React, Vue via CDN is okay).
ENSURE the UI is modern, responsive, and aesthetically pleasing.
OUTPUT FORMAT: Return ONLY the raw HTML code. Do NOT wrap it in markdown code blocks (e.g., \`\`\`html ... \`\`\`). Do not add introductory text.
`;

export const generateAppCode = async (prompt: string, mode: ModelMode): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Select model based on mode
  // Fast mode uses gemini-3-flash-preview (Basic Text Tasks / Low Latency)
  // Thinking mode uses gemini-3-pro-preview (Complex Tasks / Reasoning)
  const modelName = mode === ModelMode.THINKING 
    ? 'gemini-3-pro-preview' 
    : 'gemini-3-flash-preview'; 

  // Configure thinking budget if in THINKING mode
  const thinkingConfig = mode === ModelMode.THINKING
    ? { thinkingBudget: 32768 } // Max budget for deep reasoning
    : undefined;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: thinkingConfig,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No code generated.");
    }

    // Cleanup: Remove markdown backticks if the model accidentally included them
    return text.replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '').trim();

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate code.");
  }
};