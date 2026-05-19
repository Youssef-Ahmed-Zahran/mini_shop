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
import { User, Mail, Lock } from "lucide-react-native";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useAuth";
import AuthFormInput from "../components/AuthFormInput";

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterInput) => register(data);

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
          <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-2xl font-bold">M</Text>
          </View>
          <Text className="text-light-text dark:text-white text-3xl font-bold mb-1">
            Create account
          </Text>
          <Text className="text-light-muted dark:text-muted text-sm">
            Join Mini Shop and start shopping
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-8 pb-8">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <AuthFormInput
                label="Full Name"
                placeholder="John Doe"
                Icon={User}
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <AuthFormInput
                label="Confirm Password"
                placeholder="••••••••"
                Icon={Lock}
                isPassword
                showPassword={showConfirm}
                onTogglePassword={() => setShowConfirm((p) => !p)}
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="bg-primary h-14 rounded-2xl items-center justify-center mt-2 active:opacity-80"
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-light-muted dark:text-muted text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-primary text-sm font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
