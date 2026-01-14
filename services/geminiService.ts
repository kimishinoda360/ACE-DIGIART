
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// @google/genai guidelines: Use process.env.API_KEY directly in the initialization object
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhancePrompt = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Enhance this image generation prompt to be more descriptive, artistic, and detailed. Keep it within 50 words: "${prompt}"`,
  });
  // @google/genai guidelines: Directly access the .text property of GenerateContentResponse
  return response.text || prompt;
};

export const generateImage = async (
  prompt: string, 
  aspectRatio: string, 
  referenceImages: string[]
): Promise<string> => {
  const ai = getAI();
  
  const contents = {
    parts: [
      { text: prompt },
      ...referenceImages.map(img => ({
        inlineData: {
          mimeType: 'image/png',
          data: img.split(',')[1]
        }
      }))
    ]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: contents,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any
      }
    }
  });

  // @google/genai guidelines: Iterate through all parts to find the image part (inlineData)
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const editImage = async (
  baseImage: string, 
  prompt: string
): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: baseImage.split(',')[1]
          }
        },
        { text: prompt }
      ]
    }
  });

  // @google/genai guidelines: Iterate through all parts to find the image part
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to edit image");
};

export const imageToPrompt = async (image: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: image.split(',')[1]
          }
        },
        { text: "Generate a simple, concise prompt describing this image for an AI image generator." }
      ]
    }
  });
  // @google/genai guidelines: Directly access the .text property
  return response.text || "No prompt generated.";
};
