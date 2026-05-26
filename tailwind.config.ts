import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Saira'", "sans-serif"],
        body: ["'Fira Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
