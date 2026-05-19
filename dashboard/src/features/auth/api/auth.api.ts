import { apiClient } from "../../../config/apiClient";
import type { ApiResponse } from "../../../types";
import type { User } from "../types";

export const authApi = {
  login: async (email: string, password: string) => {
    // Backend sets the HttpOnly cookie; we only get user info back
    const { data } = await apiClient.post<ApiResponse<{ user: User }>>(
      "/auth/login",
      { email, password }
    );
    return data.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  me: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", { email });
    return data.data;
  },

  resetPassword: async (password: string, access_token: string) => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", { password, access_token });
    return data.data;
  },
};
