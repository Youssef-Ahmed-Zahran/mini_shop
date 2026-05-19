import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff, LucideIcon } from "lucide-react-native";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  Icon?: LucideIcon;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function AuthFormInput({
  label,
  error,
  Icon,
  isPassword,
  showPassword,
  onTogglePassword,
  ...rest
}: Props) {
  return (
    <View className="mb-4">
      <Text className="text-light-muted dark:text-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-light-input dark:bg-surface-input rounded-2xl px-4 h-14 border ${
          error ? "border-error" : "border-light-input dark:border-transparent"
        }`}
      >
        {Icon && <Icon size={18} color="#8888AA" style={{ marginRight: 10 }} />}
        <TextInput
          className="flex-1 text-light-text dark:text-white text-base"
          placeholderTextColor="#8888AA"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && onTogglePassword && (
          <TouchableOpacity onPress={onTogglePassword} className="p-1">
            {showPassword ? (
              <EyeOff size={18} color="#8888AA" />
            ) : (
              <Eye size={18} color="#8888AA" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-error text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
