import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ShoppingCart, ImageIcon } from "lucide-react-native";
import type { Product } from "../types";
import { useCartStore } from "../../../store/cartStore";

interface Props {
  product: Product;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const mainImage =
    product.image_url ||
    (product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : null);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/product/${product.id}`)}
      style={{ width: CARD_WIDTH }}
      className="bg-light-card dark:bg-surface-card rounded-2xl overflow-hidden mb-4 active:opacity-90"
    >
      {/* Image */}
      <View className="h-40 bg-light-input dark:bg-surface-input items-center justify-center">
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <ImageIcon size={36} color="#8888AA" />
        )}
      </View>

      {/* Info */}
      <View className="p-3">
        <Text
          className="text-light-text dark:text-white text-sm font-semibold leading-4 mb-1"
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text
          className="text-light-muted dark:text-muted text-xs mb-2"
          numberOfLines={1}
        >
          {product.category_name}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary text-base font-bold">
            ${Number(product.price).toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="bg-primary w-8 h-8 rounded-xl items-center justify-center active:opacity-80"
          >
            <ShoppingCart size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
