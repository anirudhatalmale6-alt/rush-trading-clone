import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#111118",
          card: "#16161f",
          hover: "#1c1c28",
        },
        accent: {
          green: "#00d26a",
          red: "#ff4757",
          blue: "#4f8fff",
          purple: "#8b5cf6",
          yellow: "#fbbf24",
        },
        text: {
          primary: "#f0f0f5",
          secondary: "#8888a0",
          muted: "#555570",
        },
        border: {
          DEFAULT: "#222233",
          hover: "#333348",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
