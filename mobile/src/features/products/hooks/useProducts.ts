import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { productsApi, type GetProductsParams } from "../api/products.api";

export const productKeys = {
  all: ["products"] as const,
  list: (params: GetProductsParams) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  categories: () => ["categories"] as const,
};

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productsApi.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}
