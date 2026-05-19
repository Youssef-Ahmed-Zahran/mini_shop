import { useState } from "react";
import { useProducts, useCategories } from "../../products/hooks/useProducts";
import useDebounce from "../../../hooks/useDebounce";

export function useHomeScreenModal() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 400);

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts({ search: debouncedSearch, category_id: selectedCategory });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    debouncedSearch,
    products: productsData?.data ?? [],
    productsMeta: productsData?.meta,
    productsLoading,
    productsFetching,
    productsError,
    refetchProducts,
    categories: categories ?? [],
    categoriesLoading,
  };
}
