import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "../storage";
import type { Product } from "@shared/schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBYta0_8d1oX0jK9_LaWHSFfJsshw4WD_g';

const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-pro" });

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
    const prompt = `You are a shopping assistant that analyzes user messages to understand their shopping intent.
Classify the following message into one of these intents:
- "search": User wants to find specific products
- "recommend": User wants product recommendations
- "add_to_cart": User wants to add a product to cart
- "get_info": User wants information about a specific product
- "general": General conversation or unclear intent

Also extract these parameters if mentioned:
- query: search terms or product names
- category: product category
- priceRange: budget (min/max in dollars)
- productId: specific product reference

Message: "${message}"

Respond with ONLY a JSON object in this format:
{"intent": "search", "query": "wireless headphones", "category": "electronics", "priceRange": {"min": 0, "max": 150}}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    if (!response.text()) {
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text();
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Invalid JSON from Gemini API:", text);
      throw new Error("Failed to parse AI response");
    }
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
    let prompt = `You are Glide's AI shopping assistant. Help customers find products and make purchasing decisions.

Key guidelines:
- Be helpful, friendly, and concise
- Focus on product benefits and features
- Always mention specific prices when discussing products
- Use natural, conversational language
- Keep responses under 200 words
- Never make up product information - only use provided data

User message: "${userMessage}"
Intent: ${intent.intent}
`;

    if (products && products.length > 0) {
      prompt += "\nAvailable products:\n";
      products.forEach(product => {
        prompt += `- ${product.name}: $${product.price}\n  ${product.description}\n  Category: ${product.category}\n  In stock: ${product.inventory} units\n\n`;
      });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
  }
}

export async function processShoppingQuery(message: string): Promise<{
  response: string;
  products?: Product[];
  intent: ShoppingIntent;
}> {
  const intent = await analyzeShoppingIntent(message);
  let products: Product[] = [];
  
  try {
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
      intent,
    };
  } catch (error) {
    console.error("Error processing shopping query:", error);
    return {
      response: "I'm having trouble understanding your request. Could you please try rephrasing it?",
      intent,
    };
  }
}
