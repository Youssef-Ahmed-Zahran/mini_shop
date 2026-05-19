import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/authStore";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
} from "../schemas/auth.schema";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data.email, data.password),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      router.replace("/(tabs)");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      Alert.alert("Login Failed", msg);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      authApi.register(data.name, data.email, data.password),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      router.replace("/(tabs)");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      Alert.alert("Registration Failed", msg);
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordInput) =>
      authApi.forgotPassword(data.email),
    onSuccess: () => {
      Alert.alert(
        "Check Your Email",
        "If that email exists, you'll receive a reset link shortly.",
        [{ text: "Back to Login", onPress: () => router.replace("/(auth)/login") }]
      );
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      Alert.alert("Error", msg);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    router.replace("/(auth)/login");
  };
}
