/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui"],
        heading: ["Sora", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe",
          400: "#a78bfa", 500: "#7c3aed", 600: "#6d28d9", 700: "#5b21b6",
        },
        accent: {
          50: "#eff6ff", 100: "#dbeafe",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        school: {
          primary: "#7c3aed", secondary: "#3b82f6", accent: "#f59e0b",
          neutral: "#0f172a", "neutral-content": "#e2e8f0",
          "base-100": "#ffffff", "base-200": "#f8fafc",
          "base-300": "#e2e8f0", "base-content": "#0f172a",
          info: "#0ea5e9", success: "#10b981", warning: "#f59e0b", error: "#ef4444",
        },
      },
      {
        dark: {
          primary: "#7c3aed", secondary: "#3b82f6", accent: "#f59e0b",
          neutral: "#020617", "neutral-content": "#e2e8f0",
          "base-100": "#1e293b", "base-200": "#0f172a",
          "base-300": "#334155", "base-content": "#f1f5f9",
          info: "#0ea5e9", success: "#10b981", warning: "#f59e0b", error: "#ef4444",
        },
      },
    ],
    defaultTheme: "school",
  },
};
