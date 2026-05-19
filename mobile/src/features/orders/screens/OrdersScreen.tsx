import React, { useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import OrderCard from "../components/OrderCard";
import PageLoader from "../../../components/loader/PageLoader";
import { useMyOrders } from "../hooks/useOrders";

export default function OrdersScreen() {
  const { data, isLoading, refetch } = useMyOrders();
  const [refreshing, setRefreshing] = React.useState(false);

  // Refetch whenever the screen comes into focus.
  // React Query's structural equality check means no re-render
  // fires unless the data actually changed (e.g. status updated).
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const orders = data ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return <PageLoader message="Loading orders..." />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-surface">
      {/* Header */}
      <View className="pt-14 px-5 pb-4">
        <Text className="text-light-text dark:text-white text-2xl font-bold">
          My Orders
        </Text>
        <Text className="text-light-muted dark:text-muted text-sm mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-primary/10 rounded-full p-5 mb-4">
            <ShoppingBag size={40} color="#6C63FF" />
          </View>
          <Text className="text-light-text dark:text-white text-xl font-bold text-center mb-2">
            No orders yet
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm text-center">
            When you place an order, it'll show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6C63FF"
            />
          }
        />
      )}
    </View>
  );
}
