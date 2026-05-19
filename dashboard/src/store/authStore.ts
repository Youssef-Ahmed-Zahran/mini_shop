import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "../lib/cookieStorage";
import type { User } from "../features/auth/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "mini-shop-admin-auth",
      storage: createJSONStorage(() => cookieStorage),
      // Only persist user info — the JWT HttpOnly cookie is browser-managed
      partialize: (state) => ({ user: state.user }),
    }
  )
);
