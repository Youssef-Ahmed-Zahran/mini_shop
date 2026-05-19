import { apiClient } from "../../../config/apiClient";
import type { ApiResponse, PaginatedResponse } from "../../../types";
import type { Product } from "../types";
import type { Category } from "../../categories/types";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
}

export const productsApi = {
  getProducts: async (
    params: GetProductsParams = {}
  ): Promise<PaginatedResponse<Product>> => {
    const res = await apiClient.get<PaginatedResponse<Product> & { statusCode: number }>(
      "/products",
      { params: { page: 1, limit: 12, ...params } }
    );
    return res.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<ApiResponse<Category[]>>("/categories");
    return res.data.data;
  },
};
