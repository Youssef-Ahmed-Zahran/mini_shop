import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle, RotateCcw } from "lucide-react-native";

interface Props {
  error?: Error;
  onRetry?: () => void;
}

export default function ErrorFallback({ error, onRetry }: Props) {
  return (
    <View className="flex-1 bg-surface items-center justify-center px-8">
      <View className="bg-error/10 rounded-full p-5 mb-6">
        <AlertTriangle color="#EF4444" size={40} />
      </View>
      <Text className="text-white text-2xl font-bold text-center mb-2">
        Oops! Something went wrong
      </Text>
      <Text className="text-muted text-sm text-center mb-2 leading-5">
        {error?.message ?? "An unexpected error occurred. Please try again."}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-6 bg-primary flex-row items-center gap-2 px-8 py-3 rounded-2xl active:opacity-80"
        >
          <RotateCcw color="#fff" size={18} />
          <Text className="text-white font-semibold text-base">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
