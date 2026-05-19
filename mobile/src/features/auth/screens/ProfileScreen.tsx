import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Mail,
  Shield,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store/authStore";
import { useLogout } from "../../auth/hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white dark:bg-surface items-center justify-center px-8">
        <View className="bg-primary/10 rounded-full p-6 mb-4">
          <User size={48} color="#6C63FF" />
        </View>
        <Text className="text-light-text dark:text-white text-xl font-bold text-center mb-2">
          You're not signed in
        </Text>
        <Text className="text-light-muted dark:text-muted text-sm text-center mb-6">
          Sign in to view your profile and orders
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-primary px-10 py-3.5 rounded-2xl active:opacity-80"
        >
          <Text className="text-white font-bold text-base">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    {
      id: "orders",
      label: "My Orders",
      icon: ShoppingBag,
      onPress: () => router.push("/(tabs)/orders"),
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-surface"
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="pt-14 px-5 pb-6">
        <Text className="text-light-text dark:text-white text-2xl font-bold">
          Profile
        </Text>
      </View>

      {/* Avatar card */}
      <View className="bg-light-card dark:bg-surface-card mx-4 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center gap-4">
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-light-text dark:text-white text-lg font-bold">
              {user?.name}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Mail size={12} color="#8888AA" />
              <Text className="text-light-muted dark:text-muted text-xs">
                {user?.email}
              </Text>
            </View>
            {user?.role === "admin" && (
              <View className="flex-row items-center gap-1 mt-1">
                <Shield size={12} color="#6C63FF" />
                <Text className="text-primary text-xs font-semibold">
                  Admin
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Menu items */}
      <View className="bg-light-card dark:bg-surface-card mx-4 rounded-2xl overflow-hidden mb-4">
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            className={`flex-row items-center gap-3 px-5 py-4 active:opacity-70 ${
              idx < menuItems.length - 1
                ? "border-b border-light-input dark:border-surface-input"
                : ""
            }`}
          >
            <View className="bg-primary/10 w-9 h-9 rounded-xl items-center justify-center">
              <item.icon size={16} color="#6C63FF" />
            </View>
            <Text className="flex-1 text-light-text dark:text-white text-sm font-semibold">
              {item.label}
            </Text>
            <ChevronRight size={16} color="#8888AA" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-error/10 mx-4 rounded-2xl flex-row items-center gap-3 px-5 py-4 active:opacity-70"
      >
        <View className="bg-error/10 w-9 h-9 rounded-xl items-center justify-center">
          <LogOut size={16} color="#EF4444" />
        </View>
        <Text className="flex-1 text-error text-sm font-semibold">
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
