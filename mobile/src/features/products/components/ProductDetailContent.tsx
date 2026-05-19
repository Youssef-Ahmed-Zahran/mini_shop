import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Minus,
  Plus,
  ShoppingCart,
  ImageIcon,
  Star,
} from "lucide-react-native";
import type { Product } from "../types";
import { useCartStore } from "../../../store/cartStore";

interface Props {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
  isLoading?: boolean;
}

const { width } = Dimensions.get("window");

export default function ProductDetailContent({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : [];

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View className="flex-1 bg-white dark:bg-surface">
      {/* Hero Image Carousel */}
      <View
        style={{ width, height: 300 }}
        className="bg-light-input dark:bg-surface-input items-center justify-center relative"
      >
        {images.length > 0 ? (
          <>
            <FlatList
              data={images}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width, height: 300 }}
                  resizeMode="cover"
                />
              )}
            />
            {images.length > 1 && (
              <View className="absolute bottom-4 flex-row justify-center w-full gap-2">
                {images.map((_, i) => (
                  <View
                    key={i}
                    className={`h-2 rounded-full ${
                      i === activeIndex ? "w-6 bg-primary" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <ImageIcon size={64} color="#8888AA" />
        )}
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Category badge */}
        <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-3">
          <Text className="text-primary text-xs font-semibold">
            {product.category_name}
          </Text>
        </View>

        <Text className="text-light-text dark:text-white text-2xl font-bold mb-2">
          {product.name}
        </Text>

        <View className="flex-row items-center gap-2 mb-4">
          <Star size={14} color="#FBBF24" fill="#FBBF24" />
          <Text className="text-light-muted dark:text-muted text-sm">
            4.8 (128 reviews)
          </Text>
        </View>

        <Text className="text-light-muted dark:text-muted text-sm leading-6 mb-6">
          {product.description}
        </Text>

        {/* Quantity Selector */}
        <View className="flex-row items-center gap-4 mb-6">
          <Text className="text-light-text dark:text-white text-sm font-semibold">
            Quantity
          </Text>
          <View className="flex-row items-center bg-light-card dark:bg-surface-card rounded-2xl overflow-hidden">
            <TouchableOpacity
              onPress={onDecrease}
              className="w-10 h-10 items-center justify-center active:bg-primary/20"
            >
              <Minus size={16} color={quantity <= 1 ? "#8888AA" : "#6C63FF"} />
            </TouchableOpacity>
            <Text className="text-light-text dark:text-white text-base font-bold w-8 text-center">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={onIncrease}
              className="w-10 h-10 items-center justify-center active:bg-primary/20"
            >
              <Plus size={16} color="#6C63FF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Price + CTA */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-light-muted dark:text-muted text-xs mb-1">
              Total Price
            </Text>
            <Text className="text-primary text-3xl font-bold">
              ${(Number(product.price) * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onAddToCart}
            className="bg-primary flex-row items-center gap-2 px-6 py-4 rounded-2xl active:opacity-80"
          >
            <ShoppingCart size={18} color="#fff" />
            <Text className="text-white font-bold text-base">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
