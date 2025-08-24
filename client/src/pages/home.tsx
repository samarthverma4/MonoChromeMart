import { useState } from "react";
import Header from "@/components/header";
import FilterBar from "@/components/filter-bar";
import ProductGrid from "@/components/product-grid";
import CartBar from "@/components/cart-bar";
import ChatAssistant from "@/components/chat-assistant";
import { useCart } from "@/hooks/use-cart";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-white text-near-black">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
      />
      
      {/* Hero Section */}
      <section className="relative w-full h-96 bg-near-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Shop with AI-Powered Assistance
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl mx-auto">
              Discover products through natural conversation. Let our AI help you find exactly what you need.
            </p>
            <button 
              className="bg-white text-near-black px-8 py-3 rounded-full font-medium hover:bg-neutral-gray transition-all duration-150 uppercase tracking-wide text-sm min-h-[44px]"
              onClick={() => setIsChatOpen(true)}
              data-testid="button-start-shopping"
            >
              START SHOPPING
            </button>
          </div>
        </div>
      </section>

      <FilterBar 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <ProductGrid 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
      
      {cartItems.length > 0 && <CartBar />}
      
      <ChatAssistant 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
