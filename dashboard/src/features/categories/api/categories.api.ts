import { apiClient } from "../../../config/apiClient";
import type { ApiResponse } from "../../../types";
import type { Category } from "../types";

export const categoriesApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories");
    return data.data;
  },

  create: async (payload: { name: string; slug: string }) => {
    const { data } = await apiClient.post<ApiResponse<Category>>("/categories", payload);
    return data.data;
  },

  update: async (id: string, payload: { name?: string; slug?: string }) => {
    const { data } = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/categories/${id}`);
    return data.data;
  },
};
