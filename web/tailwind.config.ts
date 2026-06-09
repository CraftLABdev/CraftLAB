import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        sans:  ["Inter", "sans-serif"],
      },
      colors: {
        bg:     "#f7f5ef",
        bg2:    "#f0ede4",
        card:   "#ffffff",
        border: "#e2ded5",
        green:  { DEFAULT: "#16a34a", light: "#22c55e", pale: "#dcfce7", dark: "#15803d" },
        text:   "#141410",
        muted:  "#6b7260",
        light:  "#a8a89a",
      },
    },
  },
  plugins: [],
}
export default config
