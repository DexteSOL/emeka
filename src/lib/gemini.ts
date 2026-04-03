import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: 'Burgers' | 'Chicken' | 'Breakfast' | 'Beverages' | 'Desserts';
  image: string;
}

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Big Mac',
    description: 'Two 100% beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.',
    price: 5.99,
    calories: 550,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/bigmac/400/300'
  },
  {
    id: '2',
    name: 'Quarter Pounder with Cheese',
    description: 'A quarter pound of 100% fresh beef that’s sizzled on our flat iron grill.',
    price: 6.49,
    calories: 520,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/qpc/400/300'
  },
  {
    id: '3',
    name: 'McChicken',
    description: 'Crispy chicken patty topped with shredded lettuce and just the right amount of mayonnaise.',
    price: 3.99,
    calories: 400,
    category: 'Chicken',
    image: 'https://picsum.photos/seed/mcchicken/400/300'
  },
  {
    id: '4',
    name: 'Egg McMuffin',
    description: 'A fresh-cracked Grade A egg on a toasted English Muffin topped with real butter.',
    price: 4.29,
    calories: 310,
    category: 'Breakfast',
    image: 'https://picsum.photos/seed/eggmcmuffin/400/300'
  },
  {
    id: '5',
    name: 'Large Fries',
    description: 'World Famous Fries®, crisp and golden on the outside, fluffy on the inside.',
    price: 3.49,
    calories: 490,
    category: 'Burgers',
    image: 'https://picsum.photos/seed/fries/400/300'
  },
  {
    id: '6',
    name: 'Oreo McFlurry',
    description: 'Creamy vanilla soft serve swirled with OREO® cookie pieces.',
    price: 4.99,
    calories: 510,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/mcflurry/400/300'
  }
];

export async function getAIAssistantResponse(prompt: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: ${context}\n\nUser: ${prompt}`,
      config: {
        systemInstruction: "You are a helpful McDonald's AI assistant. You help users find items on the menu, suggest meals based on their preferences, and answer questions about McDonald's. Keep responses concise, friendly, and appetite-triggering.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I'm having a bit of trouble connecting to the kitchen right now. How else can I help you?";
  }
}

export async function getMealRecommendation(preferences: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user wants: ${preferences}. Based on the McDonald's menu, suggest a perfect meal combo.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
            totalCalories: { type: Type.NUMBER }
          },
          required: ["mealName", "items", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Recommendation Error:", error);
    return null;
  }
}
