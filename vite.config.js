import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Relative path to our plugin file
          ["./scripts/babel-plugin-extract-ai-button.cjs", {}],
        ],
      },
    }),
  ],
});
