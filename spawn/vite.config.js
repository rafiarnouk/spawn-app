import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1/betaAccessSignUp": {
        target: "https://spawn-app-back-end-production.up.railway.app",
        changeOrigin: true,
      },
    },
  },
});
