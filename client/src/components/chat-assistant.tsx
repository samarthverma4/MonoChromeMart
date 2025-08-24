import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatAssistant({ isOpen, onClose }: ChatAssistantProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-testid="chat-assistant">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div 
        className={`fixed bg-white shadow-xl transition-transform duration-200 ease-in-out ${
          isMobile 
            ? "bottom-0 left-0 right-0 h-3/4 rounded-t-lg" 
            : "right-0 top-0 h-full w-full max-w-md"
        } ${isOpen ? "translate-x-0 translate-y-0" : isMobile ? "translate-y-full" : "translate-x-full"}`}
        data-testid="chat-panel"
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-gray">
          <h3 className="font-medium">Shopping Assistant</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-neutral-gray rounded-full transition-colors duration-150 min-w-[44px] min-h-[44px]"
            data-testid="button-close-chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-140px)]" data-testid="chat-messages">
          {messages.length === 0 && (
            <div className="flex items-start space-x-3">
              <div className="chat-bubble-assistant">
                <p className="text-sm">
                  Hi! I'm your shopping assistant. I can help you find products, check inventory, and guide you through your purchase. What are you looking for today?
                </p>
              </div>
            </div>
          )}

          {messages.map((message: any, index: number) => (
            <div key={index}>
              <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                <div className={message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {/* Product recommendations */}
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.products.map((product: Product) => (
                    <div key={product.id} className="border border-neutral-gray rounded p-3 bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-sm">${product.price}</span>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(product.id)}
                              className="text-xs px-3 py-1"
                              data-testid={`button-chat-add-to-cart-${product.id}`}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="chat-bubble-assistant">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-neutral-gray">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about products..."
              className="flex-1 px-3 py-2 border border-neutral-gray rounded text-sm focus:outline-none focus:ring-2 focus:ring-near-black focus:border-transparent"
              disabled={isLoading}
              data-testid="input-chat-message"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-near-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-150 min-w-[44px] min-h-[44px]"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
