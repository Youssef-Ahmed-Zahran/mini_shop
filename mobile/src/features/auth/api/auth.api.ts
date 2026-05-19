import { apiClient } from "../../../config/apiClient";
import type { ApiResponse } from "../../../types";
import type { User } from "../types";

interface AuthPayload {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthPayload> => {
    const res = await apiClient.post<ApiResponse<AuthPayload>>("/auth/login", {
      email,
      password,
    });
    return res.data.data;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthPayload> => {
    const res = await apiClient.post<ApiResponse<AuthPayload>>(
      "/auth/register",
      { name, email, password }
    );
    return res.data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      { email }
    );
    return res.data.data;
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/reset-password",
      { token, password }
    );
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};
