import React from "react";
import { Stack } from "expo-router";
import { ErrorBoundary } from "../../src/components/error-boundary/ErrorBoundary";

export default function AuthLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </ErrorBoundary>
  );
}
