import "../global.css";
import React, { Suspense, useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "../src/lib/queryClient";
import { ErrorBoundary as CustomErrorBoundary } from "../src/components/error-boundary/ErrorBoundary";
import PageLoader from "../src/components/loader/PageLoader";
import { useColorScheme } from "nativewind";
import { useUIStore } from "../src/store/uiStore";

// Inner component so hooks work inside QueryClientProvider
function ThemedApp() {
  const { setColorScheme } = useColorScheme();
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <CustomErrorBoundary>
        <Suspense fallback={<PageLoader message="Starting app..." />}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="product/[id]"
              options={{
                headerShown: true,
                title: "Product Details",
                headerBackTitle: "Back",
                headerStyle: {
                  backgroundColor: theme === "dark" ? "#1E1E2E" : "#FFFFFF",
                },
                headerTintColor: "#6C63FF",
                headerTitleStyle: {
                  color: theme === "dark" ? "#FFFFFF" : "#111827",
                  fontWeight: "700",
                },
              }}
            />
            <Stack.Screen
              name="order/[id]"
              options={{
                headerShown: true,
                title: "Order Details",
                headerBackTitle: "Back",
                headerStyle: {
                  backgroundColor: theme === "dark" ? "#1E1E2E" : "#FFFFFF",
                },
                headerTintColor: "#6C63FF",
                headerTitleStyle: {
                  color: theme === "dark" ? "#FFFFFF" : "#111827",
                  fontWeight: "700",
                },
              }}
            />
          </Stack>
        </Suspense>
      </CustomErrorBoundary>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemedApp />
    </QueryClientProvider>
  );
}

// Expo Router ErrorBoundary integration
import ErrorFallback from "../src/components/error-boundary/ErrorFallback";
export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return <ErrorFallback error={error} onRetry={retry} />;
}
