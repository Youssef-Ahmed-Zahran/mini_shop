import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return null; // Return null to let the Splash Screen or Layout loader show
  }

  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
