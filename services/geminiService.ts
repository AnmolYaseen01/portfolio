
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MODELS, SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

export class GeminiService {
  /**
   * Always instantiate GoogleGenAI right before making an API call 
   * to ensure it uses the most up-to-date API key.
   */
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeDocument(base64Data: string, mimeType: string) {
    const response = await this.ai.models.generateContent({
      model: MODELS.PRO,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analyze this legal document. Provide a summary, identify potential risks, explain key legal terms simply, and list recommended next steps for a citizen in Pakistan." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            simplifiedTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["term", "meaning"]
              }
            }
          },
          required: ["summary", "risks", "nextSteps", "simplifiedTerms"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  async translateAnalysis(analysis: AnalysisResult): Promise<AnalysisResult> {
    const response = await this.ai.models.generateContent({
      model: MODELS.FLASH,
      contents: {
        parts: [
          { text: `Translate the following legal analysis into Roman Urdu (Urdu written in English alphabets).
          Analysis to translate:
          ${JSON.stringify(analysis)}` }
        ]
      },
      config: {
        systemInstruction: "You are a translation expert focusing on Roman Urdu for Pakistani citizens. Ensure legal terms are explained accurately.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            simplifiedTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["term", "meaning"]
              }
            }
          },
          required: ["summary", "risks", "nextSteps", "simplifiedTerms"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  async chatStream(message: string, history: any[], options: { useThinking?: boolean, useSearch?: boolean, useMaps?: boolean, latLng?: { latitude: number, longitude: number } }) {
    let model = MODELS.LITE;
    let config: any = { systemInstruction: SYSTEM_INSTRUCTION };

    if (options.useThinking) {
      model = MODELS.PRO;
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else if (options.useSearch) {
      model = MODELS.FLASH;
      config.tools = [{ googleSearch: {} }];
    } else if (options.useMaps) {
      model = MODELS.MAPS;
      config.tools = [{ googleMaps: {} }];
      if (options.latLng) {
        config.toolConfig = { retrievalConfig: { latLng: options.latLng } };
      }
    }

    return await this.ai.models.generateContentStream({
      model,
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      config
    });
  }

  async transcribeAudio(base64Audio: string) {
    const response = await this.ai.models.generateContent({
      model: MODELS.FLASH,
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: "audio/wav" } },
          { text: "Transcribe this audio precisely." }
        ]
      }
    });
    return response.text;
  }
}

export const gemini = new GeminiService();
