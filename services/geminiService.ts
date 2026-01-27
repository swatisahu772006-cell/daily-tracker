
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AIInsight } from "../types";

/**
 * Service to interact with the Google Gemini API.
 */

export const getAIProductivityInsights = async (tasks: Task[]): Promise<AIInsight> => {
  const taskSummary = tasks.map(t => `- [${t.completed ? 'X' : ' '}] ${t.title} (${t.category})`).join('\n');
  
  const prompt = `Analyze the following daily routine and provide productivity insights:
  
  Current Tasks:
  ${taskSummary}
  
  Please provide:
  1. A brief summary of the current day's focus.
  2. 3 actionable suggestions to improve efficiency or balance.
  3. A short motivational quote tailored to this specific routine.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            motivationalQuote: { type: Type.STRING }
          },
          required: ["summary", "suggestions", "motivationalQuote"]
        }
      }
    });

    const text = response.text?.trim() || '{}';
    const result = JSON.parse(text);
    return {
      summary: result.summary || "Making steady progress.",
      suggestions: result.suggestions || ["Keep going."],
      motivationalQuote: result.motivationalQuote || "Focus on the next small step."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "I'm here to support your routine.",
      suggestions: ["Stay focused on your goals."],
      motivationalQuote: "Progress over perfection."
    };
  }
};

/**
 * Specifically generates a one-line mantra and a Hinglish explanation based on current performance data
 */
export interface PerformanceMantraResponse {
  mantra: string;
  explanation: string;
}

export const getPerformanceMantra = async (tasks: Task[]): Promise<PerformanceMantraResponse> => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const rate = total > 0 ? (completed / total) * 100 : 0;
  
  const prompt = `Generate a daily motivation based on performance:
  - Tasks Completed: ${completed} out of ${total}
  - Success Rate: ${Math.round(rate)}%
  
  Instructions:
  1. "mantra": A punchy English motivational quote (max 12 words).
  2. "explanation": A very short, encouraging explanation of the mantra in Romanized Hindi (Hinglish) using English letters only.
  
  Example explanation style: "Aaj aapne kamaal kar diya, bas aise hi lage raho!" or "Dheere dheere hi sahi, par aap sahi raaste par ho."
  
  Provide response as JSON.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mantra: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["mantra", "explanation"]
        }
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    return {
      mantra: data.mantra || "Keep pushing forward.",
      explanation: data.explanation || "Bas thoda aur, aap manzil ke kareeb ho!"
    };
  } catch (error) {
    return {
      mantra: "Focus on the small wins.",
      explanation: "Choti jeet hi badi kamyabi ka raasta hai."
    };
  }
};

export const generateRoutineFromGoal = async (goal: string): Promise<Partial<Task>[]> => {
  const prompt = `Create a balanced daily routine for someone whose goal is: "${goal}". 
  Provide a list of 5-8 structured tasks with titles, categories (Work, Health, Personal, Learning, Chores, Other), and suggested times.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              time: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "category", "time"]
          }
        }
      }
    });

    const text = response.text?.trim() || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Routine Generation Error:", error);
    return [];
  }
};
