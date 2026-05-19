import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";
import { Menu, Sun, Moon } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import PageLoader from "../loader/PageLoader";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-white transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center px-6 gap-4 shrink-0 transition-colors duration-200">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition bg-gray-100 dark:bg-gray-700 rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? "A"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content — one Suspense covers all lazy-loaded protected pages */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
