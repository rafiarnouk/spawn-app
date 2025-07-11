import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs"

// Function to get the current API port
function getApiPort() {
  try {
    // Check if port file exists and read it
    if (fs.existsSync('./.api-port')) {
      const port = fs.readFileSync('./.api-port', 'utf8').trim();
      return port;
    }
  } catch (err) {
    console.warn("Could not read API port file:", err.message);
  }
  
  // Default fallback port
  return process.env.API_PORT || '3001';
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy only admin auth requests to our local Express server
      '/api/auth': {
        target: `http://localhost:${getApiPort()}`,
        changeOrigin: true,
      }
    }
  }
});
