import React from "react";
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
import { Mail, ArrowLeft } from "lucide-react-native";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/useAuth";
import AuthFormInput from "../components/AuthFormInput";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => forgotPassword(data);

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
        <View className="pt-16 pb-8 px-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-light-card dark:bg-surface-card rounded-full items-center justify-center mb-6"
          >
            <ArrowLeft size={18} color="#6C63FF" />
          </TouchableOpacity>

          <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Mail size={28} color="#6C63FF" />
          </View>
          <Text className="text-light-text dark:text-white text-3xl font-bold mb-1">
            Forgot password?
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm leading-5">
            No worries! Enter your email and we'll send you a reset link.
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AuthFormInput
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                Icon={Mail}
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-primary h-14 rounded-2xl items-center justify-center mt-4 active:opacity-80"
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="flex-row justify-center mt-6"
          >
            <Text className="text-light-muted dark:text-muted text-sm">
              Remember your password?{" "}
            </Text>
            <Text className="text-primary text-sm font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
