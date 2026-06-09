import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        bg: "#050a05",
        bg2: "#0a120a",
        card: "#0f180f",
        border: "#1a2e1a",
        green: { DEFAULT: "#4ade80", dark: "#16a34a", light: "#86efac" },
        brown: "#b45309",
        gold: "#fbbf24",
        rare: "#60a5fa",
        legendary: "#f59e0b",
        muted: "#4b6e4b",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(4deg)" },
        },
        pulseGreen: {
          "0%,100%": { boxShadow: "0 0 8px #4ade8040" },
          "50%": { boxShadow: "0 0 22px #4ade8090" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
}
export default config
