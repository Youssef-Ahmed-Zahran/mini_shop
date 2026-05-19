import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface Props {
  message?: string;
}

export default function PageLoader({ message }: Props) {
  return (
    <View className="flex-1 bg-white dark:bg-surface items-center justify-center gap-4">
      <View className="bg-primary/10 rounded-full p-5">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
      {message && (
        <Text className="text-light-muted dark:text-muted text-sm font-medium">
          {message}
        </Text>
      )}
    </View>
  );
}
