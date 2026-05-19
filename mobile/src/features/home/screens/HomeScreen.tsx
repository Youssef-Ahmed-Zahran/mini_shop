import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Search, Sun, Moon } from "lucide-react-native";
import { useAuthStore } from "../../../store/authStore";
import { useUIStore } from "../../../store/uiStore";
import ProductCard from "../../products/components/ProductCard";
import CategoryFilter from "../../products/components/CategoryFilter";
import PageLoader from "../../../components/loader/PageLoader";
import NotFoundPage from "../../../components/not-found/NotFoundPage";
import { useHomeScreenModal } from "../hooks/useHomeScreenModal";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    products,
    productsLoading,
    productsFetching,
    productsError,
    refetchProducts,
    categories,
  } = useHomeScreenModal();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchProducts();
    setRefreshing(false);
  };

  if (productsLoading && products.length === 0 && !refreshing) {
    return <PageLoader message="Loading products..." />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-surface">
      {/* Header */}
      <View className="pt-14 px-5 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-light-muted dark:text-muted text-sm">
              Hello, {user?.name?.split(" ")[0] ?? "Shopper"} 👋
            </Text>
            <Text className="text-light-text dark:text-white text-xl font-bold">
              What are you looking for?
            </Text>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            className="w-10 h-10 bg-light-card dark:bg-surface-card rounded-full items-center justify-center border border-light-input dark:border-surface-input"
          >
            {theme === "dark" ? (
              <Sun size={18} color="#8888AA" />
            ) : (
              <Moon size={18} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-light-card dark:bg-surface-card rounded-2xl px-4 h-12 gap-3 border border-light-input dark:border-surface-input">
          <Search size={18} color={theme === "dark" ? "#8888AA" : "#9CA3AF"} />
          <TextInput
            className="flex-1 text-light-text dark:text-white text-sm"
            placeholder="Search products..."
            placeholderTextColor={theme === "dark" ? "#8888AA" : "#9CA3AF"}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Subtle fetching indicator during filter/search transitions */}
      {productsFetching && !productsLoading && !refreshing && (
        <ActivityIndicator
          size="small"
          color="#6C63FF"
          style={{ marginVertical: 6 }}
        />
      )}

      {/* Products grid */}
      {productsError ? (
        <NotFoundPage
          title="Failed to load"
          message="We couldn't fetch products. Pull to refresh."
          showBack={false}
        />
      ) : products.length === 0 ? (
        <NotFoundPage
          title="No products found"
          message="Try adjusting your search or category filter."
          showBack={false}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          renderItem={({ item }) => <ProductCard product={item} />}
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
