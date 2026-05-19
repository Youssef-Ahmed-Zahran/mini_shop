import React from "react";
import { useLocalSearchParams } from "expo-router";
import PageLoader from "../../../components/loader/PageLoader";
import NotFoundPage from "../../../components/not-found/NotFoundPage";
import OrderDetailContent from "../components/OrderDetailContent";
import { useOrder } from "../hooks/useOrders";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id ?? "");

  if (isLoading) return <PageLoader message="Loading order..." />;

  if (isError || !order) {
    return (
      <NotFoundPage
        title="Order Not Found"
        message="This order doesn't exist or you don't have access to it."
      />
    );
  }

  return <OrderDetailContent order={order} />;
}
