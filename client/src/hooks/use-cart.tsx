import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartItemWithProduct } from "@shared/schema";

export function useCart() {
  const [sessionId, setSessionId] = useState<string>("");

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("cart-session-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("cart-session-id", id);
    }
    setSessionId(id);
  }, []);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['/api/cart', sessionId],
    queryFn: async () => {
      if (!sessionId) return { items: [], sessionId: "" };
      
      const response = await fetch('/api/cart', {
        headers: {
          'x-session-id': sessionId,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    },
    enabled: !!sessionId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiRequest('POST', '/api/cart', 
        { productId, quantity },
        { 'x-session-id': sessionId }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/cart', undefined, {
        'x-session-id': sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const addToCart = async (productId: string, quantity: number = 1) => {
    return addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    return updateQuantityMutation.mutateAsync({ id, quantity });
  };

  const removeFromCart = async (id: string) => {
    return removeFromCartMutation.mutateAsync(id);
  };

  const clearCart = async () => {
    return clearCartMutation.mutateAsync();
  };

  return {
    cartItems: (cartData?.items as CartItemWithProduct[]) || [],
    sessionId: cartData?.sessionId || sessionId,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
}
