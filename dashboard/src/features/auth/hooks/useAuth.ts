import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      if (data.user.role !== "admin") {
        toast.error("Access denied. Admin accounts only.");
        return;
      }
      // Token is in HttpOnly cookie — just save user info to store
      setAuth(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return async () => {
    try {
      await authApi.logout(); // clears HttpOnly cookie on the server
    } finally {
      logout();               // clears user from store
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success("If an account exists with this email, a reset link has been sent.");
    },
    onError: () => {
      toast.error("Failed to send reset link. Please try again.");
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ password, access_token }: { password: string; access_token: string }) =>
      authApi.resetPassword(password, access_token),
    onSuccess: () => {
      toast.success("Password updated successfully. You can now sign in.");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to reset password. The link might be expired.")
        : "Failed to reset password. The link might be expired.";
      toast.error(message);
    },
  });
};
