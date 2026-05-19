import React from "react";
import { useLocalSearchParams } from "expo-router";
import PageLoader from "../../../components/loader/PageLoader";
import NotFoundPage from "../../../components/not-found/NotFoundPage";
import ProductDetailContent from "../components/ProductDetailContent";
import { useProductDetailModal } from "../hooks/useProductDetailModal";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    product,
    isLoading,
    isError,
    quantity,
    increase,
    decrease,
    addToCart,
  } = useProductDetailModal(id ?? "");

  if (isLoading) return <PageLoader message="Loading product..." />;

  if (isError || !product) {
    return (
      <NotFoundPage
        title="Product Not Found"
        message="This product doesn't exist or has been removed."
      />
    );
  }

  return (
    <ProductDetailContent
      product={product}
      quantity={quantity}
      onIncrease={increase}
      onDecrease={decrease}
      onAddToCart={addToCart}
    />
  );
}
