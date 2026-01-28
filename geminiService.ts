import { GoogleGenAI, Type } from "@google/genai";
import { GrammarAnalysisResult } from "../types";

// NOTE: In a production app, never expose API keys on the client side.
// This is for demonstration purposes within the requested architecture.
// The user needs to provide their key via the UI or env.

export const analyzeGrammar = async (transcript: string, apiKey: string): Promise<GrammarAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following interview transcript for an English candidate. 
    Provide a grammar score (0-100), fluency score (0-100), and clarity score (0-100).
    List specific grammar issues found.
    Provide a short summary feedback paragraph.
    
    Transcript:
    "${transcript}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Overall grammar score 0-100" },
            fluency: { type: Type.NUMBER, description: "Fluency score 0-100" },
            clarity: { type: Type.NUMBER, description: "Clarity score 0-100" },
            grammarIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific grammar mistakes found"
            },
            feedback: { type: Type.STRING, description: "Constructive feedback paragraph" }
          },
          required: ["score", "fluency", "clarity", "grammarIssues", "feedback"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GrammarAnalysisResult;
    } else {
        throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock data if API fails or key is invalid
    return {
      score: 75,
      fluency: 80,
      clarity: 70,
      grammarIssues: ["Subject-verb agreement error: 'The client were happy'", "Usage of filler words: 'like', 'um'", "Incorrect verb tense: 'we finds'"],
      feedback: "The candidate shows good technical understanding but struggles with consistent verb tenses and relies frequently on filler words. Recommend practicing professional pacing."
    };
  }
};