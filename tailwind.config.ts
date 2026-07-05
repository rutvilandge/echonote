import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--bg)",
          soft: "var(--bg-soft)",
          line: "var(--border)",
        },
        paper: "var(--text)",
        muted: "var(--muted)",
        signal: {
          DEFAULT: "#E8A33D",
          dim: "#8A6427",
        },
        synth: {
          DEFAULT: "#4FD1C5",
          dim: "#2C7A72",
        },
        danger: "#E8654A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        wave1: "wave 1.1s ease-in-out infinite",
        wave2: "wave 1.1s ease-in-out infinite 0.15s",
        wave3: "wave 1.1s ease-in-out infinite 0.3s",
        wave4: "wave 1.1s ease-in-out infinite 0.1s",
        wave5: "wave 1.1s ease-in-out infinite 0.25s",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
