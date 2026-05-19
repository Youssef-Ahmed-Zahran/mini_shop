import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authApi } from "../features/auth/api/auth.api";
import { useAuthStore } from "../store/authStore";
import PageLoader from "../components/loader/PageLoader";

export default function ProtectedRoute() {
  const { user, setAuth, logout } = useAuthStore();
  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) return; // already hydrated from cookie storage

    // Verify the HttpOnly cookie is still valid by calling /auth/me
    authApi
      .me()
      .then((profile) => {
        if (profile.role !== "admin") {
          logout();
        } else {
          setAuth(profile);
        }
      })
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <PageLoader message="Verifying session…" />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
