"use client";

import { useState } from "react";
import { Button } from "@ggprompts/ui";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export interface AddToCartButtonProps {
  productId: string;
  productSlug?: string;
  productName: string;
  productBrand?: string;
  productPrice: string;
  productImage: string;
  quantity?: number;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  className?: string;
  color?: string | null;
  productSize?: string | null;
}

export function AddToCartButton({
  productId,
  productSlug,
  productName,
  productBrand = "",
  productPrice,
  productImage,
  quantity = 1,
  variant = "default",
  size = "default",
  disabled = false,
  className,
  color,
  productSize,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Use the CartProvider's addItem function for consistent cart management
      addItem(
        {
          productId,
          slug: productSlug || productId,
          name: productName,
          brand: productBrand,
          price: parseFloat(productPrice),
          image: productImage,
          color: color || undefined,
          size: productSize || undefined,
        },
        quantity
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
