import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Lesson {
  topic: string;
  whatIsIt: string;
  details: string;
  funFact: string;
  vocabulary: { word: string; definition: string }[];
  phrases: { phrase: string; usage: string }[];
  grammarTip: string;
}

export async function generateLesson(imageBase64?: string, textTopic?: string): Promise<Lesson> {
  const parts = [];
  
  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    
    parts.push({
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: base64Data
      }
    });
    parts.push({ text: "Identify the main object, concept, or situation in this image. Then, generate a 'tiny lesson' about it. The lesson should be engaging, easy to understand, and structured into: What it is, How it works or why it matters, a Fun Fact, relevant vocabulary words, useful phrases for this situation, and a grammar tip." });
  } else if (textTopic) {
    parts.push({ text: `Generate a 'tiny lesson' about the situation or topic: ${textTopic}. The lesson should be engaging, easy to understand, and structured into: What it is, How it works or why it matters, a Fun Fact, relevant vocabulary words, useful phrases for this situation, and a grammar tip.` });
  } else {
    throw new Error("Must provide either an image or a text topic.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The identified topic or the provided topic." },
          whatIsIt: { type: Type.STRING, description: "A brief, engaging explanation of what it is." },
          details: { type: Type.STRING, description: "How it works or why it is important." },
          funFact: { type: Type.STRING, description: "A surprising or interesting fun fact." },
          vocabulary: {
            type: Type.ARRAY,
            description: "3-5 relevant vocabulary words related to the topic or situation.",
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING }
              },
              required: ["word", "definition"]
            }
          },
          phrases: {
            type: Type.ARRAY,
            description: "2-3 useful phrases or sentences related to the topic or situation.",
            items: {
              type: Type.OBJECT,
              properties: {
                phrase: { type: Type.STRING },
                usage: { type: Type.STRING, description: "When or how to use this phrase." }
              },
              required: ["phrase", "usage"]
            }
          },
          grammarTip: { type: Type.STRING, description: "A relevant grammar tip or rule that applies to talking about this topic." }
        },
        required: ["topic", "whatIsIt", "details", "funFact", "vocabulary", "phrases", "grammarTip"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate lesson.");
  }

  return JSON.parse(response.text) as Lesson;
}
