import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ImageIcon,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCartScreenModal } from "../hooks/useCartScreenModal";
import { useCartStore } from "../../../store/cartStore";

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isAuthenticated,
    checkout,
    isCheckingOut,
  } = useCartScreenModal();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to place an order.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }
    if (items.length === 0) return;
    checkout();
  };

  return (
    <View className="flex-1 bg-white dark:bg-surface">
      {/* Header */}
      <View className="pt-14 px-5 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-light-text dark:text-white text-2xl font-bold">
            My Cart
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm mt-1">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Clear Cart", "Remove all items?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () => useCartStore.getState().clearCart(),
                },
              ])
            }
            className="bg-error/10 px-3 py-2 rounded-xl"
          >
            <Text className="text-error text-xs font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-primary/10 rounded-full p-6 mb-4">
            <ShoppingCart size={48} color="#6C63FF" />
          </View>
          <Text className="text-light-text dark:text-white text-xl font-bold text-center mb-2">
            Your cart is empty
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm text-center mb-6">
            Add some items to get started
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary px-8 py-3 rounded-2xl active:opacity-80"
          >
            <Text className="text-white font-bold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 160,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-light-card dark:bg-surface-card rounded-2xl p-4 mb-3 flex-row gap-3">
                {/* Image */}
                <View className="w-16 h-16 bg-light-input dark:bg-surface-input rounded-xl overflow-hidden items-center justify-center">
                  {item.product.image_url ? (
                    <Image
                      source={{ uri: item.product.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <ImageIcon size={20} color="#8888AA" />
                  )}
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text
                    className="text-white text-sm font-semibold mb-0.5"
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <Text className="text-primary font-bold text-base mb-2">
                    ${Number(item.product.price).toFixed(2)}
                  </Text>

                  {/* Quantity + Remove */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-light-input dark:bg-surface-input rounded-xl overflow-hidden">
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Minus
                          size={12}
                          color={item.quantity <= 1 ? "#8888AA" : "#6C63FF"}
                        />
                      </TouchableOpacity>
                      <Text className="text-white text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Plus size={12} color="#6C63FF" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.product.id)}
                      className="bg-error/10 w-8 h-8 rounded-xl items-center justify-center"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Line total */}
                <View className="items-end justify-center">
                  <Text className="text-white font-bold text-sm">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Footer checkout bar */}
          <View className="absolute bottom-0 left-0 right-0 bg-light-card dark:bg-surface-card border-t border-light-input dark:border-surface-input px-5 py-5">
            <View className="flex-row justify-between mb-4">
              <Text className="text-light-muted dark:text-muted text-sm font-semibold">
                Total
              </Text>
              <Text className="text-primary text-xl font-bold">
                ${Number(total).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="bg-primary h-14 rounded-2xl items-center justify-center active:opacity-80"
            >
              {isCheckingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Place Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
