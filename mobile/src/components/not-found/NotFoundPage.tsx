import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SearchX, ArrowLeft } from "lucide-react-native";

interface Props {
  title?: string;
  message?: string;
  showBack?: boolean;
}

export default function NotFoundPage({
  title = "Not Found",
  message = "The page or resource you're looking for doesn't exist.",
  showBack = true,
}: Props) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface items-center justify-center px-8">
      <View className="bg-primary/10 rounded-full p-5 mb-6">
        <SearchX color="#6C63FF" size={44} />
      </View>
      <Text className="text-white text-2xl font-bold text-center mb-2">
        {title}
      </Text>
      <Text className="text-muted text-sm text-center leading-5">
        {message}
      </Text>
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-surface-card flex-row items-center gap-2 px-8 py-3 rounded-2xl active:opacity-80 border border-primary/20"
        >
          <ArrowLeft color="#6C63FF" size={18} />
          <Text className="text-primary font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
