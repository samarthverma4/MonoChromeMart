import { GoogleGenAI } from "@google/genai";
import { storage } from "../storage";
import type { Product } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ProductRecommendation {
  products: Product[];
  reasoning: string;
}

export interface ShoppingIntent {
  intent: "search" | "recommend" | "add_to_cart" | "get_info" | "general";
  query?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  productId?: string;
}

export async function analyzeShoppingIntent(message: string): Promise<ShoppingIntent> {
  try {
    const systemPrompt = `You are a shopping assistant that analyzes user messages to understand their shopping intent.
Classify the user's message into one of these intents:
- "search": User wants to find specific products
- "recommend": User wants product recommendations
- "add_to_cart": User wants to add a product to cart
- "get_info": User wants information about a specific product
- "general": General conversation or unclear intent

Extract relevant parameters:
- query: search terms or product names
- category: product category if mentioned
- priceRange: if user mentions budget (min/max in dollars)
- productId: if referring to a specific product

Respond with JSON in this exact format:
{"intent": "search", "query": "wireless headphones", "category": "electronics", "priceRange": {"min": 0, "max": 150}}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            intent: { 
              type: "string", 
              enum: ["search", "recommend", "add_to_cart", "get_info", "general"] 
            },
            query: { type: "string" },
            category: { type: "string" },
            priceRange: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" }
              }
            },
            productId: { type: "string" }
          },
          required: ["intent"]
        }
      },
      contents: message,
    });

    const result = JSON.parse(response.text || '{"intent": "general"}');
    return result;
  } catch (error) {
    console.error("Error analyzing shopping intent:", error);
    return { intent: "general" };
  }
}

export async function searchProducts(query: string, priceRange?: { min: number; max: number }): Promise<Product[]> {
  let products = await storage.searchProducts(query);
  
  if (priceRange) {
    products = products.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });
  }
  
  return products.slice(0, 6); // Limit to 6 results
}

export async function getProductRecommendations(
  category?: string, 
  priceRange?: { min: number; max: number }
): Promise<Product[]> {
  let products = category 
    ? await storage.getProductsByCategory(category)
    : await storage.getProducts();
  
  if (priceRange) {
    products = products.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });
  }
  
  // Shuffle and return top 4 recommendations
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

export async function generateChatResponse(
  userMessage: string, 
  intent: ShoppingIntent,
  products?: Product[]
): Promise<string> {
  try {
    let systemPrompt = `You are Glide's AI shopping assistant. You help customers find products and make purchasing decisions.

Key guidelines:
- Be helpful, friendly, and concise
- Focus on product benefits and features
- Always mention specific prices when discussing products
- Use natural, conversational language
- If showing multiple products, format them in a clean, readable way
- For product details, include: name, price, key features
- Keep responses under 200 words
- Never hallucinate product information - only use provided data`;

    let contextPrompt = `User message: "${userMessage}"\nIntent: ${intent.intent}\n`;
    
    if (products && products.length > 0) {
      contextPrompt += `\nAvailable products:\n`;
      products.forEach(product => {
        contextPrompt += `- ${product.name}: $${product.price}\n  ${product.description}\n  Category: ${product.category}\n  In stock: ${product.inventory} units\n\n`;
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contextPrompt,
    });

    return response.text || "I'm sorry, I couldn't process your request right now. Please try again.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm experiencing some technical difficulties. Please try again in a moment.";
  }
}

export async function processShoppingQuery(message: string): Promise<{
  response: string;
  products?: Product[];
  intent: ShoppingIntent;
}> {
  const intent = await analyzeShoppingIntent(message);
  let products: Product[] = [];
  
  switch (intent.intent) {
    case "search":
      if (intent.query) {
        products = await searchProducts(intent.query, intent.priceRange);
      }
      break;
      
    case "recommend":
      products = await getProductRecommendations(intent.category, intent.priceRange);
      break;
      
    case "get_info":
      if (intent.productId) {
        const product = await storage.getProduct(intent.productId);
        if (product) products = [product];
      } else if (intent.query) {
        products = await searchProducts(intent.query);
        products = products.slice(0, 1); // Just the best match
      }
      break;
  }
  
  const response = await generateChatResponse(message, intent, products);
  
  return {
    response,
    products: products.length > 0 ? products : undefined,
    intent
  };
}
