import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
}

export default function ProductGrid({ searchQuery, selectedCategory }: ProductGridProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-h2">
          {searchQuery ? `Search results for "${searchQuery}"` : 
           selectedCategory ? `${selectedCategory} Products` : 
           'Featured Products'}
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-small text-muted-foreground" data-testid="text-product-count">
            {products.length} products
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-gray rounded-card overflow-hidden">
              <div className="w-full h-48 bg-neutral-gray animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-gray rounded animate-pulse" />
                <div className="h-3 bg-neutral-gray rounded animate-pulse" />
                <div className="h-6 bg-neutral-gray rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-h2 mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory 
              ? "Try adjusting your search or filters" 
              : "No products available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-neutral-gray rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
              data-testid={`card-product-${product.id}`}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-small mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold" data-testid={`text-product-price-${product.id}`}>
                    ${product.price}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock || product.inventory === 0}
                    className="bg-near-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors duration-150 uppercase tracking-wide min-h-[44px]"
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    {product.inStock && product.inventory > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
