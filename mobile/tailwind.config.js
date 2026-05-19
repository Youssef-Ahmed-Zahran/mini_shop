/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C63FF",
          50:  "#F0EFFE",
          100: "#DDD9FD",
          200: "#BCB5FB",
          300: "#9A90F9",
          400: "#796BF8",
          500: "#6C63FF",
          600: "#5248CC",
          700: "#3D3799",
          800: "#292566",
          900: "#141233",
        },
        accent: {
          DEFAULT: "#FF6584",
          50:  "#FFF0F3",
          100: "#FFDDE4",
          200: "#FFBBC9",
          300: "#FF99AE",
          400: "#FF7793",
          500: "#FF6584",
          600: "#CC5169",
          700: "#993D4F",
          800: "#662934",
          900: "#33141A",
        },
        // Dark mode colors (default / used in dark theme)
        surface: {
          DEFAULT: "#1E1E2E",
          card:    "#27273A",
          input:   "#313150",
        },
        muted: "#8888AA",
        // Light mode overrides
        light: {
          surface: "#F9FAFB",
          card:    "#FFFFFF",
          input:   "#F3F4F6",
          muted:   "#6B7280",
          text:    "#111827",
        },
        success: "#4ADE80",
        warning: "#FBBF24",
        error:   "#EF4444",
      },
    },
  },
  plugins: [],
};
