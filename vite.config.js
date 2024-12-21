// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            path.resolve(
              __dirname,
              "scripts",
              "babel-plugin-extract-ai-components.cjs"
            ),
            {},
          ],
        ],
      },
    }),
  ],
});
