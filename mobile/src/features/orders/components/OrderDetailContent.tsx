import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ImageIcon,
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

export default function OrderDetailContent({ order }: Props) {
  const { label, color, Icon } = STATUS_CONFIG[order.status];

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-surface"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Status Hero */}
      <View className="bg-light-card dark:bg-surface-card mx-4 mt-4 rounded-2xl p-5 mb-4">
        <View className="items-center">
          <View
            style={{ backgroundColor: `${color}15` }}
            className="w-16 h-16 rounded-full items-center justify-center mb-3"
          >
            <Icon size={30} color={color} />
          </View>
          <Text style={{ color }} className="text-lg font-bold mb-1">
            {label}
          </Text>
          <Text className="text-light-muted dark:text-muted text-xs">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Summary */}
      <View className="bg-light-card dark:bg-surface-card mx-4 rounded-2xl p-5 mb-4">
        <Text className="text-light-text dark:text-white font-bold text-base mb-4">
          Order Summary
        </Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-light-muted dark:text-muted text-sm">Date</Text>
          <Text className="text-light-text dark:text-white text-sm">
            {new Date(order.created_at).toLocaleString()}
          </Text>
        </View>
        <View className="h-px bg-light-input dark:bg-surface-input my-3" />
        <View className="flex-row justify-between">
          <Text className="text-light-muted dark:text-muted text-sm font-semibold">
            Total
          </Text>
          <Text className="text-primary font-bold text-lg">
            ${Number(order.total_amount).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <View className="bg-light-card dark:bg-surface-card mx-4 rounded-2xl p-5">
          <Text className="text-light-text dark:text-white font-bold text-base mb-4">
            Items
          </Text>
          {order.items.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center gap-3 mb-4 last:mb-0"
            >
              <View className="w-14 h-14 bg-light-input dark:bg-surface-input rounded-xl overflow-hidden items-center justify-center">
                {item.product_image ? (
                  <Image
                    source={{ uri: item.product_image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <ImageIcon size={20} color="#8888AA" />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className="text-light-text dark:text-white text-sm font-semibold mb-0.5"
                  numberOfLines={1}
                >
                  {item.product_name}
                </Text>
                <Text className="text-light-muted dark:text-muted text-xs">
                  {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                </Text>
              </View>
              <Text className="text-primary font-bold text-sm">
                ${(item.quantity * Number(item.unit_price)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
