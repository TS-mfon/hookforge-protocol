import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          black: "#050607",
          panel: "#0b1010",
          line: "#1f2c2c",
          cyan: "#35f4ff",
          green: "#89ff8f",
          amber: "#ffca5f",
          red: "#ff5b6e",
          ink: "#edf7f5"
        }
      },
      boxShadow: {
        glow: "0 0 48px rgba(53, 244, 255, 0.18)",
        green: "0 0 40px rgba(137, 255, 143, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
