import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ordersApi, type CreateOrderPayload } from "../api/orders.api";
import { useCartStore } from "../../../store/cartStore";
import type { Order } from "../types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (page: number) => [...orderKeys.all, "list", page] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useMyOrders(page = 1) {
  return useQuery<Order[]>({
    queryKey: orderKeys.list(page),
    queryFn: () => ordersApi.getMyOrders(page),
    staleTime: 1000 * 60,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.createOrder(payload),
    onSuccess: () => {
      clearCart();
      qc.invalidateQueries({ queryKey: orderKeys.all });
      Alert.alert("Order Placed! 🎉", "Your order has been placed successfully.");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      Alert.alert("Order Failed", msg);
    },
  });
}
