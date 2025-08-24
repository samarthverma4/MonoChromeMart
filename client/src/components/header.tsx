import { MessageCircle, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatToggle: () => void;
}

export default function Header({ searchQuery, onSearchChange, onChatToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-gray">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight cursor-pointer" data-testid="link-home">
              GLIDE
            </h1>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-gray rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-near-black focus:border-transparent transition-all duration-150 pr-10"
              data-testid="input-search"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatToggle}
            className="p-2 hover:bg-neutral-gray rounded-full transition-colors duration-150 min-w-[44px] min-h-[44px]"
            data-testid="button-toggle-chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-neutral-gray rounded-full transition-colors duration-150 min-w-[44px] min-h-[44px]"
              data-testid="link-admin"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
