
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message } from "../types";

/**
 * Creates a new instance of GoogleGenAI using the most up-to-date API key.
 * The API key is automatically injected into process.env.API_KEY by the platform.
 */
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Conducts a multi-turn chat with search grounding.
 */
export async function chatWithAI(prompt: string, history: Message[] = []): Promise<Message> {
  const ai = getAI();
  const contents = history.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents,
    config: {
      systemInstruction: "You are the helpful AI business advisor for Izouran Bio. Provide strategic advice, marketing ideas, and analysis of sales metrics. Be professional and focused on growth.",
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });

  const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title || 'Source' }));

  return {
    role: 'model',
    text: response.text || "No response generated.",
    timestamp: Date.now(),
    groundingUrls
  };
}

/**
 * Generates marketing images using the high-quality Gemini 3 Pro Image model.
 */
export async function generateImageAI(prompt: string, config: { aspectRatio: string; imageSize: string }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio as any,
        imageSize: config.imageSize as any
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  for (const part of parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

/**
 * Generates promotional videos using Veo.
 */
export async function generateVideoAI(prompt: string, startImageBase64?: string) {
  const ai = getAI();
  const options: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  };

  if (startImageBase64) {
    options.image = {
      imageBytes: startImageBase64.split(',')[1],
      mimeType: 'image/png'
    };
  }

  let operation = await ai.models.generateVideos(options);
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return null;

  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Analyzes business documents for key metrics.
 */
export async function analyzeFileAI(fileBase64: string, prompt: string, mimeType: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: fileBase64.split(',')[1], mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
}
