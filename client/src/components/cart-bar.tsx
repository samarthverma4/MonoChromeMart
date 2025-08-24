import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

export default function CartBar() {
  const { cartItems } = useCart();
  const [, setLocation] = useLocation();

  const totalItems = cartItems.reduce((sum: number, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum: number, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  if (cartItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-gray z-40" data-testid="cart-bar">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium" data-testid="text-cart-item-count">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
            <span className="text-muted-foreground" data-testid="text-cart-total">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/checkout")}
              className="text-sm hover:text-gray-600 transition-colors duration-150 min-h-[44px] px-4"
              data-testid="button-view-cart"
            >
              VIEW CART
            </Button>
            <Button
              onClick={() => setLocation("/checkout")}
              className="bg-near-black text-white px-6 py-2 rounded uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors duration-150 min-h-[44px]"
              data-testid="button-checkout"
            >
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
