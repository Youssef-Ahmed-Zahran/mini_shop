import { useState } from "react";
import { Alert } from "react-native";
import { useProduct } from "../hooks/useProducts";
import { useCartStore } from "../../../store/cartStore";

export function useProductDetailModal(productId: string) {
  const { data: product, isLoading, isError, error } = useProduct(productId);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const addToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    Alert.alert(
      "Added to Cart! 🛒",
      `${quantity}× ${product.name} added to your cart.`
    );
  };

  return { product, isLoading, isError, error, quantity, increase, decrease, addToCart };
}
