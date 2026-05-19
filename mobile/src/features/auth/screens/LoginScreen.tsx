import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail, Lock } from "lucide-react-native";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useAuth";
import AuthFormInput from "../components/AuthFormInput";

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [showPwd, setShowPwd] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginInput) => login(data);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-20 pb-10 px-8">
          <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-2xl font-bold">M</Text>
          </View>
          <Text className="text-light-text dark:text-white text-3xl font-bold mb-1">
            Welcome back
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm">
            Sign in to your Mini Shop account
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AuthFormInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                Icon={Mail}
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AuthFormInput
                label="Password"
                placeholder="••••••••"
                Icon={Lock}
                isPassword
                showPassword={showPwd}
                onTogglePassword={() => setShowPwd((p) => !p)}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end mb-6"
          >
            <Text className="text-primary text-sm font-semibold">
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-primary h-14 rounded-2xl items-center justify-center active:opacity-80"
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary text-sm font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
