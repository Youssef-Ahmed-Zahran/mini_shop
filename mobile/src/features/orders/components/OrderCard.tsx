import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react-native";
import type { Order, OrderStatus } from "../types";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; Icon: typeof Clock }
> = {
  pending: { label: "Pending", color: "#FBBF24", Icon: Clock },
  processing: { label: "Processing", color: "#6C63FF", Icon: Package },
  delivered: { label: "Delivered", color: "#4ADE80", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#EF4444", Icon: XCircle },
};

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const router = useRouter();
  const { label, color, Icon } = STATUS_CONFIG[order.status];

  return (
    <TouchableOpacity
      onPress={() => router.push(`/order/${order.id}`)}
      className="bg-light-card dark:bg-surface-card rounded-2xl p-4 mb-3 active:opacity-90"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-light-text dark:text-white font-semibold text-sm">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </Text>
        <ChevronRight size={16} color="#8888AA" />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: `${color}20` }}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
          >
            <Icon size={12} color={color} />
            <Text style={{ color }} className="text-xs font-semibold">
              {label}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-muted text-xs mb-0.5">
            {new Date(order.created_at).toLocaleDateString()}
          </Text>
          <Text className="text-primary font-bold text-base">
            ${Number(order.total_amount).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
