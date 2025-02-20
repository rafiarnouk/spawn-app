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
      "/postRequest": {
        target:
          "https://spawn-app-back-end-production.up.railway.app/api/v1/betaAccessSignUp",
        changeOrigin: true, // Ensure the origin is changed to the target URL
        rewrite: (path) => path.replace(/^\/postRequest/, ""), // Remove the /postRequest prefix
      },
    },
  },
});
