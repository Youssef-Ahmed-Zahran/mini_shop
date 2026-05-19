import { lazy, type ReactNode, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { queryClient } from "./lib/queryClient";
import ProtectedRoute from "./router/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import NotFoundPage from "./components/not-found/NotFoundPage";

import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import { useUIStore } from "./store/uiStore";

const DashboardPage = lazy(
  () => import("./features/dashboard/pages/DashboardPage"),
);
const ProductsPage = lazy(
  () => import("./features/products/pages/ProductsPage"),
);
const CategoriesPage = lazy(
  () => import("./features/categories/pages/CategoriesPage"),
);
const OrdersPage = lazy(() => import("./features/orders/pages/OrdersPage"));

function PageRoute({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default function App() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PageRoute>
                  <LoginPage />
                </PageRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageRoute>
                  <ForgotPasswordPage />
                </PageRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PageRoute>
                  <ResetPasswordPage />
                </PageRoute>
              }
            />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route
                  path="/"
                  element={
                    <PageRoute>
                      <DashboardPage />
                    </PageRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <PageRoute>
                      <CategoriesPage />
                    </PageRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <PageRoute>
                      <ProductsPage />
                    </PageRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PageRoute>
                      <OrdersPage />
                    </PageRoute>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1e1e2e",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
