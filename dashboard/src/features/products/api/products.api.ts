import { apiClient } from "../../../config/apiClient";
import type { ApiResponse, PaginatedResponse } from "../../../types";
import type { Product } from "../types";
import type { Category } from "../../categories/types";

export const productsApi = {
  getAll: async (params?: {
    search?: string;
    category_id?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>("/products", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },

  create: async (payload: {
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_base64?: string;
    image_name?: string;
  }) => {
    const { data } = await apiClient.post<ApiResponse<Product>>("/products", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<{
      name: string;
      description: string;
      price: number;
      category_id: string;
      is_active: boolean;
      image_base64: string;
      image_name: string;
    }>
  ) => {
    const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/products/${id}`);
    return data.data;
  },

  getCategories: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories");
    return data.data;
  },
};
