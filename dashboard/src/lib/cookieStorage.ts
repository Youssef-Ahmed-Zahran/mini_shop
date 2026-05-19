import type { StateStorage } from "zustand/middleware";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Strict`;
}

/** Zustand persist storage adapter backed by document.cookie */
export const cookieStorage: StateStorage = {
  getItem: (name) => getCookie(name),
  setItem: (name, value) => setCookie(name, value, COOKIE_MAX_AGE),
  removeItem: (name) => deleteCookie(name),
};
