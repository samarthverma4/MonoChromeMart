import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        products: data.products,
        timestamp: new Date(),
      }]);
    },
    onError: (error) => {
      console.error("Chat request failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble understanding your request right now. Could you please try rephrasing it?",
        error: errorMessage,
        timestamp: new Date(),
      }]);
    },
  });

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    return chatMutation.mutateAsync(content);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: chatMutation.isPending,
  };
}
