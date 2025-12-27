import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0D0D0D",
          light: "#1A1A1A",
          dark: "#000000",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          light: "#F5F5F5",
          dark: "#E5E5E5",
        },
        accent: {
          DEFAULT: "#9E2045",
          dark: "#7F1836",
          light: "#D42E5F",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Inter", "Sora", "sans-serif"],
        ibm: ["IBM Plex Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
